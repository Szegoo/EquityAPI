//api https://hostname.atlassian.net/rest/api/3/user/search?query=sakacszergej@gmail.com&expand=attributes
//https://community.atlassian.com/t5/Jira-questions/JIRA-API-which-returns-last-login-time-of-all-users/qaq-p/1153472
//https://sinkotestnet.atlassian.net/rest/api/2/search?jql=assignee=Sergej
//get username by email 
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

export async function isActiveOnJira(email: string) {
    //const userData = await jira.getUsersIssues('Sergej', false);
    const data = await jira.getIssue("10011");
    console.log(data);

    //const data = await axios.get('https://sinkotestnet.atlassian.net/rest/api/2/search?jql=assignee=Sergej');
    //console.log(data);
}