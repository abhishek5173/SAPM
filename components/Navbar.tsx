"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  const handlehomeredirect = async () => {
    const currentPath = window.location.pathname; // Get current path (e.g., /dashboard/admin)

    if (session) {
      if (currentPath.startsWith("/dashboard")) {
        router.push("/dashboard");
      }
    } else {
      // If no session, redirect to the home page
      router.push("/");
    }
  };

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  return (
    <div className="sticky z-[100] h-14 inset-x-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg flex justify-center items-center">
      <div className="flex justify-between items-center w-5/6">
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlehomeredirect}
            className="h-10 w-10 bg-green-600 rounded-full flex justify-center items-center"
          >
            <p className="text-white text-2xl font-extrabold ">S</p>
          </button>
          <div className="font-extrabold text-2xl">
            SA<span className="text-green-600">P</span>M
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          {session?.user ? (
            <>
              <div>
                <button
                  onClick={handleSignOut}
                  className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium"
                >
                  Sign Out
                </button>
              </div>
              <div>
                <button className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium">
                  Market
                </button>
              </div>
              <div className="bg-green-600 text-white rounded-full p-2 font-medium h-10 w-10 flex justify-center items-center">
                {session?.user?.name?.[0] ?? ''}
              </div>
            </>
          ) : (
            <>
              <div>
                <button
                  onClick={() => {
                    signIn();
                  }}
                  className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium"
                >
                  Log In
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    router.push("/signup");
                  }}
                  className="bg-white/45 text-green-600 hover:bg-green-700 hover:text-white transition duration-500 rounded-3xl p-2 font-medium"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
