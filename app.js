import "dotenv/config";
import express from "express";
import path from "path";
import "./src/common/config/dbConnection";
import swaggerMainRoute from "./src/common/swagger";
import mainRoute from "./routes/index";
import helmet from "helmet";
import "./src/common/config/jwtPassport";
import rateLimit from "express-rate-limit";
import "./migrations/20241228160634-add-new-field";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet()); // Adds security-related headers to the responses

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("*", (req, res, next) => {
  console.log(`API hit: ${req.method} ${req.originalUrl}`);
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// app.use(limiter);

app.get("/", (req, res) => {
  res.status(200).send("App is working!");
});

app.use(swaggerMainRoute);
app.use(mainRoute);

app.use(express.static(path.join(__dirname + "/public")));
app.use(require("./src/common/middleware/error"));

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
