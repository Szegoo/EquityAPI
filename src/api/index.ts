import express, { Request, Response } from "express";
import { config } from "../config";
import {
  shouldRemove,
  countInactive,
  getInactiveEmployees,
} from "./controllers/removalController";
import { addEmployee } from "./controllers/employeeController";
import cors from "cors";
import bodyParser from "body-parser";
import schedule from "node-schedule";
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

app.use(cors());
app.use(bodyParser.json());

app.get("/remove", shouldRemove);

app.get("/number-of-employees", countInactive);

app.get("/employee", getInactiveEmployees);

app.post("/add-employee", addEmployee);

app.listen(process.env.PORT || config.port, () => {
  console.log("listening on port " + config.port);
});
