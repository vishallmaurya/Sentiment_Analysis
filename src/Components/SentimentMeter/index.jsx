import { useEffect } from "react";
import styles from "./SentimentMeter.module.css";
import { useSelector } from "react-redux";

export const SentimentMeter = () => {
    const output = useSelector((state) => state.sentiment.sentimentScore);
    
    const getRotation = () => {        
        switch (output) {            
            case 1: return "90deg";   
            case 2: return "10deg";   
            case 0: return "-90deg";  
            default: return "10deg";  
        }
    };
    
    return (
        <div className={`${styles["container"]} ${styles['center']}`}>
            <div className={styles["meter"]}>
                <div className={`${styles["outer-circle"]} ${styles['center']}`}>
                    <div className={`${styles["inner-circle"]} `}>
                        <div className={`${styles["needle"]} ${styles['center']}`} style={{ transform: `rotate(${getRotation()})` }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}