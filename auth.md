auth-system/
│
├── models/
│ ├── User.js
│ ├── Token.js
│
├── routes/
│ ├── auth.js
│
├── middleware/
│ ├── authMiddleware.js
│
├── config/
│ ├── passport.js
│
├── utils/
│ ├── generateTokens.js
│
├── jobs/
│ ├── tokenCleanupJob.js
│
├── server.js
├── .env

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
if (this.isModified('password')) {
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
}
next();
});

userSchema.methods.comparePassword = async function(password) {
return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
tokenId: { type: String, required: true },
deviceId: { type: String, required: true },
expiresAt: { type: Date, required: true },
}, { timestamps: true });

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired tokens

module.exports = mongoose.model('Token', tokenSchema);

<!-- Generate Tokens (utils/generateTokens.js) -->

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateTokenId = () => crypto.randomBytes(32).toString('hex');

const generateTokens = (userId, deviceId) => {
const tokenId = generateTokenId();
const accessToken = jwt.sign({ id: userId, deviceId }, process.env.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ id: userId, deviceId, tokenId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken, tokenId };

};

module.exports = generateTokens;

<!-- ----------------------------------------------------------------------------------------- -->

const passport = require('passport');

module.exports = (req, res, next) => {
passport.authenticate('jwt', { session: false }, (err, user) => {
if (err || !user) {
return res.status(401).json({ error: 'Unauthorized.' });
}
req.user = user;
next();
})(req, res, next);
};

<!-- ----------------------------------------------------------------------------------------- -->

const cron = require('node-cron');
const Token = require('../models/Token');

// Run a job every day at midnight to remove expired tokens
cron.schedule('0 0 \* \* \*', async () => {
try {
const result = await Token.deleteMany({ expiresAt: { $lte: new Date() } });
console.log(`Token cleanup job removed ${result.deletedCount} expired tokens.`);
} catch (error) {
console.error('Error running token cleanup job:', error);
}
});

<!-- ----------------------------------------------------------------------------------------- -->

const { Strategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const dotenv = require('dotenv');
dotenv.config();

const opts = {
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
passport.use(new Strategy(opts, async (payload, done) => {
try {
const user = await User.findById(payload.id);
if (user) return done(null, user);
return done(null, false);
} catch (err) {
return done(err, false);
}
}));
};

<!-- ----------------------------------------------------------------------------------------- -->

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/Token');
const User = require('../models/User');
const generateTokens = require('../utils/generateTokens');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for login
const loginLimiter = rateLimit({
windowMs: 15 _ 60 _ 1000, // 15 minutes
max: 5, // Limit to 5 requests per IP
message: 'Too many login attempts, please try again later.',
});

// Register
router.post('/register', async (req, res) => {
try {
const { email, password } = req.body;
const user = new User({ email, password });
await user.save();
res.status(201).json({ message: 'User registered successfully!' });
} catch (err) {
res.status(500).json({ error: 'Error registering user.' });
}
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
try {
const { email, password, deviceId } = req.body;
const user = await User.findOne({ email });
if (!user || !(await user.comparePassword(password))) {
return res.status(401).json({ error: 'Invalid credentials.' });
}

        const { accessToken, refreshToken, tokenId } = generateTokens(user._id, deviceId);

        await new Token({
            userId: user._id,
            tokenId,
            deviceId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }).save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in.' });
    }

});

// Refresh
router.post('/refresh', async (req, res) => {
try {
const { refreshToken } = req.cookies;
if (!refreshToken) return res.status(403).json({ error: 'No refresh token provided.' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const storedToken = await Token.findOne({ userId: decoded.id, tokenId: decoded.tokenId });
        if (!storedToken) return res.status(403).json({ error: 'Invalid refresh token.' });

        const { accessToken, refreshToken: newRefreshToken, tokenId } = generateTokens(decoded.id, decoded.deviceId);

        storedToken.tokenId = tokenId;
        storedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await storedToken.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired refresh token.' });
    }

});

// Logout
router.post('/logout', async (req, res) => {
try {
const { deviceId } = req.body;
await Token.deleteMany({ deviceId });
res.clearCookie('refreshToken');
res.status(200).json({ message: 'Logged out successfully.' });
} catch (err) {
res.status(500).json({ error: 'Error logging out.' });
}
});

module.exports = router;

<!-- ----------------------------------------------------------------------------------------- -->

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
require('./jobs/tokenCleanupJob'); // Scheduled job

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
require('./config/passport')(passport);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
