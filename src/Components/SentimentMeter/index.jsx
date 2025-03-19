import { useEffect } from "react";
import styles from "./SentimentMeter.module.css";
import { useSelector } from "react-redux";

export const SentimentMeter = () => {
    const output = useSelector((state) => state.sentiment.sentimentScore);
    useEffect(() => {
        console.log("Sentiment Score Updated:", output);
    }, [output]);
    return (
        <div className={`${styles["container"]} ${styles['center']}`}>
            <div className={styles["meter"]}>
                <div className={`${styles["outer-circle"]} ${styles['center']}`}>
                    <div className={`${styles["inner-circle"]} `}>
                        {output == 1 && <div className={`${styles["needle"]} ${styles["positive"]} ${styles["center"]}`}></div>}
                        {output == 2 && <div className={`${styles["needle"]} ${styles["neutral"]} ${styles["center"]}`}></div>}
                        {output == 0 && <div className={`${styles["needle"]} ${styles["negative"]} ${styles["center"]}`}></div>}
                        {console.log(output)
                        }
                        {/* <div class={`${styles["needle"]} ${styles["center"]}`}></div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}