import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import cls from "classnames";
import useSWR from "swr";

import styles from "../../styles/coffe-store.module.css";
import { fetchCoffeStores } from "../../lib/coffe-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "../../utils";
import { findRecordByFilter } from "../../lib/airtable";

type CoffeStore = {
  id: number;
  imgUrl: string;
  name: string;
  address: string;
  neighbourhood: string;
  voting: number;
};

type CoffeStoreProps = {
  coffeStore: CoffeStore;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const coffeStores = await fetchCoffeStores();

  const findCoffeeStoresbyId = coffeStores.find((coffeStore: any) => {
    return coffeStore.id.toString() === params!.id;
  });
  return {
    props: {
      coffeStore: findCoffeeStoresbyId ? findCoffeeStoresbyId : {},
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const coffeStores = await fetchCoffeStores();

  const paths = coffeStores.map((coffeStore: any) => {
    return {
      params: {
        id: coffeStore.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

const CofeeStore = (initialProps: CoffeStoreProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [coffeStore, setCoffeStore] = useState(initialProps.coffeStore);

  const { state } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeStore: CoffeStore) => {
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: coffeStore.id,
          name: `${coffeStore.name}`,
          address: coffeStore.address || "",
          neighbourhood: coffeStore.neighbourhood || "",
          voting: 0,
          imgUrl: coffeStore.imgUrl || "",
        }),
      });

      const dbCoffeStore = await response.json();
      console.log({ dbCoffeStore });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeStore)) {
      if (state.coffeStores.length > 0) {
        const store = state.coffeStores.find((coffeStore) => {
          return coffeStore.id.toString() === id;
        });

        if (store) {
          setCoffeStore(store);
          handleCreateCoffeeStore(store);
          return;
        }
      }

      return;
    }

    handleCreateCoffeeStore(initialProps.coffeStore);
  }, [id, coffeStore, initialProps.coffeStore]);

  const [votingCount, setVotingCount] = useState(1);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>ERROR while getting coffe store from swr</div>;
  }

  const handleUpvoteButton = async () => {
    const count = votingCount + 1;

    try {
      const response = await fetch("/api/vote", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: coffeStore.id,
        }),
      });

      const dbCoffeStore = await response.json();
      console.log({ dbCoffeStore });
    } catch (error) {
      console.error(error);
    }

    setVotingCount(count);
  };

  if (router.isFallback) {
    return <div>Loading</div>;
  }

  const { name, address, neighbourhood, imgUrl } = coffeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">-- Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            alt={name}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width={24}
              height={24}
              alt="location-icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
              alt="neighborhood-icon"
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={24}
              alt="upvote-icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CofeeStore;
