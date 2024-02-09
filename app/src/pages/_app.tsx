import AppTree from "@/components/organisms/AppTree";
import { AppProps } from "next/app";
import CozyContainer from "@/components/atoms/CozyContainer";
import Header from "@/components/organisms/Header";
import { AppShell } from "@mantine/core";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppTree>
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
    </AppTree>
  );
}
