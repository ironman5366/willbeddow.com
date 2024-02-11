import { AppProps } from "next/app";
import CozyContainer from "@/components/atoms/CozyContainer";
import Header from "@/components/organisms/Header";
import { AppShell, MantineProvider } from "@mantine/core";
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
      <AppShell header={{ height: 75 }}>
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <CozyContainer>
            <Component {...pageProps} />
          </CozyContainer>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
