import {
  Signup,
  Login,
  Logout,
  ForgotPassword,
  VerifyOtp,
  ResetPassword,
  // GoogleLogin
} from "./apiRouters.js";
import axios from "axios";

const handleResponse = (res) => {
  if (!res || !res.data) {
    console.warn("Empty response from API");
    return {
      success: false,
      status: res?.status || 500,
      message: "No data received from server",
    };
  }

  console.log("Response data : ", res.data);
  return { success: true, status: res?.status, data: res.data };
};

const handleError = (error) => {
  // More detailed logging to help debug network issues from mobile
  console.error("API Error message:", error.message);
  console.error("API Error config:", error.config);
  console.error("API Error request:", error.request);
  console.error("API Error response:", error.response?.data || error.response);

  return {
    success: false,
    status: error.response?.status || 0,
    message: error.response?.data?.message || error.message || "Network error",
  };
};

/* Authentication */
export const signupUser = async (payload) => {
  try {
    const res = await axios.post(
      Signup,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response via signupuser : ", res);

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async (payload) => {
  try {
    const res = await axios.post(
      Login,
      payload,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    console.log("response via loginuser : ", res);

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post(
      Logout,
      {},
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    console.log("response via logoutuser : ", res);

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const res = await axios.post(
      ForgotPassword,
      { email },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    console.log("response via forgotPassword : ", res);

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const verifyOtp = async ({ otp }) => {
  try {
    const res = await axios.post(
      VerifyOtp,
      { otp },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    console.log("response via verifyOtp : ", res);

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const resetPassword = async ({ password }) => {
  try {
    const res = await axios.post(
      ResetPassword,
      { password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    console.log("response via resetPassword : ", res);

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};
