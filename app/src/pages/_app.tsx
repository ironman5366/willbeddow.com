import { AppProps } from "next/app";
import CozyContainer from "@/components/atoms/CozyContainer";
import Header from "@/components/organisms/Header";
import { MantineProvider } from "@mantine/core";
import theme from "@/theme";
import "@/globals.css";
import "@mantine/core/styles.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Will Beddow</title>
      </Head>
      <Header />
      <CozyContainer>
        <Component {...pageProps} />
      </CozyContainer>
    </MantineProvider>
  );
}
