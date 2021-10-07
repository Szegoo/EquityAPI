import {isActiveOnCalendar, hadMeetings} from './calendar';
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
    const today = new Date();
    //don't check if it is saturday sunday
    console.log(today.getDay());
    if(addActivity && (today.getDay() != 6 || today.getDay() != 0)) {
        let points = 0;
        const isActive = await isActiveOnCalendar(bloxicoMail, 
            backup);
        const had = await hadMeetings(bloxicoMail, 
            backup)
        const activeOnJira = await isActiveOnJira(bloxicoMail);
        if(isActive || had) {
            points+=0.7;
        }
        if(activeOnJira) {
            points+=0.3;
        }
        console.log("adding points: " + points);
        await setActivity(points, bloxicoMail);
    }
    
    const employee:Employee = await getEmployee(bloxicoMail);
    console.log(employee);
    let activity:number = 0;
    let length = employee.activity.length;
    if(employee.activity.length < 60) {
        return true;
    }
    for(let i = 0; i > 60; i++) {
        activity+= employee.activity[i];
    }
    console.log(((length/100)*80));
    if(((length/100)*80) < activity) {  
        return true;
    }
    return false;
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