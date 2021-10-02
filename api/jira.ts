//api https://hostname.atlassian.net/rest/api/3/user/search?query=sakacszergej@gmail.com&expand=attributes
//https://community.atlassian.com/t5/Jira-questions/JIRA-API-which-returns-last-login-time-of-all-users/qaq-p/1153472
//https://sinkotestnet.atlassian.net/rest/api/2/search?jql=assignee=Sergej
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
        //if user is not found -> return false
        return false;
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