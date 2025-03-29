import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBackendURL } from "../../utils/EnvLoader";

export const Profile = () => {
    const [historyData, setHistoryData] = useState([]);
    const [expanded, setExpanded] = useState({});
    const userData = useSelector((state) => state.user.user);
    const output = { 0: "Negative", 1: "Positive", 2: "Neutral" };

    const fetchTweetsHistory = async () => {
        try {
            const response = await axios.post(getBackendURL() + "/users/tweets", {}, { headers: {
                "Content-Type": "application/json",
                "Cookie": document.cookie,  // Send cookies as a header
            },withCredentials: true });
            setHistoryData(response.data.data);
        } catch (error) {
            console.log("Error occurred during fetching of tweets history! ", error);
        }
    };

    useEffect(() => {
        fetchTweetsHistory();
    }, []);

    const toggleExpand = (index) => {
        setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <div className={styles["profile-container"]}>
            <h3 className={ styles["profile-heading"] }>Welcome <span className={styles["profile-id"]}>{userData.data.user.email}</span>
                {historyData.length > 0 && <span>, here are your tweets 🎉</span>}
            </h3>

            {historyData.length <= 0 && <div>You haven't searched for any tweet yet!!</div>}

            {historyData.length > 0 && (
                <div className={styles["history-container"]}>
                    {historyData.map((item, index) => {
                        const isExpanded = expanded[index];
                        const tweetText = item.tweet.length > 200 && !isExpanded 
                            ? item.tweet.slice(0, 200) + "..." 
                            : item.tweet;

                        return (
                            <div key={index} className={`${styles["history-card"]} ${styles[item.predicted_class]} ${isExpanded ? styles["expanded"] : ""}`}>
                                <div className={styles["date"]}>{item.createdAt.split("T")[0]}</div>
                                <div className={styles["tweet"]}>{tweetText}
                                    {item.tweet.length > 200 && (
                                        <button className={styles["read-more"]} onClick={() => toggleExpand(index)}>
                                            {isExpanded ? "Read less" : "read more"}
                                        </button>
                                    )}

                                </div>

                                <div className={`${styles["predicted-sentiment"]} 
                                    ${item.predicted_class == 0 ? styles["negative"] : 
                                        item.predicted_class == 1 ? styles["positive"] : 
                                        styles["neutral"]}`}>
                                    {output[item.predicted_class]}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
