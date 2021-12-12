import express from "express";
import { config } from "../config";
import cors from "cors";
import bodyParser from "body-parser";
import schedule from "node-schedule";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import homeRoute from "./routes/home";
import { checkActivity, sendList } from "./services/contractServices";

schedule.scheduleJob("0 10 * * *", () => {
  checkActivity();
});
const today = new Date();
const date = new Date(today.getFullYear(), today.getMonth(), today.getDay(), 1);
schedule.scheduleJob(date, () => {
  sendList();
});

const app = express();

const swaggerDocs = swaggerJsDoc(config.swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(bodyParser.json());
app.use("/", homeRoute);

app.listen(process.env.PORT || config.port, () => {
  console.log("listening on port " + config.port);
});
