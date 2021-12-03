import { google } from "googleapis";
import moment from "moment";
import { sendMail } from "./mailServices";
import { getEmployees } from "../../db/index";
require("dotenv").config();

const calendar = google.calendar("v3");

/**
 * Checks google calendar to see the employee's activity.
 *
 * @param {string} email the email of the employee
 * @return {boolean} if the last time he checked his calendar was under 24h from now -> returns true.
 */
export const isActiveOnCalendar = async (
  email: string,
  backup: string
): Promise<boolean> => {
  let res;
  try {
    res = await calendar.events.list({
      calendarId: email,
      key: process.env.KEY,
    });
  } catch (err) {
    const isWorking = await isCompanyEmailWorking();
    //sendMail(backup);
    if (isWorking) {
      return false;
    } else {
      return true;
    }
  }
  console.log(res.data.updated);
  const lastTimeUpdated = moment(res.data.updated);
  //current time - 24h
  const currentTimeMinusDay = moment(
    new Date(Date.now() - 1000 * 3600 * 24).toUTCString()
  );
  //checks if the employee has modified his calendar the last 24 hours
  const isActive: boolean = lastTimeUpdated.isAfter(currentTimeMinusDay);
  return isActive;
};
/**
 * Checks google meet to see the employee's activity.
 *
 * @param {string} email the email of the employee
 * @return {boolean} if the last time he checked his calendar was under 24h from now -> returns true.
 */
export const hadMeetings = async (
  email: string,
  backup: string
): Promise<boolean> => {
  let res;
  //list function will throw an error if
  //it could not find the email
  try {
    res = await calendar.events.list({
      calendarId: email,
      key: process.env.KEY,
    });
  } catch (err) {
    const isWorking = await isCompanyEmailWorking();
    //sendMail(backup);
    if (isWorking) {
      return false;
    } else {
      return true;
    }
  }
  const items: any = res.data.items;
  const lastMeeting = moment(items[items.length - 1].start.dateTime);
  const currentTimeMinusDay = moment(
    new Date(Date.now() - 1000 * 3600 * 24).toUTCString()
  );
  const isActive: boolean = lastMeeting.isAfter(currentTimeMinusDay);
  return isActive;
};
/**
 * Checks if the email is not working for all of the employees
 * @return {boolean} if not the function returns false
 */
async function isCompanyEmailWorking(): Promise<boolean> {
  const employees = await getEmployees();
  let counter = 0;
  for (let i = 0; i < employees.length; i++) {
    try {
      await calendar.events.list({
        calendarId: employees[i].bloxicoMail,
        key: process.env.KEY,
      });
    } catch (err) {
      counter++;
    }
  }
  if (counter === employees.length) {
    return true;
  }
  return false;
}
