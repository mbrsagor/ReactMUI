const ENV = import.meta.env.MODE; // Vite automatically sets this

const API_URLS = {
  development: import.meta.env.VITE_DEVELOPMENT_API_URL,
  production: import.meta.env.VITE_PRODUCTION_API_URL,
};

// export const BASE_URL =
//   API_URLS[ENV] && API_URLS[ENV].startsWith("http")
//     ? API_URLS[ENV]
//     : (() => {
//         console.warn("⚠️ Invalid API URL — falling back to development URL");
//         return API_URLS.development;
//     })();
      
export const BASE_URL = "http://127.0.0.1:8000"; // Default to development

export const apiURL = "/api/v1";
export const endpoint = `${BASE_URL}${apiURL}`;

// Here using Django and the backend framework every single module connect as a app
// App main endpoint
export const user = `${endpoint}/user`;
export const catalogue = `${endpoint}/catalogue`;

// Auth endpoints
export const sentOTPEndpoint = `${user}/sent-otp/`;
export const verifyOTPEndpoint = `${user}/verify-otp/`;
export const signInAPIEndpoint = `${user}/signin/`;
export const profileURL = `${user}/profile/`;
export const userListEndpoint = `${user}/users/`;
export const sentLinkToChangePassword = `${user}/sent-link-to-change-password/`;
export const userUpdateDeleteEndpoint = (id) => `${user}/user/${id}/`;
export const createListEndpoint = `${user}/cerate-tier/`;
export const tierUpdateDeleteEndpoint = (id) => `${user}/tier/${id}/`;
export const resetPasswordSentOTPEndpoint = `${user}/reset-password-otp/`;

// Catalogue endpoints
export const SuperAdminDashboardEndpoint = `${catalogue}/dashboard/super-admin/`;
