import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";

import styles from "../styles/Home.module.css";
import { ReactElement, useEffect, useState, useContext } from "react";
import { GetStaticProps } from "next";
import { fetchCoffeStores } from "../lib/coffe-stores";
import useTrackLocation from "../hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

type CoffeStore = {
  id: number;
  imgUrl: string;
  name: string;
  address: string;
};

type HomeProps = {
  coffeStores: CoffeStore[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const coffeStores = await fetchCoffeStores();

  return {
    props: {
      coffeStores,
    },
  };
};

export default function Home(props: HomeProps) {
  const { handleTrackLocation, locationErrMessage, isFindingLocation } =
    useTrackLocation();

  const [error, setError] = useState("");

  const { state, dispatch } = useContext(StoreContext);
  const { coffeStores } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (state.latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${state.latLong}`
          );

          const fetchedCoffeStores = await response.json();
          console.log({ fetchedCoffeStores });
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeStores: fetchedCoffeStores },
          });
          console.log("");
        } catch (error: any) {
          console.log("error is", error);
          setError(error.toString);
        }
      }
    }

    setCoffeeStoresByLocation();
  }, [state.latLong]);

  const handleOnBannerClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee connosseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerClick}
        />
        {locationErrMessage != "" && (
          <p>Something went wrong: {locationErrMessage}</p>
        )}
        <div className={styles.heroImage}>
          <Image
            alt="hero-image"
            src="/static/hero-image.png"
            width={700}
            height={400}
          />
        </div>
        {error != "" && <p>Something went wrong: {error}</p>}
        {coffeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near you</h2>
            <div className={styles.cardLayout}>
              {coffeStores.map((coffeStore): ReactElement => {
                return (
                  <Card
                    key={coffeStore.id}
                    name={coffeStore.name}
                    imageUrl={
                      coffeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffe-store/${coffeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto coffee stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeStores.map((coffeStore): ReactElement => {
                return (
                  <Card
                    key={coffeStore.id}
                    name={coffeStore.name}
                    imageUrl={
                      coffeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffe-store/${coffeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
