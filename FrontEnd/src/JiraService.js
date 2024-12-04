import {AUTHORIZATION_URL, BASE_URL} from "./auth/authConfig";

const JiraService = () => {
   const fetchJira = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
         const authUrl = `${AUTHORIZATION_URL}`;
         window.location.href = authUrl;
         return;
      }

      try {
         const resp = await fetch(`${BASE_URL}api/oauth-callback?code=${code}`, {
            method: 'GET',
            headers: {
               'accept': '*/*',
               'Content-Type': 'application/json',
            },
         });

         if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
         }

         // Return the JSON response as a promise
         return resp.json();
      } catch (error) {
         console.error('Error fetching Jira data:', error);
         throw error; // Re-throw error to allow the caller to handle it
      }
   };

   const fetchJiraProjects = async () => {
      const accessTokenJira = localStorage.getItem('accessTokenJira');
      const cloudId = localStorage.getItem('cloudId');
      if (!accessTokenJira || !cloudId) {
         console.error('Could not fetch Jira projects: missing Jira token or CLoud ID');
      }
      const expiration = localStorage.getItem('accessTokenJiraExpiration')
      if (Date.now() > expiration){
         throw new Error(`token expired`);
      }
      const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/2/project`;

      try {
         const resp = await fetch(url, {
            method: 'GET',
            headers: {
               'Accept': 'application/json',
               'Authorization': `Bearer ${accessTokenJira}`,
            },
         });

         if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
         }

         return resp.json();
      } catch (error) {
         console.error('Error fetching Jira data:', error);
      }
   };

   const fetchJiraIssues = async () => {
      const accessTokenJira = localStorage.getItem('accessTokenJira');
      const cloudId = localStorage.getItem('cloudId');
      if (!accessTokenJira || !cloudId) {
         console.error('Could not fetch Jira projects: missing Jira token or CLoud ID');
      }
      const expiration = localStorage.getItem('accessTokenJiraExpiration')
      if (Date.now() > expiration){
         throw new Error(`token expired`);
      }
      const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;

      try {
         const resp = await fetch(url, {
            method: 'GET',
            headers: {
               'Accept': 'application/json',
               'Authorization': `Bearer ${accessTokenJira}`,
            },
         });

         if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
         }

         return resp.json();
      } catch (error) {
         console.error('Error fetching Jira data:', error);
      }
   };

   const fetchCloudId = async () => {
      const url = 'https://api.atlassian.com/oauth/token/accessible-resources';
      const accessTokenJira = localStorage.getItem('accessTokenJira');
      if (!accessTokenJira) {
         throw new Error('Could not fetch Jira Cloud ID.');
      }

      try {
         const resp = await fetch(url, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${accessTokenJira}`, // Ensure `accessTokenJira` is defined
               'Content-Type': 'application/json',
            },
         });
         if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
         }
         const jsonResponse = await resp.json();

         if (!jsonResponse[0]) {
            throw new Error('Could not fetch Jira Cloud ID.');
         }


         return jsonResponse[0];
      } catch (error) {
         console.error('Error fetching Jira Cloud ID:', error);
      }
   };

   const filterIssues = (issues) => {
      const filteredIssues = issues.issues.map(issue => {
         return {
            ProjectId: issue.fields.project.id,
            Priority: issue.fields.priority.name,
            Creator: issue.fields.creator.displayName,
            Created: issue.fields.created,
            Id: issue.id,
            Key: issue.key
         }
      });
      return filteredIssues;
   }

   const addIssuesToProjects = (issues, projects) => {
      projects.map(project => {
         project.issues = issues.filter(issue => issue.ProjectId === project.id);
      })
      return projects;
   }

   return {fetchJira, fetchCloudId, fetchJiraProjects, fetchJiraIssues, filterIssues, addIssuesToProjects};
};

export default JiraService;
