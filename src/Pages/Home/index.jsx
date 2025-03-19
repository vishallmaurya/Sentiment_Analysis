import styles from "./Home.module.css";
import { Form } from "../../Components/Form";
import { SentimentMeter } from "../../Components/SentimentMeter";

export const Home = () => {
    return (
        <div className={styles["container"]}>
            <div className={styles["heading"]}>
                <h1>
                    Tweet Sentiment Analyzer
                </h1>
            </div>
            <div className={ styles["content-body"] }>
                <div className={styles["content"]}>
                    <h1>See Beyond the Words in Tweets</h1>
                    <p><i>"Gain deeper insights into user opinions and trends."</i></p>
                </div>
                <div className={styles["content-img"]}>
                    <SentimentMeter/>
                </div>
            </div>
            <Form />
        </div>
    )
}