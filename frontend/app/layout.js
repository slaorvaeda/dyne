import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sales & Revenue Analytics",
  description: "Analytics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "row", overflow: "hidden", width: "100%" }}>
        <Providers>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "auto", width: "100%" }}>
            <Navbar />
            <main style={{ flex: 1, padding: "16px", width: "100%", boxSizing: "border-box" }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
