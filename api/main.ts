import {isActiveOnCallendar, hadMeetings} from './calendar';
import {getEmployees, setActivity, getEmployee} from '../db/index';
import {isActiveOnJira} from './jira';
import {Employee} from '../db/employee';

/**
 * Checks google meet and calendar to see the employee's activity.
 * 
 * @param {string} bloxicoMail the bloxico mail of the employee
 * @param {string} backup the backup email of the employee
 * @return {boolean} if the employee was active 80% of the time the function returns true
 */
export async function isActive(bloxicoMail:string, backup:string, addActivity: boolean=false):Promise<boolean> {
    //check if the user was active 80% of the time in the last max 60 days;
    let res:boolean;
    if(addActivity) {
        const isActive = await isActiveOnCallendar(bloxicoMail, 
            backup);
        const had = await hadMeetings(bloxicoMail, 
            backup)
        const activeOnJira = isActiveOnJira(bloxicoMail);
        if(!isActive || !had || !activeOnJira) {
            await setActivity(false, bloxicoMail);
        }else {
            await setActivity(true, bloxicoMail);
        }
    }
    
    const employee:Employee = await getEmployee(bloxicoMail);
    let activity:number = 0;
    let border:number = 0;
    let length = employee.activity.length;
    if(employee.activity.length > 60) {
        border = 60
    }else {
        border = employee.activity.length;
    }
    for(let i = 0; i > border; i++) {
        if(employee.activity[i] === true) {
            activity++;
        }
    }
    res = ((length/100)*80) < activity;
    return res;
}

export async function getInactive():Promise<Employee[]> {
   const employees = await getEmployees();
   let unactive = [];
   for(let i = 0; i < employees.length; i++) {
        const active = await isActive(employees[i].bloxicoMail, employees[i].email);
        if(!active) {
            unactive.push(employees[i]);
        }
    }
    return unactive;
}