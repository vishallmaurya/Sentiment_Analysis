import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import { getBackendURL } from "../../utils/EnvLoader.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/store.js";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { handleSubmit, reset, register } = useForm();
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [gmailLogin, setGmailLogin] = useState({ isGmailLogin: false });
    const [triggerSend, setTriggerSend] = useState(false);  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (triggerSend) {
            sendData();
            setTriggerSend(false);  
        }
    }, [loginData, gmailLogin]);  
    
    const sendData = async () => {
        try {
            let data = { ...loginData, ...gmailLogin };
            const response = await axios.post(getBackendURL() + "/users/register", data, { withCredentials: true });
            dispatch(setUser(response.data));
            console.log(response.data);
            
            navigate("/");
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    const onSubmit = (data) => {
        setLoginData(data);
        setTriggerSend(true);  
        reset();
    };

    const handleGoogleLoginSuccess = async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;

        try {
            const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const user = await response.json();
            setLoginData({ email: user.email });
            setGmailLogin({ isGmailLogin: true });
            setTriggerSend(true);  
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const handleGoogleLoginFailure = () => {
        console.log("Google Login Failed");
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: handleGoogleLoginFailure,
    });

    return (
        <div className={`${styles["login-container"]} ${styles["align"]}`}>
            <h2 style={{ marginBottom: "3rem" }}>Login to Analyzer</h2>
            <form onSubmit={handleSubmit(onSubmit)} className={`${styles["login-form-container"]} ${styles["align"]}`}>
                <input type="text" placeholder="e.g. abc@gmail.com" {...register("email")} className={styles["login-input"]} />
                <input type="password" placeholder="123@password" {...register("password")} className={styles["login-input"]} />
                <button className={`${styles["login-input"]} ${styles["login-btn"]}`}>Login</button>
            </form>
            <div className={`${styles["partition"]}`}>
                or
            </div>
            <button className={`${styles["login-input"]} ${styles["login-btn"]}`} onClick={() => googleLogin()}>
                Login with Google
            </button>
        </div>
    );
};
