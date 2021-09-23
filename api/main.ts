import {isActiveOnCallendar, hadMeetings} from './calendar';
import {getEmployees} from '../db/index';
import {Employee} from '../db/employee';

export async function isActive(bloxicoMail:string, backup:string):Promise<boolean> {
    const isActive = await isActiveOnCallendar(bloxicoMail, 
        backup);
    const had = await hadMeetings(bloxicoMail, 
        backup)
    if(!isActive || !had) {
        return false;
    }
    return true;
}
export async function getInactive():Promise<Employee[]> {
   const employees = await getEmployees();
   let unactive = [];
   for(let i = 0; i < employees.length; i++) {
        const active = isActive(employees[i].bloxicoMail, employees[i].email);
        if(!active) {
            unactive.push(employees[i]);
        }
    }
    return unactive;
}