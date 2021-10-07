import express, { Request, Response } from 'express';
import {getEmployees, addEmployee} from '../db/index';
import {getInactive, isActive} from './main';
import { isActiveOnJira } from './jira';
import cors from 'cors';
import bodyParser from 'body-parser';
import schedule from 'node-schedule';
import {checkActivity, sendList} from './contract';

schedule.scheduleJob("0 10 * * *", () => {
    checkActivity();
})
const today = new Date();
let date = new Date(2023, today.getMonth(), today.getDay(), 1);
schedule.scheduleJob(date, () => {
    sendList();
})

const corsOptions = {
    origin: 'http://127.0.0.1:8080'
}

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/remove', async (req: Request, res: Response) => {
    console.log('remove called');
    const employees = await getEmployees();
    let remove: boolean = false;
    for(let i = 0; i < employees.length; i++) {
        const active = await isActive(employees[i].bloxicoMail, employees[i].email, true);
        if(!active) {
            remove = true;
            break;
        }
    }
    res.json({"remove ": remove});
});
app.get('/number-of-employees', async (req: Request, res: Response) => {
    console.log('get number called');
    const inactive = await getInactive();
    res.json({"number": inactive.length});
});
app.get('/employee', async(req: Request, res : Response) => {
    const {indx} = req.query;
    console.log('get employee called');
    const inactive = await getInactive();
    console.log(inactive); 
    res.json({"employee": inactive[Number(indx)].wallet})
});
app.post('/add-employee', cors(corsOptions),async(req: Request, res: Response) => {
    const {list} =  req.body;
    console.log(list);

    for(let i = 0; i < list.length; i++) {
        await addEmployee(list[i].employee, list[i].bloxicoMail, list[i].email);
    }
})

app.listen(process.env.PORT || port, () => {
    console.log("listening on port " + port);
});