import JiraApi from 'jira-client';
import moment from 'moment';
require('dotenv').config();

console.log(process.env.JIRA_TOKEN);
// Initialize
var jira = new JiraApi({
    protocol: 'https',
    host: 'sinkotestnet.atlassian.net',
    username: 'sakacszergej@gmail.com',
    password: process.env.JIRA_TOKEN,
    strictSSL: true
});

/**
 * Checks jira to see the employee's activity.
 * 
 * @param {string} email the email of the employee
 * @return {boolean} returns true if the employee checked any of the issues in the last 24h
 */
export async function isActiveOnJira(email: string) : Promise<boolean> {
    console.log("active on jira");
    const username = await getUsernameByEmail(email);
    if(username === "") {
        const working = await isCompanyEmailWorking(email);
        if(working) {
            return false;
        }
        return true;
    }
    const {issues} = await jira.getUsersIssues(username, false);
    let issuesChecked = 0;
    for(let i = 0; i < issues.length; i++) {
        //check if the employee checked any of the issues in the last 24h
        const res = isActive(issues[i]);
        if(res === true) {
            issuesChecked++;
        }
    }
    console.log(issuesChecked);
    
    return issuesChecked > 0 ? true : false;
}
function isActive(issue:any):boolean {
    let lastDayTime = moment(new Date((Date.now() - (1000*3600*24)))).format();
    console.log("issue: " + issue.fields.lastViewed);
    let viewed = moment(issue.fields.lastViewed);
    console.log(lastDayTime);
    console.log("last time viewed" + viewed.format());
    const res: boolean = viewed.isAfter(lastDayTime); 
    return res;
}
async function getUsernameByEmail(email:string): Promise<string> {
    const userData = await jira.getUsers();
    let username = "";
    for(let i = 0; i < userData.length; i++) {
        if(userData[i].emailAddress === email) {
            console.log(userData[i]);
            username = userData[i].displayName;
        }
    }
    return username;
}

async function isCompanyEmailWorking(bloxicoMail): Promise<boolean> {
    let active = 0;
    const username = await getUsernameByEmail(bloxicoMail);
    if(username !== "") {
        active++;
    } 
    if(active > 0) {
        return true;
    }
    return false;
}