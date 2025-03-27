// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import styles from "./Login.module.css";
// import { useGoogleLogin } from "@react-oauth/google";
// import { getBackendURL } from "../../utils/EnvLoader.js";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../utils/store.js";
// import { useNavigate } from "react-router-dom";

// export const Login = () => {
//     const { handleSubmit, reset, register } = useForm();
//     const [loginData, setLoginData] = useState({ email: "", password: "" });
//     const [gmailLogin, setGmailLogin] = useState({ isGmailLogin: false });
//     const [triggerSend, setTriggerSend] = useState(false);
//     const [loginmsg, setLoginMsg] = useState({msg: "", color: ""});
//     const [showForgotPwd, setShowForgotPwd] = useState(false);
//     const [forgotPwdData, setForgotPwdData] = useState({ email: ""});

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         if (triggerSend) {
//             sendData();
//             setTriggerSend(false);
//         }
//     }, [loginData, gmailLogin, forgotPwdData]);
    
//     const sendData = async () => {
//         try {
//             if (!showForgotPwd) {
//                 const data = { ...loginData, ...gmailLogin };
//                 const response = await axios.post(getBackendURL() + "/users/register", data, { withCredentials: true });
//                 dispatch(setUser(response.data));
//                 setLoginMsg({msg: "Logged in successfully!!", color: "green"});
//                 navigate("/");
//             } else {
//                 await handleForgotPassword();
//             }
//         } catch (error) {
//             setLoginMsg({msg: "Some error occured!!", color: "red"});
//         }
//     };

//     const onSubmit = (data) => {
//         console.log(data);
//         if (Object.values(data).some(value => value === "" || value === null || value === undefined)) {
//             setLoginMsg({ msg: "Please fill the required field", color: "red" });
//             console.log("yahfdsjfdskjfdskfhkjd");
//             reset();
//             return;
//         } else {
//             if (!showForgotPwd)
//                 setLoginData(data);
//             else {
//                 console.log("directelktelk");
//                 setForgotPwdData(data);
//             }
//             setTriggerSend(true);
//             reset();
//         }
//     };

//     const handleGoogleLoginSuccess = async (tokenResponse) => {
//         const accessToken = tokenResponse.access_token;

//         try {
//             const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//                 headers: { Authorization: `Bearer ${accessToken}` },
//             });

//             const user = await response.json();
//             setLoginData({ email: user.email });
//             setGmailLogin({ isGmailLogin: true });
//             setTriggerSend(true);
//         } catch (error) {
//             setLoginMsg({msg: "Some error occured!", color: "red"});
//         }
//     };

//     const handleGoogleLoginFailure = () => {
//         setLoginMsg({msg: "Google Login Failed", color: "red"});
//     };

//     const googleLogin = useGoogleLogin({
//         onSuccess: handleGoogleLoginSuccess,
//         onError: handleGoogleLoginFailure,
//     });

//     const handleForgotPassword = async () => {
//         try {
//             await axios.post(getBackendURL() + "/users/forget-password", forgotPwdData, {withCredentials: true});
//             setLoginMsg({ msg: "password reset link is sent to your email id!!", color: "green" });
//             setShowForgotPwd(false);
//         } catch (error) {
//             setLoginMsg({msg: "Failed to reset password", color: "red"});
//         }
//     };


//     return (
//         <div className={`${styles["align"]}`}>
//             {loginmsg.msg !== "" && <div className={`${styles["login-msg"]} ${loginmsg.color === "red" ? styles["failure"] : styles["success"] } ` }>
//                 <div>{loginmsg.msg}</div>
//                 <div className={`${styles["cross"]}`} onClick={() => { setLoginMsg({msg: "", color: "green"})}}>&#10006;</div>
//             </div>}
//            {!showForgotPwd && <div className={`${styles["login-container"]} ${styles["align"]}`}>
//                 <h2 style={{ marginBottom: "3rem" }}>Login to Analyzer</h2>
//                 <form onSubmit={handleSubmit(onSubmit)} className={`${styles["login-form-container"]} ${styles["align"]}`}>
//                     <input type="text" placeholder="e.g. abc@gmail.com" {...register("email")} className={styles["login-input"]} />
//                     <input type="password" placeholder="123@password" {...register("password")} className={styles["login-input"]} />
//                     <button className={`${styles["login-input"]} ${styles["login-btn"]}`}>Login</button>
//                 </form>
//                 <div className={styles["forgot-pwd-container"]}> <span onClick={() => setShowForgotPwd(true)} className={styles["forgot-pwd"]}>forgot password?</span></div>
//                 <div className={`${styles["partition"]}`}>
//                     or continue with
//                 </div>
//                 <button className={`${styles["login-input"]} ${styles["login-btn"]}`} onClick={() => googleLogin()}>
//                     Google
//                 </button>
//             </div>}

//             {showForgotPwd && (
//                 <div className={`${styles["login-container"]} ${styles["align"]}`}>
//                     <h2 style={{ marginBottom: "3rem" }}>Reset Password</h2>
//                     <form onSubmit={handleSubmit(onSubmit)} className={`${styles["login-form-container"]} ${styles["align"]}`}>
//                         <input type="text" placeholder="e.g. abc@gmail.com" {...register("email")} className={styles["login-input"]} />
//                         <button className={`${styles["login-input"]} ${styles["login-btn"]}`}>Submit</button>
//                     </form>
//                     <button className={`${styles["login-input"]} ${styles["login-btn"]}`} onClick={()=>{setShowForgotPwd(false)}}>Cancel</button>
//                 </div>
//             )}
//         </div>
//     );
// };


import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import { getBackendURL } from "../../utils/EnvLoader.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/store.js";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { handleSubmit, reset, register, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loginmsg, setLoginMsg] = useState({msg: "", color: ""});
    const [showForgotPwd, setShowForgotPwd] = useState(false);
    const [gmailLogin, setGmailLogin] = useState({ isGmailLogin: false });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogin = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                getBackendURL() + "/users/register", 
                { ...data, ...gmailLogin }, 
                { withCredentials: true }
            );
            dispatch(setUser(response.data));
            setLoginMsg({msg: "Logged in successfully!!", color: "green"});
            navigate("/");
        } catch (error) {
            setLoginMsg({
                msg: error.response?.data?.message || "Login failed. Please try again.",
                color: "red"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (email) => {
        setIsLoading(true);
        try {
            await axios.post(
                getBackendURL() + "/users/forget-password", 
                { email }, 
                { withCredentials: true }
            );
            setLoginMsg({ 
                msg: "Password reset link sent to your email!", 
                color: "green" 
            });
            setShowForgotPwd(false);
        } catch (error) {
            setLoginMsg({
                msg: error.response?.data?.message || "Failed to send reset link",
                color: "red"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        if (isLoading) return;
        
        // Clear previous messages
        setLoginMsg({msg: "", color: ""});

        if (Object.values(data).some(value => !value)) {
            setLoginMsg({ msg: "Please fill all required fields", color: "red" });
            return;
        }

        if (showForgotPwd) {
            await handleForgotPassword(data.email);
        } else {
            await handleLogin(data);
        }
        
        reset();
    };

    const handleGoogleLoginSuccess = async (tokenResponse) => {
        setIsLoading(true);
        try {
            const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const user = await response.json();
            setGmailLogin({ isGmailLogin: true });
            await handleLogin({ email: user.email, password: '' }); // Empty password for Google login
        } catch (error) {
            setLoginMsg({msg: "Google login failed", color: "red"});
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => setLoginMsg({msg: "Google Login Failed", color: "red"}),
    });

    return (
        <div className={styles.align}>
            {loginmsg.msg && (
                <div className={`${styles["login-msg"]} ${
                    loginmsg.color === "red" ? styles.failure : styles.success
                }`}>
                    <div>{loginmsg.msg}</div>
                    <div 
                        className={styles.cross} 
                        onClick={() => setLoginMsg({msg: "", color: ""})}
                    >
                        &#10006;
                    </div>
                </div>
            )}
            
            {!showForgotPwd ? (
                <div className={`${styles["login-container"]} ${styles.align}`}>
                    <h2 style={{ marginBottom: "3rem" }}>Login to Analyzer</h2>
                    <form 
                        onSubmit={handleSubmit(onSubmit)} 
                        className={`${styles["login-form-container"]} ${styles.align}`}
                    >
                        <input 
                            type="email" 
                            placeholder="e.g. abc@gmail.com" 
                            {...register("email", { required: true })} 
                            className={styles["login-input"]} 
                        />
                        <input 
                            type="password" 
                            placeholder="123@password" 
                            {...register("password", { required: !gmailLogin.isGmailLogin })} 
                            className={styles["login-input"]} 
                            disabled={gmailLogin.isGmailLogin}
                        />
                        <button 
                            className={`${styles["login-input"]} ${styles["login-btn"]}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Login"}
                        </button>
                    </form>
                    <div className={styles["forgot-pwd-container"]}>
                        <span 
                            onClick={() => setShowForgotPwd(true)} 
                            className={styles["forgot-pwd"]}
                        >
                            Forgot password?
                        </span>
                    </div>
                    <div className={styles.partition}>or continue with</div>
                    <button 
                        className={`${styles["login-input"]} ${styles["login-btn"]}`} 
                        onClick={() => googleLogin()}
                        disabled={isLoading}
                    >
                        Google
                    </button>
                </div>
            ) : (
                <div className={`${styles["login-container"]} ${styles.align}`}>
                    <h2 style={{ marginBottom: "3rem" }}>Reset Password</h2>
                    <form 
                        onSubmit={handleSubmit(onSubmit)} 
                        className={`${styles["login-form-container"]} ${styles.align}`}
                    >
                        <input 
                            type="email" 
                            placeholder="e.g. abc@gmail.com" 
                            {...register("email", { required: true })} 
                            className={styles["login-input"]} 
                        />
                        <button 
                            className={`${styles["login-input"]} ${styles["login-btn"]}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Submit"}
                        </button>
                    </form>
                    <button 
                        className={`${styles["login-input"]} ${styles["login-btn"]}`} 
                        onClick={() => setShowForgotPwd(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};