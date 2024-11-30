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
