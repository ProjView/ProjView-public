// src/authConfig.js
const authConfig = {
    auth: {
        clientId: "b6cbd98a-7c06-4afd-84fe-1d73431f6d78", // Replace with your Client ID
        authority: "https://login.microsoftonline.com/1c9f27ef-fee6-45f4-9a64-255a8c8e25a5", // Replace with your Tenant ID
        redirectUri: "http://localhost:8080", // Your redirect URI
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true, // Set to true for IE 11
    },
};

export default authConfig;
