import "dotenv/config";
import express from "express";
import path from "path";
import "./src/common/config/dbConnection";
import swaggerMainRoute from "./src/common/swagger";
import helmet from "helmet";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet()); // Adds security-related headers to the responses

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("App is working!");
});

app.use(swaggerMainRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
