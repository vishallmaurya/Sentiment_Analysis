import styles from "./Form.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/EnvLoader.js";
import { setSentiment } from "../../utils/store.js";
import { useDispatch } from "react-redux";

export const Form = () => {
  const { handleSubmit, register, reset } = useForm();
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const result = {
    0: "Given tweet has negative sentiment",
    1: "Given tweet has positive sentiment",
    2: "Given tweet has neutral sentiment",
  };

  const onSubmit = async (data) => {
    if (data.tweet?.trim() === "") {
      setOutput("Please write the tweet!!");
      return;
    }
    await sendData(data);
  };

  const sendData = async (data) => {
    try {
      setLoading(true);
      const url = getBackendURL() + "/api/predict";
      const response = await axios.post(url, data, { withCredentials: true });

      dispatch(setSentiment(response.data.data.predicted_class));
      setOutput(result[response.data.data.predicted_class]);
      reset();
    } catch (error) {
        setOutput("Some error occurred!!")
      console.error(
        "Error sending data:",
        error.response ? error.response.data : error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
        <input
          type="text"
          {...register("tweet")}
          placeholder="Enter your tweet here..."
          className={styles["form-input"]}
        />
        <button disabled={loading} className={styles["form-btn"]}>
          {loading ? "Processing..." : "Sentiment"}
        </button>
      </form>

      {loading && (
        <div className={styles["output"]}>
          <img
            src="/loader.gif"
            alt="Loading..."
            className={styles["output_img"]}
          />
        </div>
      )}
      {!loading && <div className={styles["output"]}>{output}</div>}
    </div>
  );
};
