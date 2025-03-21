import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBackendURL } from "../../utils/EnvLoader";

export const Profile = () => {
    const [historyData, setHistoryData] = useState([]);
    const userData = useSelector((state) => state.user.user);
    console.log(userData);
    
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
            <h3> Welcome <span className={ styles["profile-id"] }> { userData.data.data.email } </span>{historyData > 0 && <span>, here is your tweets 🎉</span>}</h3>
            
            {
                historyData.length <= 0 &&
                <div>You have'nt search for any tweet yet!!</div>
            }

            {historyData > 0 && <table className={styles["profile-list"]}>
                <tr><th>Date</th><th>Tweet</th><th>Predicted Class</th></tr>
                {historyData.map((item, index) => (
                    <tr style={{padding:"10rem"}} key={index}>
                        <td>{ item.createdAt.split("T")[0]}</td> <td>{item.tweet}</td> <td>{item.predicted_class}</td>
                    </tr>
                ))}
            </table>}
        </div>
    )
}