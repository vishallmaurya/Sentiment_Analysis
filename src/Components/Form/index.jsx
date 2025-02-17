import styles from "./Form.module.css";

export const Form = () => {
    return (
        <div className={styles["form-container"]} >
            <input type="text" className={styles["form-input"]} />
            <button className={styles["form-btn"]} >Sentiment</button>
        </div>
    )
}