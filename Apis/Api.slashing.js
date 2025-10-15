import { Signup, Login } from './apiRouters'
import axios from 'axios';

// Result shape: { success: boolean, status: number, data?: any, message?: string }



const handleResponse = (res) => {
    if (!res || !res.data) {
        console.warn("Empty response from API");
        return { success: false, status: res?.status || 500, message: "No data received" };
    }

    console.log("Response data : ", res.data);
    return { success: true, status: res?.status, data: res.data }
}

const handleError = (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);

    return {
        success: false,
        status: error.response?.status || 0,
        message: error.response?.data?.message || error.message || "Network error",
    };
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