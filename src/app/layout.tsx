import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/reset.css";
import {UIProvider} from "@/components/UI/UIProvider";

const roboto = Roboto({
    weight: ['400', '600'],
    subsets: ['latin']
})
export const metadata: Metadata = {
    title: "Digger Management System",
    description: "Digger Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <link rel="icon" href="//admin.logo.ico" />
    <link rel="icon" href="/admin/icons/logo.png" type="image/png" sizes="32x32" />
      <body className={roboto.className}>
        <UIProvider>
            {children}
        </UIProvider>
      </body>
    </html>
  );
}
