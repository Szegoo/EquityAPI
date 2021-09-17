import {PrivateKey, Client, ThreadID} from '@textile/hub';
import {employeeSchema} from './schema';

const keyinfo = {
    key: 'b52fhd7edjbnfqpnmcwvri6pkta',
    secret: "bd3u2phokq3ddw4xy3gzyazj6nqymktwrnu4mxda"
}
async function generate () {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.newDB(null, 'test1');

    await client.newCollection(thread, {name: 'Employees', schema: employeeSchema});
    return client;
}
async function addEmployee(wallet: string, bloxicoMail: string, email: string) {
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
async function getEmployee(bloxicoMail) {
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
async function getEmployees() {
    const client = await Client.withKeyInfo(keyinfo);
    const thread = await client.getThread('test1');

    const threadId: ThreadID = ThreadID.fromString(thread.id); 

    const employees = await client.find(threadId, 'Employees', {});

    return employees;
}
//addEmployee("0xF47f6888d1072D865C5Bf379bae0A90Ce2b77AdE", "pera@bloxico.com", "pera@gmail.com");
//getEmployee('pera@bloxico.com');