"use client"
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    
    <div className="min-h-screen w-full p-6 bg-gray-100 overflow-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome {session?.user?.username ?? "Guest"} </h1>
      {/* First Grid - Responsive Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-600 p-8 sm:p-12 rounded-xl shadow">
          <h2 className="text-white text-lg sm:text-xl">Widget 1</h2>
          <p className="text-white">Content for widget 1</p>
        </div>
        <div className="bg-red-500 p-8 sm:p-12 rounded-xl shadow">
          <h2 className="text-white text-lg sm:text-xl">Widget 2</h2>
          <p className="text-white">Content for widget 2</p>
        </div>
        <div className="bg-blue-500 p-8 sm:p-12 rounded-xl shadow">
          <h2 className="text-white text-lg sm:text-xl">Widget 3</h2>
          <p className="text-white">Content for widget 3</p>
        </div>
      </div>

      {/* Second Grid - Responsive Layout for Larger Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <div className="lg:col-span-3 lg:row-span-2">
          <div className="bg-green-600 p-8 sm:p-16 rounded-xl shadow">
            <h2 className="text-white text-lg sm:text-xl">Widget 4</h2>
            <p className="text-white">Content for widget 4</p>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-green-600 p-8 sm:p-16 rounded-xl shadow">
            <h2 className="text-white text-lg sm:text-xl">Widget 5</h2>
            <p className="text-white">Content for widget 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
