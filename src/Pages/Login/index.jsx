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
    const [loginmsg, setLoginMsg] = useState({msg: "", color: ""});
    const [showForgotPwd, setShowForgotPwd] = useState(false);
    const [forgotPwdData, setForgotPwdData] = useState({ email: ""});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (triggerSend) {
            sendData();
            setTriggerSend(false);  
        }
    }, [loginData, gmailLogin, forgotPwdData]);  
    
    const sendData = async () => {
        try {
            if (!showForgotPwd) {
                const data = { ...loginData, ...gmailLogin };
                const response = await axios.post(getBackendURL() + "/users/register", data, { withCredentials: true });
                dispatch(setUser(response.data));
                setLoginMsg({msg: "Logged in successfully!!", color: "green"});
                navigate("/");
            } else {
                await handleForgotPassword();
            }
        } catch (error) {
            setLoginMsg({msg: "Some error occured!!", color: "red"});
        }
    };

    const onSubmit = (data) => {
        console.log(data);
        if (Object.values(data).some(value => value === "" || value === null || value === undefined)) {
            setLoginMsg({ msg: "Please fill the required field", color: "red" });
            console.log("yahfdsjfdskjfdskfhkjd");
            reset();
            return;
        } else {
            if (!showForgotPwd)
                setLoginData(data);
            else {
                console.log("directelktelk");
                setForgotPwdData(data);
            }
            setTriggerSend(true);
            reset();
        }
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
            setLoginMsg({msg: "Some error occured!", color: "red"});
        }
    };

    const handleGoogleLoginFailure = () => {
        setLoginMsg({msg: "Google Login Failed", color: "red"});
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: handleGoogleLoginFailure,
    });

    const handleForgotPassword = async () => {
        try {
            await axios.post(getBackendURL() + "/users/forget-password", forgotPwdData, {withCredentials: true});
            setLoginMsg({ msg: "password reset link is sent to your email id!!", color: "green" });
            setShowForgotPwd(false);
        } catch (error) {
            setLoginMsg({msg: "Failed to reset password", color: "red"});
        }
    };


    return (
        <div className={`${styles["align"]}`}>
            {loginmsg.msg !== "" && <div className={`${styles["login-msg"]} ${loginmsg.color === "red" ? styles["failure"] : styles["success"] } ` }>
                <div>{loginmsg.msg}</div>
                <div className={`${styles["cross"]}`} onClick={() => { setLoginMsg({msg: "", color: "green"})}}>&#10006;</div>
            </div>}
           {!showForgotPwd && <div className={`${styles["login-container"]} ${styles["align"]}`}>
                <h2 style={{ marginBottom: "3rem" }}>Login to Analyzer</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={`${styles["login-form-container"]} ${styles["align"]}`}>
                    <input type="text" placeholder="e.g. abc@gmail.com" {...register("email")} className={styles["login-input"]} />
                    <input type="password" placeholder="123@password" {...register("password")} className={styles["login-input"]} />
                    <button className={`${styles["login-input"]} ${styles["login-btn"]}`}>Login</button>
                </form>
                <div className={styles["forgot-pwd-container"]}> <span onClick={() => setShowForgotPwd(true)} className={styles["forgot-pwd"]}>forgot password?</span></div>
                <div className={`${styles["partition"]}`}>
                    or continue with
                </div>
                <button className={`${styles["login-input"]} ${styles["login-btn"]}`} onClick={() => googleLogin()}>
                    Google
                </button>
            </div>}

            {showForgotPwd && (
                <div className={`${styles["login-container"]} ${styles["align"]}`}>
                    <h2 style={{ marginBottom: "3rem" }}>Reset Password</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className={`${styles["login-form-container"]} ${styles["align"]}`}>
                        <input type="text" placeholder="e.g. abc@gmail.com" {...register("email")} className={styles["login-input"]} />
                        <button className={`${styles["login-input"]} ${styles["login-btn"]}`}>Submit</button>
                    </form>
                    <button className={`${styles["login-input"]} ${styles["login-btn"]}`} onClick={()=>{setShowForgotPwd(false)}}>Cancel</button>
                </div>
            )}
        </div>
    );
};
