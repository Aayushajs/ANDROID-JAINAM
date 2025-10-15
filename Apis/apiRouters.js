import {API_BASE_URL} from './api.js';

//Authentication Routes
export const Signup = `${API_BASE_URL}/api/v1/users/signup`
export const Login = `${API_BASE_URL}/api/v1/users/login`
export const Logout = `${API_BASE_URL}/api/v1/users/logout`
export const ForgotPassword = `${API_BASE_URL}/api/v1/users/forgot-password`
export const VerifyOtp = `${API_BASE_URL}/api/v1/users/verify-otp`
export const ResetPassword = `${API_BASE_URL}/api/v1/users/reset-password`
export const GoogleLogin = `${API_BASE_URL}/api/v1/users/google-login`


// Users Routes
export const GetUserProfile = `${API_BASE_URL}/api/v1/users/profile`
export const UpdateUserProfile = `${API_BASE_URL}/api/v1/users/profile/update`