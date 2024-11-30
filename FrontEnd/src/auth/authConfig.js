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
        clientId: "b6cbd98a-7c06-4afd-84fe-1d73431f6d78", // Use environment variable
        authority: "https://login.microsoftonline.com/1c9f27ef-fee6-45f4-9a64-255a8c8e25a5", // Use environment variable
        redirectUri: process.env.REACT_APP_REDIRECT_URI, // Use environment variable
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set to true for IE 11
    },
};

export { authConfig, authConfigTuke }; // Export the authConfig object

export const BASE_URL = process.env.REACT_APP_BASE_URL; // Use environment variable
