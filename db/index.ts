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
        email
    }])
}
async function getEmployee(bloxicoMail:string) {
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