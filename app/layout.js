import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AdGenius AI - Create 50+ Ads in 5 Minutes",
  description: "AI-powered ad creative generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
