import { useState } from "react";
import styles from "./SentimentMeter.module.css";

export const SentimentMeter = ({ output }) => {
    output = 2;
    return (
        <div className={`${styles["container"]} ${styles['center']}`}>
            <div class={styles["meter"]}>
                <div class={`${styles["outer-circle"]} ${styles['center']}`}>
                    <div class={`${styles["inner-circle"]} `}>
                        {output == 1 && <div class={`${styles["needle"]} ${styles["positive"]} ${styles["center"]}`}></div>}
                        {output == 2 && <div class={`${styles["needle"]} ${styles["neutral"]} ${styles["center"]}`}></div>}
                        {output == 0 && <div class={`${styles["needle"]} ${styles["negative"]} ${styles["center"]}`}></div>}
                        {/* <div class={`${styles["needle"]} ${styles["center"]}`}></div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}