import { useState } from "react";
import styles from "./ResetPassword.module.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getBackendURL } from "../../utils/EnvLoader";
import { useParams } from "react-router-dom";

export const ResetPassword = () => {
    const { handleSubmit, reset, register } = useForm();
    const [resetmsg, setMsg] = useState({ msg: "", color: "" });
    const { token } = useParams();
    

    const onSubmit = async (data) => {
        const { password, cpassword } = data;
        if (password?.trim() === "" || cpassword?.trim() === "") setMsg({ msg: "Please Write password", color: "red" });
        else if (password !== cpassword) setMsg({ msg: "password mismatched!!", color: "red" });
        else {
            try {
                await axios.post(getBackendURL() + "/users/reset-password/" + token, {password}, { withCredentials: true });
                setMsg({ msg: "Password reset successfully", color: "green" });
            } catch (error) {              
                setMsg({ msg: "Some error occurred! try again, reset time may get expired", color: "red" });
            }
        }
        reset();
    };
    
    return (
        <div className={ styles["align"] }>
            {resetmsg.msg !== "" && <div className={`${styles["reset"]} ${resetmsg.color === "red" ? styles["failure"] : styles["success"] }  ` }>
                <div>{resetmsg.msg}</div>
                <div className={`${styles["cross"]}`} onClick={()=>{setMsg({msg: "", color: "green"})}}>&#10006;</div>
            </div>}
            <div className={`${styles["form-container"]} ${styles["align"]}`}>
                <h2 style={{ marginBottom: "3rem" }}>Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={`${styles["reset-form-container"]} ${styles["align"]}`}>
                    <input type="password" placeholder="new password" {...register("password")} className={styles["reset-input"]} />
                    <input type="password" placeholder="confirm password" {...register("cpassword")} className={styles["reset-input"]} />
                    <button className={`${styles["reset-input"]} ${styles["reset-btn"]}`}>Submit</button>
                </form>
            </div>
        </div>
    )
}