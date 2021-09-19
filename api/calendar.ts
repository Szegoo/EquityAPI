import {google} from 'googleapis';
import moment from 'moment';
import {sendMail} from './mail';
require('dotenv').config();

const calendar = google.calendar('v3');

/**
 * Checks google calendar to see the employee's activity.
 * 
 * @param {string} email the email of the employee
 * @return {boolean} if the last time he checked his calendar was under 24h from now -> returns true.
 */
export const isActiveOnCallendar = async(email:string, backup: string): Promise<boolean> => {
    let res;
    try{
        res = await calendar.events.list({ 
            calendarId: email,
            key: process.env.KEY
        });
    }catch(err) {
        //sendMail(backup);
        return false;
    }
    console.log(res.data.updated);
    var lastTimeUpdated = moment(res.data.updated);
    //current time - 24h
    var currentTimeMinusDay = moment(new Date((Date.now() - (1000*3600*24))).toUTCString());
    //checks if the employee has modified his calendar the last 24 hours
    let isActive: boolean = lastTimeUpdated.isAfter(currentTimeMinusDay);
    return isActive; 
}
/**
 * Checks google meet to see the employee's activity.
 * 
 * @param {string} email the email of the employee
 * @return {boolean} if the last time he checked his calendar was under 24h from now -> returns true.
 */
export const hadMeetings = async(email:string, backup:string) : Promise<boolean> => {
    let res;
    //list function will throw an error if 
    //it could not find the email
    try {
        res = await calendar.events.list({ 
            calendarId: email,
            key: process.env.KEY
        });
    }catch(err) {
        //send a mail if the email is not found
        //sendMail(backup);
        return false;
    }
    const items:any = res.data.items;
    let lastMeeting = moment(items[items.length - 1].start.dateTime);
    var currentTimeMinusDay = moment(new Date((Date.now() - (1000*3600*24))).toUTCString());
    let isActive: boolean = lastMeeting.isAfter(currentTimeMinusDay);
    return isActive;
}