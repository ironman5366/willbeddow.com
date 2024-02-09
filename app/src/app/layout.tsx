import type { Metadata } from "next";
import AppTree from "@/components/organisms/AppTree";
import CozyContainer from "@/components/atoms/CozyContainer";
import Header from "@/components/organisms/Header";

export const metadata: Metadata = {
  title: "Will Beddow",
  description: "Will Beddow's Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppTree>
          <Header />
          <CozyContainer minHeight={"90vh"}>{children}</CozyContainer>
        </AppTree>
      </body>
    </html>
  );
}
