import express, { Request, Response } from 'express';
import {getEmployees, addEmployee} from '../db/index';
import {getInactive, isActive} from './main';
import { isActiveOnJira } from './jira';
import cors from 'cors';
import bodyParser from 'body-parser';

const corsOptions = {
    origin: 'http://127.0.0.1:8080'
}

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/jira', async(req: Request, res: Response) => {
    await isActiveOnJira("sakacszergej@gmail.com");
})
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