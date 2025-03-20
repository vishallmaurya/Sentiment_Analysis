import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBackendURL } from "../../utils/EnvLoader";

export const Profile = () => {
    const [historyData, setHistoryData] = useState({});

    const fetchTweetsHistory = async () => {
        try {
            const response = axios.post(getBackendURL() + "/users/tweets", {}, { withCredentials: true });
            setHistoryData(response.data);
            console.log(historyData);
            
        } catch (error) {
            console.log("Error occured during fetching of tweets history! ", error);
        }
    }

    useEffect(() => {
        fetchTweetsHistory();
    }, []);

    
    return (
        <div className={styles["profile-container"]}>
        </div>
    )
}