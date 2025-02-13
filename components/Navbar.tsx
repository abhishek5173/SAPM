"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineMenu, HiX } from "react-icons/hi"; // Import icons

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setMenuOpen(false); // Close menu after sign-out
  };

  const handleHomeRedirect = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
    setMenuOpen(false);
  };

  // Hide navbar on specific pages
  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 h-14 inset-x-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg flex justify-center items-center">
      <div className="flex justify-between items-center w-5/6">
        {/* Left: Logo */}
        <div className="flex sm:justify-center items-center gap-4">
          <button
            onClick={handleHomeRedirect}
            className="h-10 w-10 bg-green-600 rounded-full flex justify-center items-center"
          >
            <p className="text-white text-2xl font-extrabold">S</p>
          </button>
          <div className="font-extrabold text-2xl">
            SA<span className="text-green-600">P</span>M
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center gap-3">
          {session?.user ? (
            <>
              <button
                onClick={handleSignOut}
                className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium"
              >
                Sign Out
              </button>
              
            </>
          ) : (
            <>
              <button
                onClick={() => signIn()}
                className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-600 p-2 focus:outline-none"
          >
            {menuOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 space-y-3">
          {session?.user ? (
            <>
              <button
                onClick={handleSignOut}
                className="w-5/6 text-green-600 border-b py-2 hover:bg-green-700 hover:text-white transition duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  signIn();
                  setMenuOpen(false);
                }}
                className="w-5/6 text-green-600 border-b py-2 hover:bg-green-700 hover:text-white transition duration-300"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  router.push("/signup");
                  setMenuOpen(false);
                }}
                className="w-5/6 text-green-600 border-b py-2 hover:bg-green-700 hover:text-white transition duration-300"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
