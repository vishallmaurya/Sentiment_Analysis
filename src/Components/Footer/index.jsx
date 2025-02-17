import styles from "./Footer.module.css";

export const Footer = () => {
    return (
        <div className={ styles["footer-container"]}>
            <h4>
                © 2025 Tweet Analyzer. All Rights Reserved.
            </h4>
            <div className={styles["media-links"]}>
                links {/* to do */}
            </div>
            <p>
                Powered by AI & NLP | Built by Vishal Maurya
            </p>
        </div>
    )
}