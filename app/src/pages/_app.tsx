import { AppProps } from "next/app";
import { AppShell, MantineProvider } from "@mantine/core";
import theme from "@/theme";
import Header from "@/components/organisms/Header";
import CozyContainer from "@/components/atoms/CozyContainer";
import "@/globals.css";
import "@mantine/core/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
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
