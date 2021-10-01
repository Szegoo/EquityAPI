//api https://hostname.atlassian.net/rest/api/3/user/search?query=sakacszergej@gmail.com&expand=attributes
//https://community.atlassian.com/t5/Jira-questions/JIRA-API-which-returns-last-login-time-of-all-users/qaq-p/1153472
//https://sinkotestnet.atlassian.net/rest/api/2/search?jql=assignee=Sergej
import JiraApi from 'jira-client';
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
 * @return {boolean} ...
 */
export async function isActiveOnJira(email: string) : Promise<boolean> {
    const username = await getUsernameByEmail(email);
    if(username === "") {
        //if user is not found -> return false
        return false;
    }
    const {issues} = await jira.getUsersIssues(username, false);
    for(let i = 0; i < issues.length; i++) {
        isActive(issues[i]);
    }
    console.log(issues);
    
    return true;
}
function isActive(issue:any):boolean {

    return true;
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