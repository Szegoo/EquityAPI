import express, { Request, Response, NextFunction } from 'express';
import {isActiveOnCallendar, hadMeetings} from './calendar';
import {getEmployees, addEmployee} from '../db/index';

const app = express();
const port = 5001;

app.get('/removal-requests', async(req: Request, res : Response) => {
    //this will store the employee wallet addresses
    const employees = await getEmployees();
    let inactiveEmployees = [];
    for(let i = 0; i < employees.length; i++) {
        const isActive = await isActiveOnCallendar(employees[i].email);
        const had = await hadMeetings(employees[i].email);
        if(!isActive && !had) {
            inactiveEmployees.push(employees[i].wallet);
        }
    }
    res.json(inactiveEmployees);
});
app.post('/add-employee', async(req: Request, res: Response) => {

})

app.listen(port, () => {
    console.log("listening on port " + port);
});