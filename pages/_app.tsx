import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StoreProvider } from "../store/store-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  );
}
