import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBackendURL } from "../../utils/EnvLoader";

export const Profile = () => {
    const [historyData, setHistoryData] = useState([]);
    const userData = useSelector((state) => state.user.user);
    const output = { 0: "Negative", 1: "Positive", 2: "Neutral" };

    const fetchTweetsHistory = async () => {
        try {
            const response = await axios.post(getBackendURL() + "/users/tweets", {}, { withCredentials: true });
            setHistoryData(response.data.data); 
        } catch (error) {
            console.log("Error occured during fetching of tweets history! ", error);
        }
    }

    useEffect(() => {
        fetchTweetsHistory();
    }, []);
    
    
    return (
        <div className={styles["profile-container"]}>
            <h3> Welcome <span className={ styles["profile-id"] }> { userData.data.user.email } </span>{historyData.length > 0 && <span>, here is your tweets 🎉</span>}</h3>
            
            {
                historyData.length <= 0 &&
                <div>You have'nt search for any tweet yet!!</div>
            }

            {historyData.length > 0 && (
                <table className={styles["profile-list"]}>
                    <thead>
                        <tr>
                            <th className={styles["date-col"]}>Date</th>
                            <th className={styles["tweet-col"]} >Tweet</th>
                            <th className={styles["predicted-sentiment-col"]}>Predicted Sentiment</th>
                        </tr>
                    </thead>
                    <tbody>
                    {historyData.map((item, index) => (
                            <tr key={index}>
                                <td className={styles["row-data"]}>{item.createdAt.split("T")[0]}</td>
                                <td className={ styles["row-data"] }>{item.tweet}</td>
                                <td className={ styles["row-data"] }>{output[item.predicted_class]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}