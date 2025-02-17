import styles from "./Header.module.css";

export const Header = () => {
    return (
        <div className={ styles["header-container"] }>
            <div className={ styles["logo-container"] }>
                logo
            </div>
            <div className={styles["links-container"]}>
                <span>Login</span>
                <span>Sign Up</span>
            </div>
        </div>
    )
}