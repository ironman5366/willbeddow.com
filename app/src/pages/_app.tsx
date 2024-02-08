import AppTree from "@/components/organisms/AppTree";
import {AppProps} from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return <AppTree>
        <Component {...pageProps} />
    </AppTree>
}
