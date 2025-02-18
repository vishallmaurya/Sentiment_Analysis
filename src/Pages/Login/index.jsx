import { useForm } from "react-hook-form"
import styles from "./Login.module.css";

export const Login = () => {
    const { handleSubmit, reset, register } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        reset();
    }

    return (
        <div className={`${styles["login-container"]} ${styles["align"]}`}>
            <h2>Login to Analyzer</h2>
            <form onSubmit={handleSubmit(onSubmit)} className={`${styles["login-form-container"]} ${styles["align"]}`}>
                <input type="text" {...register("email")} className={styles["login-input"]} />
                <input type="password" {...register("pwd")}  className={styles["login-input"]} />
                <button  className={styles["login-btn"]}>Login</button>
            </form>
            <div className={styles["partition"]}>
                <hr />
                or
                <hr />
            </div>
            <button>Login with Google</button>
        </div>
    )
}