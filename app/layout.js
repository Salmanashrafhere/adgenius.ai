import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "AdGenius AI - AI Ad Generator",
  description: "Generate high-performing ad creatives and copy in seconds with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
