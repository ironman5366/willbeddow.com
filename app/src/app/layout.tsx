import type { Metadata } from "next";
import AppTree from "@/components/organisms/AppTree";
import CozyContainer from "@/components/atoms/CozyContainer";

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
          <CozyContainer flowers>{children}</CozyContainer>
        </AppTree>
      </body>
    </html>
  );
}
