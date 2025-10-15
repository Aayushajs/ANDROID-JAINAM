import {
    Signup,
    Login,
    Logout,
    ForgotPassword,
    VerifyOtp,
    ResetPassword,
    // GoogleLogin
} from "./apiRouters.js"
import axios from 'axios';





const handleResponse = (res) => {
    if (!res || !res.data) {
        console.warn("Empty response from API");
        // return { success: false, status: res?.status || 500, message: "No data received" };
        setError("No data received from server");
        return;
    }

    console.log("Response data : ", res.data);
    return { success: true, status: res?.status, data: res.data }
}

const handleError = (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);

    // return {
    //     success: false,
    //     status: error.response?.status || 0,
    //     message: error.response?.data?.message || error.message || "Network error",
    // };

    setError(error.response?.data?.message || error.message || "Network error");
    return;
}



export const signupUser = async ({ name, email, password, phone }) => {
    try {
        const res = await axios.post(
            Signup,
            { name, email, password, phone },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("response via signupuser : ", res)

        return handleResponse(res);

    } catch (error) {
        return handleError(error);
    }

}

export const loginUser = async ({ email, password }) => {
    try {
        const res = await axios.post(
            Login,
            { email, password },
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )
        console.log("response via loginuser : ", res)

        return handleResponse(res);

    } catch (error) {
        return handleError(error);
    }
}

export const logoutUser = async () => {
    try {
        const res = await axios.post(
            Logout,
            {},
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )
        console.log("response via logoutuser : ", res)

        return handleResponse(res);

    } catch (error) {
        return handleError(error);
    }
}

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
}

export const verifyOtp = async ({ otp }) => {
    try {
        const res = await axios.post(
            VerifyOtp,
            { otp },
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )
        console.log("response via verifyOtp : ", res)

        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
}

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
}