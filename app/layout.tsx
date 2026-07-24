import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import { TripTrackingProvider } from "./context/TripTrackingContext";

export const metadata: Metadata = {
  title: "Dispatch App",
  description: "See your assigned trips, start rides, and share live location.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Driver App",
  },
};

export const viewport: Viewport = {
  themeColor: "#063312",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" duration={3000} />
        <AuthProvider>
          <TripTrackingProvider>{children}</TripTrackingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
