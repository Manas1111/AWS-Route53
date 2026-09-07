import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ConsoleLayout } from "@/components/layout/ConsoleLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Route 53 Management Console",
  description: "Scalable Domain Name System (DNS) web service console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConsoleLayout>{children}</ConsoleLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
