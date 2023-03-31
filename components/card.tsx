import Image from "next/image";
import Link from "next/link";
import cls from "classnames";

import styles from "./card.module.css";

type CardProps = {
  name: string;
  imageUrl: string;
  href: string;
  className: string;
};

const Card = (props: CardProps) => {
  return (
    <Link href={props.href} className={styles.cardLink}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{props.name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            src={props.imageUrl}
            alt="coffeshop-image"
            width={260}
            height={160}
            className={styles.cardImage}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
