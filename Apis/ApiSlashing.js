import {
  Signup,
  Login,
  Logout,
  ForgotPassword,
  VerifyOtp,
  ResetPassword,
  GetUserProfile,
  UpdateUserProfile,
  GetFeaturedMedicines,
  TrackAdvertisementClick,
  GetRunningAdvertisements,
  GetActiveAdvertisements,
  // GoogleLogin
} from "./apiRouters.js";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )
        console.log("response via forgotPassword : ", res)

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
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )
        console.log("response via resetPassword : ", res)

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

// profile update and get functions can be added here in future

export const updateUserProfile = async (payload, isFormData = false) => {
  try {
    let authToken = null;
    try {
      const storedData = await AsyncStorage.getItem('jwtToken');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        authToken = parsedData.token;
      }
    } catch (tokenError) {
      
    }
    
    if (isFormData) {
      let headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(UpdateUserProfile, {
        method: 'PUT',
        headers: headers,
        body: payload,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      return { success: true, status: response.status, data: responseData };
      
    } else {
      // Use axios for JSON requests
      let headers = {
        "Content-Type": "application/json"
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const res = await axios.put(UpdateUserProfile, payload, {
        headers: headers,
        timeout: 30000,
      });

      return handleResponse(res);
    }
    
  } catch (error) {
    return handleError(error);
  }
};

export const getUserProfile = async () => {
  try {
    let authToken = null;
    try {
      const storedData = await AsyncStorage.getItem('jwtToken');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        authToken = parsedData.token;
      }
    } catch (tokenError) {
    }
    
    let headers = {
      "Content-Type": "application/json"
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const res = await axios.get(
      GetUserProfile,
      { 
        headers: headers,
        timeout: 15000,
      }
    );

    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

// GetFeaturedMedicines

export const getFeaturedMedicines = async () => {
  try {
    const res = await axios.get(GetFeaturedMedicines, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 15000,
    });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

// advertisements

export const trackAdvertisementClick = async (adId) => {
  try {
    const res = await axios.post(
      `${TrackAdvertisementClick}/${adId}`,
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 15000,
      }
    );
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const getRunningAdvertisements = async () => {
  try {
    const res = await axios.get(GetRunningAdvertisements, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 15000,
    });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const getActiveAdvertisements = async () => {
  try {
    const res = await axios.get(GetActiveAdvertisements, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 15000,
    });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};