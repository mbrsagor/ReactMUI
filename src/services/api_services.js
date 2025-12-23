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
export const company = `${endpoint}/company`;

// Auth endpoints
export const sentOTPEndpoint = `${user}/sent-otp/`;
export const verifyOTPEndpoint = `${user}/verify-otp/`;
export const signInAPIEndpoint = `${user}/signin/`;
export const profileURL = `${user}/profile/`;
export const userListEndpoint = `${user}/users/`;
export const reSentOTPEndpoint = `${user}/resent-otp/`;
export const sentLinkToChangePassword = `${user}/sent-link-to-change-password/`;
export const userUpdateDeleteEndpoint = (id) => `${user}/user/${id}/`;
export const createListEndpoint = `${user}/cerate-tier/`;
export const tierUpdateDeleteEndpoint = (id) => `${user}/tier/${id}/`;
export const resetPasswordSentOTPEndpoint = `${user}/reset-password-otp/`;
export const passwordResetAPIEndpoint = `${user}/reset-password/`;

// Catalogue endpoints
export const SuperAdminDashboardEndpoint = `${catalogue}/dashboard/super-admin/`;
export const ServiceTypesAPIEndPoint = `${catalogue}/service-types/`;
export const ServiceTypeUpdateDeleteAPIEndPoint = (id) => `${catalogue}/service-type/${id}/`;

// Company endpoints
export const companyListFilterEndpoint = `${company}/company-filter/`;
export const adminOnBoardingCreateEndpoint = `${company}/admin-onboarding/`;
export const onBoardingEndpoint = `${company}/onboarding/`;
export const onBoardingUpdateDeleteEndpoint = (id) => `${company}/onboarding/${id}/`;
