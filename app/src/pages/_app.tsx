import AppTree from "@/components/organisms/AppTree";
import { AppProps } from "next/app";
import CozyContainer from "@/components/atoms/CozyContainer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppTree>
      <CozyContainer flowers>
        <Component {...pageProps} />
      </CozyContainer>
    </AppTree>
  );
}
