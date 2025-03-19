import { useEffect } from "react";
import styles from "./Form.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/EnvLoader.js";

export const Form = () => {
    const { handleSubmit, register, reset } = useForm();
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = (data) => {
        if (data.tweet?.trim() === "") {
            reset();
            return;
        }
        
        sendData(data);
        
        reset(); 
    };

    const sendData = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(getBackendURL() + "/api/predict", data, { withCredentials: true });
            setOutput(response.data.data.predicted_class);
        } catch (error) {
            console.error("Error sending data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["form-container"]}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
                <input type="text"  {...register("tweet")} placeholder="enter you tweet here..." className={styles["form-input"]}/>
                <button className={styles["form-btn"]} >Sentiment</button>
            </form>
            {loading && <div className={styles["output"]}>
                <img src="/loader.gif" alt="Loading..." />
            </div>}
            <div className={styles["output"]}>
                {console.log(output)}
                {output}
            </div>
        </div>
    )
}