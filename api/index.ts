import express, { Request, Response, NextFunction } from 'express';
import {isActiveOnCallendar, hadMeetings} from './calendar';
import {getEmployees, addEmployee} from '../db/index';
import cors from 'cors';
import bodyParser from 'body-parser';

const corsOptions = {
    origin: 'http://127.0.0.1:8080'
}

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json())

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
app.post('/add-employee', cors(corsOptions),async(req: Request, res: Response) => {
    const {list} =  req.body;
    console.log(list);

    for(let i = 0; i < list.length; i++) {
        await addEmployee(list[i].employee, list[i].bloxicoMail, list[i].email);
    }
})

app.listen(port, () => {
    console.log("listening on port " + port);
});