import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePermission } from "@/hooks/user-permissions";
import Hero from "@/components/Hero";
import LogoLoop from "@/components/LogoLoop";
import GuideTutorial from "@/components/GuideTutorial";
import ShippingMethods from "@/components/ShippingMethods";
import Footer from "@/components/Footer";

export default function Welcome() {
  const { user } = usePermission();
  const [isOpen, setIsOpen] = useState(false);

  const isUser = user?.roles?.some((role) =>
    ["user"].includes(role.toLowerCase())
  );
  const dashRoute = isUser ? "dashboard" : "admin.dashboard";

  const partners = [
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
  ];

  return (
    <>
      <Head title="Selamat Datang di Kimia Farma">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'Instrument Sans', sans-serif;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* === Navbar Responsive === */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            {/* === Logo Section === */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <img
                  src="/Logo KFA member of BioFarma 300x300-01.png"
                  alt="Logo 1"
                  className="h-12 w-auto"
                />
              </Link>
              <Link href="/">
                <img
                  src="/danantara.webp"
                  alt="Logo 2"
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* === Toggle Button (Mobile) === */}
            <button
              className="md:hidden text-gray-800 hover:text-blue-600 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* === Menu kanan (Desktop) === */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              {user ? (
                <>
                  <Link
                    href={route(dashRoute)}
                    className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    {isUser ? "Dashboard" : "Admin Dashboard"}
                  </Link>
                  <Link
                    method="post"
                    href={route("logout")}
                    className="rounded-md border border-orange-400 bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-700"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={route("login")}
                    className="rounded-md border border-orange-400 bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-700"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* === Menu responsive (Mobile) === */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="md:hidden bg-white/5 backdrop-blur-sm shadow-inner border-t border-gray-200"
              >
                <div className="flex flex-col items-center gap-4 py-4 text-sm">
                  {user ? (
                    <>
                      <Link
                        href={route(dashRoute)}
                        className="w-4/5 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white text-center transition hover:bg-blue-700"
                        onClick={() => setIsOpen(false)}
                      >
                        {isUser ? "Dashboard" : "Admin Dashboard"}
                      </Link>
                      <Link
                        method="post"
                        href={route("logout")}
                        className="w-4/5 rounded-md border border-orange-400 bg-orange-500 px-4 py-2 text-white text-center transition hover:bg-orange-700"
                        onClick={() => setIsOpen(false)}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href={route("login")}
                        className="w-4/5 rounded-md border border-orange-400 bg-orange-500 px-4 py-2 text-white text-center transition hover:bg-orange-700"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* === Konten Halaman === */}
        <main className="relative">
          <Hero />
        </main>

        <LogoLoop
          logos={partners}
          speed={50}
          fadeOut
          scaleOnHover
          logoHeight={75}
          gap={48}
        />

        <main className="mt-10">
          <GuideTutorial />
        </main>

        <main className="mt-8">
          <ShippingMethods />
        </main>

        <Footer />
      </div>
    </>
  );
}
