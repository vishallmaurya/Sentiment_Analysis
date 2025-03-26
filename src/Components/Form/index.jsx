import styles from "./Form.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/EnvLoader.js";
import { setSentiment } from "../../utils/store.js";
import { useDispatch } from "react-redux";

export const Form = () => {
    const { handleSubmit, register, reset } = useForm();
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState();
    const dispatch = useDispatch();
    const result = {
        0: "Given tweet have negative sentiment",
        1: "Given tweet have positive sentiment",
        2: "Given tweet have neutral sentiment"
     }
    // 0 resembles negative 1 resembles positive 2 resembles neutral

    const onSubmit = (data) => {
        if (data.tweet?.trim() === "") {
            reset();
            return;
        }
        sendData(data);
    };

    const sendData = async (data) => {
        try {
            setLoading(true);            
            const url = "https://tweetssentimentpredictor.onrender.com/predict";// getBackendURL() + "/api/predict";
            const response = await axios.post(url , data, { withCredentials: true });
            console.log("Response: ",response);
            
            dispatch(setSentiment(response.data.data.predicted_class));
            setOutput(response.data.data.predicted_class);
            reset();
        } catch (error) {
            console.error("Error sending data:", error.response ? error.response.data : error);
        }
         finally {
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
                <img src="/loader.gif" alt="Loading..." className={styles["output_img"]} />
            </div>}
            {!loading && <div className={styles["output"]}>
                {result[output]}
            </div>}
        </div>
    )
}