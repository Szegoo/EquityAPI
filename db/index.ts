import {PrivateKey, Client, ThreadID} from '@textile/hub';
import {employeeSchema} from './schema';
import {Employee} from './employee';
require('dotenv').config();
console.log(process.env.SECRET);

const keyinfo = {
    key: 'b52fhd7edjbnfqpnmcwvri6pkta',
    secret: process.env.SECRET
}
async function generate () {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.newDB(undefined, 'test1');

    await client.newCollection(thread, {name: 'Employees', schema: employeeSchema});
    return client;
}
export async function addEmployee(wallet: string, bloxicoMail: string, email: string) {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.getThread('test1');
    const employee = await getEmployee(bloxicoMail);
    if(typeof employee !== typeof undefined) {
        return;
    }

    const threadId: ThreadID = ThreadID.fromString(thread.id); 

    client.create(threadId, 'Employees', [{
        wallet,
        bloxicoMail,
        email,
        activity: []
    }])
}
export async function setActivity(activity: boolean, bloxicoMail: string) {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.getThread('test1');
    const threadId: ThreadID = ThreadID.fromString(thread.id); 
    const employee : Employee = await getEmployee(bloxicoMail);
    employee.activity.push(activity);
    await client.delete(threadId, 'Employees', [employee._id]);
    await client.create(threadId, 'Employees', [{
        wallet: employee.wallet,
        email: employee.email,
        bloxicoMail: employee.bloxicoMail,
        activity: employee.activity,
    }]);
}
export async function getEmployee(bloxicoMail:string): Promise<any> {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.getThread('test1');
    const threadId: ThreadID = ThreadID.fromString(thread.id); 
    const employee = (await client.find(threadId, 'Employees', {
        ands: [{
            fieldPath: "bloxicoMail", 
            value: {
                string: bloxicoMail
            }
        }]
    }))[0];
    return employee;
}
export async function getEmployeeByIndx(indx:number):Promise<Employee> {
    const employees = await getEmployees();

    return employees[indx];
}
export async function getEmployees() :Promise<Employee[]>  {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.getThread('test1');

    const threadId: ThreadID = ThreadID.fromString(thread.id); 

    const employees: Employee[] = await client.find(threadId, 'Employees', {});

    return employees;
}
