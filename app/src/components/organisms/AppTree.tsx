import React, {PropsWithChildren} from "react";
import {MantineProvider} from "@mantine/core";
import theme from "@/theme";
import CozyContainer from "@/components/atoms/CozyContainer";
import "@/globals.css";
import '@mantine/core/styles.css';

/**
 * This is the app root that would usually go in _app.tsx, but since this app uses both the pages and app router,
 * it's shared here
 */
export default function AppTree({ children }: PropsWithChildren<any>) {
    return <MantineProvider theme={theme}>
        <CozyContainer>
            {children}
        </CozyContainer>
    </MantineProvider>
}
