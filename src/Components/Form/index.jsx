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
            setOutput("Please write the tweet!!");
            return;
        }
        sendData(data);
    };

    // const sendData = async (data) => {
    //     try {
    //         setLoading(true);            
    //         const url = getBackendURL() + "/api/predict";
    //         const response = await axios.post(url , data, { withCredentials: true });
            
    //         dispatch(setSentiment(response.data.data.predicted_class));
    //         setOutput(result[response.data.data.predicted_class]);
    //         reset();
    //     } catch (error) {
    //         console.error("Error sending data:", error.response ? error.response.data : error);
    //     }
    //      finally {
    //         setLoading(false);
    //     }
    // };

    const sendData = async (data) => {
        try {
            setLoading(true);
            setOutput(null); 
            
            const initResponse = await axios.post(
                getBackendURL() + "/api/predict",
                data,
                { withCredentials: true, timeout: 10000 }
            );
            
            const taskId = initResponse.data.task_id;
            let result;
            let attempts = 0;
            const maxAttempts = 12; //
            
            while (attempts < maxAttempts && !result) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 50000));
                
                try {
                    const statusResponse = await axios.get(
                        `${getBackendURL()}/api/predict/status/${taskId}`,
                        { withCredentials: true }
                    );
                    
                    if (statusResponse.data.data?.predicted_class !== undefined) {
                        result = statusResponse.data.data;
                        break;
                    }
                } catch (pollError) {
                    console.error("Polling error:", pollError);
                }
            }
            
            if (!result) throw new Error("Analysis timed out");
            
            // 3. Update state
            dispatch(setSentiment(result.predicted_class));
            setOutput(result[result.predicted_class]);
            
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error);
            setOutput("Error: " + (error.response?.data?.message || error.message));
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
                <img src="/loader.gif" alt="Loading..." className={styles["output_img"]} />
            </div>}
            {!loading && <div className={styles["output"]}>
                {output}
            </div>}
        </div>
    )
}