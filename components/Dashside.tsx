"use client"
import { useRouter } from "next/navigation";
import { Home, FilePlus2 } from "lucide-react";
import Link from "next/link";

export default function Dashside() {
    const router = useRouter();
    return (
        <div className="bg-gradient-to-b from-green-500 to-green-700 w-16 sm:w-2/12 h-screen flex justify-center py-8 shadow-2xl rounded-e-md">
        <div className="w-full px-4 space-y-6">
          <Link className="flex flex-col sm:flex-row gap-4 items-center text-white font-semibold p-4 rounded-xl hover:bg-green-600/75 hover:scale-105 transition-transform duration-300 ease-in-out shadow-md" href='/dashboard'>
            <Home className="text-2xl" />
            <span className="hidden sm:inline-block text-lg">Home</span>
          </Link>
          <Link className="flex flex-col sm:flex-row gap-4 items-center text-white font-semibold p-4 rounded-xl hover:bg-green-600/75 hover:scale-105 transition-transform duration-300 ease-in-out shadow-md" href='/dashboard/bookingform'>
            <FilePlus2 className="text-2xl" />
            <span className="hidden sm:inline-block text-lg">Create Portfolio</span>
          </Link>
          
        </div>
      </div>      
    );
}