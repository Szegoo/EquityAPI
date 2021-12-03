import express, { Request, Response } from "express";
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
const date = new Date(2023, today.getMonth(), today.getDay(), 1);
schedule.scheduleJob(date, () => {
  sendList();
});

const corsOptions = {
  origin: "http://127.0.0.1:8080",
};

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get("/remove", shouldRemove);

app.get("/number-of-employees", countInactive);

app.get("/employee", getInactiveEmployees);

app.post("/add-employee", addEmployee);

app.listen(process.env.PORT || port, () => {
  console.log("listening on port " + port);
});
