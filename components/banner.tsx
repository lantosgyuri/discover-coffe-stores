import styles from "./banner.module.css";

type BannerProps = {
  buttonText: string;
  handleOnClick: () => void;
};

const Banner = (props: BannerProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffe</span>
        <span className={styles.title2}>connosseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffe shops</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.handleOnClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
