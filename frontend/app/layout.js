import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalSnackbar from "@/components/Shared/GlobalSnackbar";

export const metadata = {
  title: "Sales & Revenue Analytics",
  description: "Analytics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode');document.documentElement.classList.toggle('dark',m==='dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="m-0 min-h-screen flex flex-row w-full bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-auto w-full">
            <Navbar />
            <main className="flex-1 w-full p-4 md:p-6 box-border bg-gray-50/50 dark:bg-gray-900/50">{children}</main>
            <Footer />
            <GlobalSnackbar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
