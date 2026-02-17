import "./globals.css";
import Providers from "@/components/Providers";
import { MobileSidebarProvider } from "@/context/MobileSidebarContext";
import SidebarWrapper from "@/components/SidebarWrapper";
import MobileSidebarDrawer from "@/components/MobileSidebarDrawer";
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
      <body className="m-0 min-h-screen w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <MobileSidebarProvider>
            <div className="flex flex-row w-full min-h-screen flex-1" suppressHydrationWarning>
              <SidebarWrapper />
              <MobileSidebarDrawer />
              <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-1 w-full p-4 md:p-4 box-border bg-gray-50/50 dark:bg-gray-200/40 rounded-lg md:m-2 ">{children}</main>
              <Footer />
              <GlobalSnackbar />
              </div>
            </div>
          </MobileSidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
