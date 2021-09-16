import express, { Request, Response, NextFunction } from 'express';
import {isActiveOnCallendar, hadMeetings} from './calendar';

const app = express();
const port = 5001;

//this will be replaced
//the server will query the employee emails from the db
let employees = [{email: "sakacszergej@gmail.com", 
address: "0xF47f6888d1072D865C5Bf379bae0A90Ce2b77AdE"}];

app.get('/removal-requests', async(req: Request, res : Response) => {
    //this will store the employee wallet addresses
    let inactiveEmployees = [];
    for(let i = 0; i < employees.length; i++) {
        const isActive = await isActiveOnCallendar(employees[i].email);
        const had = await hadMeetings(employees[i].email);
        if(!isActive && !had) {
            inactiveEmployees.push(employees[i].address);
        }
    }
    res.json(inactiveEmployees);
});

app.listen(port, () => {
    console.log("listening on port " + port);
});