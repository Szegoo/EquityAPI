import express, { Request, Response, NextFunction } from 'express';
import {getEmployees, addEmployee, getEmployeeByIndx} from '../db/index';
import {getInactive} from './main';
import {isActive} from './main';
import cors from 'cors';
import bodyParser from 'body-parser';

const corsOptions = {
    origin: 'http://127.0.0.1:8080'
}

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/remove', async (req: Request, res: Response) => {
    const employees = await getEmployees();
    let remove: boolean = false;
    for(let i = 0; i < employees.length; i++) {
        const active = isActive(employees[i].bloxicoMail, employees[i].email, true);
        if(!active) {
            remove = true;
            break;
        }
    }
    res.json({"remove ": remove});
});
app.get('/number-of-employees', async (req: Request, res: Response) => {
    const employees = await getEmployees();
    const inactive = await getInactive();
    res.json({"number": inactive.length});
});
app.get('/employee', async(req: Request, res : Response) => {
    const {indx} = req.query;
    const inactive = await getInactive();
    
    res.json({"employee": inactive[Number(indx)].wallet})
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