import styles from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <div className={styles.logo}>
          <svg viewBox="0 0 50 50" className={styles.logoSvg}>
            <path d="M25,5 L45,25 L25,45 L5,25 Z" className={styles.logoPath} />
          </svg>
        </div>
        <div className={styles.loadingText}>Loading...</div>
        <div className={styles.progressBar}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </div>
  );
};