import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sales & Revenue Analytics",
  description: "Analytics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Providers>
          <Navbar />
          <main style={{ flex: 1, padding: 24 }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
