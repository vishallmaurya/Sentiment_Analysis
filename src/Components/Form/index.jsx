import { useEffect } from "react";
import styles from "./Form.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const Form = () => {
    const { handleSubmit, register, reset } = useForm();
    const [data, setData] = useState("");

    const onSubmit = (data) => {
        console.log(data);
        setData(data.data);
        reset(); 
    };

    return (
        <div className={styles["form-container"]}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
                <input type="text"  {...register("data")} className={styles["form-input"]}/>
                <button className={styles["form-btn"]} >Sentiment</button>
            </form>
            <div className={styles["output"]}>
                {data}
            </div>
        </div>
    )
}