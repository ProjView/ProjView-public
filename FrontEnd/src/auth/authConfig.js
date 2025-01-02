// src/authConfig.js
const authConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID, // Use environment variable
        authority: process.env.REACT_APP_AUTHORITY, // Use environment variable
        redirectUri: process.env.REACT_APP_REDIRECT_URI, // Use environment variable
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set to true for IE 11
    },
};

const authConfigTuke = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID_TUKE, // Use environment variable
        authority: process.env.REACT_APP_AUTHORITY_TUKE, // Use environment variable
        redirectUri: process.env.REACT_APP_REDIRECT_URI, // Use environment variable
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set to true for IE 11
    },
};

export { authConfig, authConfigTuke }; // Export the authConfig object

export const BASE_URL = process.env.REACT_APP_BASE_URL; // Use environment variable

export const AUTHORIZATION_URL = process.env.REACT_APP_AUTHORIZATION_URL;

export const AUTHORIZATION_URL_TUKE = "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=a6iqQviuL0itUgCxTh0wmQLeFdO1LzNu&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Fprojview.azurewebsites.net%2Foauth-callback&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";