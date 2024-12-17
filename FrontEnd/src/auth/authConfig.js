// src/authConfig.js
const authConfig = {
    auth: {
        clientId: "b6cbd98a-7c06-4afd-84fe-1d73431f6d78", // Use environment variable
        authority: "https://login.microsoftonline.com/1c9f27ef-fee6-45f4-9a64-255a8c8e25a5", // Use environment variable
        redirectUri: "http://localhost/" // Use environment variable
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set to true for IE 11
    },
};

const authConfigTuke = {
    auth: {
        clientId: "b6cbd98a-7c06-4afd-84fe-1d73431f6d78", // Use environment variable
        authority: "https://login.microsoftonline.com/1c9f27ef-fee6-45f4-9a64-255a8c8e25a5", // Use environment variable
        redirectUri: "http://localhost/", // Use environment variable
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set to true for IE 11
    },
};

export { authConfig, authConfigTuke }; // Export the authConfig object

export const BASE_URL = "http://localhost/"; // Use environment variable

export const AUTHORIZATION_URL = "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=a6iqQviuL0itUgCxTh0wmQLeFdO1LzNu&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=http%3A%2F%2Flocalhost%2Foauth-callback&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";