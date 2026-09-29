import { Outlet, useLocation, ScrollRestoration } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "../ui/sonner";

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 antialiased">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ScrollRestoration />
      <Toaster position="bottom-right" />
    </div>
  );
}
