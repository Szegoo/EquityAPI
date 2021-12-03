import { PrivateKey, Client, ThreadID } from "@textile/hub";
import { employeeSchema } from "./schema";
import { Employee } from "./employee";
require("dotenv").config();
console.log(process.env.SECRET);

const keyinfo = {
  key: "bl2h343auadpiwcxwi3jv4e2yhi",
  secret: process.env.SECRET,
};
async function generate() {
  const client = await Client.withKeyInfo(keyinfo);
  //const threadId: ThreadID = await client.newDB(undefined, 'empdb1');
  const thread = await client.getThread("empdb1");
  const threadId: ThreadID = ThreadID.fromString(thread.id);
  console.log(await client.listCollections(threadId));
  await client.newCollection(threadId, {
    name: "EmployeesDB",
    schema: employeeSchema,
  });

  console.log(await client.listCollections(threadId));
}
export async function addEmployee(
  wallet: string,
  bloxicoMail: string,
  email: string
) {
  const client = await Client.withKeyInfo(keyinfo);
  const thread = await client.getThread("empdb1");
  const employee = await getEmployee(bloxicoMail);
  if (typeof employee !== typeof undefined) {
    return;
  }

  const threadId: ThreadID = ThreadID.fromString(thread.id);

  client.create(threadId, "EmployeesDB", [
    {
      wallet,
      bloxicoMail,
      email,
      activity: [],
      updated: 0,
    },
  ]);
}
export async function setActivity(activity: number, bloxicoMail: string) {
  const client = await Client.withKeyInfo(keyinfo);
  const thread = await client.getThread("empdb1");
  const threadId: ThreadID = ThreadID.fromString(thread.id);
  const employee: Employee = await getEmployee(bloxicoMail);
  if (employee.updated > Date.now() - 1000 * 3600 * 24) {
    return;
  }
  employee.activity.push(activity);
  employee.updated = Date.now();
  await client.delete(threadId, "EmployeesDB", [employee._id]);
  await client.create(threadId, "EmployeesDB", [
    {
      updated: employee.updated,
      wallet: employee.wallet,
      email: employee.email,
      bloxicoMail: employee.bloxicoMail,
      activity: employee.activity,
    },
  ]);
}
export async function getEmployee(bloxicoMail: string): Promise<any> {
  const client = await Client.withKeyInfo(keyinfo);
  const thread = await client.getThread("empdb1");
  const threadId: ThreadID = ThreadID.fromString(thread.id);
  const employee = (
    await client.find(threadId, "EmployeesDB", {
      ands: [
        {
          fieldPath: "bloxicoMail",
          value: {
            string: bloxicoMail,
          },
        },
      ],
    })
  )[0];
  return employee;
}
export async function getEmployeeByIndx(indx: number): Promise<Employee> {
  const employeesDB = await getEmployees();

  return employeesDB[indx];
}
export async function getEmployees(): Promise<Employee[]> {
  const client = await Client.withKeyInfo(keyinfo);
  const thread = await client.getThread("empdb1");

  const threadId: ThreadID = ThreadID.fromString(thread.id);

  const employeesDB: Employee[] = await client.find(
    threadId,
    "EmployeesDB",
    {}
  );

  return employeesDB;
}
