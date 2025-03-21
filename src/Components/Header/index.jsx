import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getBackendURL } from "../../utils/EnvLoader";
import { setUser } from "../../utils/store.js";

export const Header = () => {
    const userData = useSelector((state) => state.user.user);
    const dispatch = useDispatch();    
    
    const logoutHandler = async () => {
        try {
            const response = await axios.post(getBackendURL() + "/users/logout", {}, {withCredentials: true });
            dispatch(setUser(null));
        } catch (error) {
            console.error("Error occurs during logout!! ", error);
        }
    }

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
                
                {!userData && userData?.status !== 200 && <NavLink to="/login" className={({ isActive }) => 
                    isActive ? `${styles["active-link"]} ${styles["link"]}` : styles["link"]
                }>
                    Login
                </NavLink>}
                {userData && userData?.status === 200 && <NavLink to="/" onClick={logoutHandler} className={styles["link"]}>
                    Logout
                </NavLink>}


                {userData && <NavLink to="/profile" className={({ isActive }) => 
                    isActive ? `${styles["active-link"]} ${styles["link"]}` : styles["link"]
                }>
                    Profile
                </NavLink>}
            </div>
        </div>
    )
}