import express from "express";
import {
  getInactiveEmployees,
  shouldRemove,
  countInactive,
} from "../controllers/removalController";
import { addEmployee } from "../controllers/employeeController";
let router = express.Router();

router.route("/employee").get(getInactiveEmployees);

router.route("/add-employee").post(addEmployee);

router.route("/remove").get(shouldRemove);

router.route("/number-of-employees").get(countInactive);

export default router;
