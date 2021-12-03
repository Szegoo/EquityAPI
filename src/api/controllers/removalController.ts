import { Request, Response } from "express";
import { getEmployees } from "../../db";
import { isActive, getInactive } from "../helpers";

export async function shouldRemove(req: Request, res: Response) {
  const employees = await getEmployees();
  let remove = false;
  for (let i = 0; i < employees.length; i++) {
    const active = await isActive(
      employees[i].bloxicoMail,
      employees[i].email,
      true,
    );
    if (!active) {
      remove = true;
      break;
    }
  }
  res.json({ "remove ": remove });
}

export async function countInactive(req: Request, res: Response) {
  console.log("get number called");
  const inactive = await getInactive();
  res.json({ number: inactive.length });
}

export async function getInactiveEmployees(req: Request, res: Response) {
  const { indx } = req.query;
  console.log("get employee called");
  const inactive = await getInactive();
  console.log(inactive);
  res.json({ employee: inactive[Number(indx)].wallet });
}
