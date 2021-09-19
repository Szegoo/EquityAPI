import express, { Request, Response, NextFunction } from 'express';
import {isActiveOnCallendar, hadMeetings} from './calendar';
import {getEmployees, addEmployee, getEmployeeByIndx} from '../db/index';
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
    const {indx} = req.query;
    console.log('request called');
    //this will store the employee wallet addresses
    const employee = await getEmployeeByIndx(Number(indx));

    const isActive = await isActiveOnCallendar(employee.bloxicoMail, employee.email);
    const had = await hadMeetings(employee.bloxicoMail, employee.email);
    if(!isActive || !had) {
        res.json({"indx": indx});
    }else {
        res.json({"indx": -1});
    }
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