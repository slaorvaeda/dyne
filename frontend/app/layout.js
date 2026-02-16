import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Sales & Revenue Analytics",
  description: "Analytics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh" }}>
        <Providers>
          <Navbar />
          <main style={{ padding: 24 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
