import express from "express";
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
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
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

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Proof of Equity API",
      description: "API that is used together with poe-ui and poe-contract",
    },
  },
  apis: ["src/swagger.yaml"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(bodyParser.json());

app.get("/remove", shouldRemove);

app.get("/number-of-employees", countInactive);

app.get("/employee", getInactiveEmployees);

app.post("/add-employee", addEmployee);

app.listen(process.env.PORT || config.port, () => {
  console.log("listening on port " + config.port);
});
