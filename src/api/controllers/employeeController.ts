import { Request, Response } from "express";
import { addEmployee as addEmp} from "../../db";

export async function addEmployee(req: Request, res: Response) {
    const { list } = req.body;
    console.log(list);

    for (let i = 0; i < list.length; i++) {
      await addEmp(list[i].employee, list[i].bloxicoMail, list[i].email);
    }
}