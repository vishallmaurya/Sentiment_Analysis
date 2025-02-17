import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <div className={ styles["header-container"] }>
            <div className={styles["logo-container"]}>
                <a href="\">
                    <img className={styles["img-container"]} src="logo.png" alt="" />
                </a>
            </div>
            <div className={styles["links-container"]}>
                <NavLink to="/" className={({ isActive }) => 
                    isActive ? `${styles["active-link"]} ${styles["link"]}` : styles["link"]
                }>
                    Home
                </NavLink>
                
                <NavLink to="/login" className={({ isActive }) => 
                    isActive ? `${styles["active-link"]} ${styles["link"]}` : styles["link"]
                }>
                    Login
                </NavLink>

                <NavLink to="/signup" className={({ isActive }) => 
                    isActive ? `${styles["active-link"]} ${styles["link"]}` : styles["link"]
                }>
                    Sign Up
                </NavLink>
            </div>
        </div>
    )
}