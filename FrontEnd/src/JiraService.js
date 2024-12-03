import {BASE_URL} from "./auth/authConfig";

const JiraService = () => {
   const fetchJira = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
         const authUrl = "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=clJvF0mJFOElVYoeFqoNzjmUuVMlo8v6&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth-callback&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";
         window.location.href = authUrl;
         return;
      }

      try {
         const resp = await fetch(`${BASE_URL}oauth-callback?code=${code}`, {
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

   return {fetchJira, fetchCloudId, fetchJiraProjects};
};

export default JiraService;
