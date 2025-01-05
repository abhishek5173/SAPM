"use client";
import Image from "next/image";
export default function Navbar() {
  return (
    <div className="sticky z-[100] h-14 inset-x-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg flex justify-center items-center">
      <div className="flex justify-between items-center w-5/6">
        <div className="flex justify-center items-center gap-4">
          <div className="h-10 w-10 bg-green-600 rounded-full flex justify-center items-center">
            <p className="text-white text-2xl font-extrabold ">S</p>
          </div>
          <div className="font-extrabold text-2xl">SA<span className="text-green-600">P</span>M</div>
        </div>
        <div className="flex justify-center items-center gap-3">
            <div><button className="bg-green-600 text-white rounded-3xl p-2 font-medium">Log In</button></div>
            <div><button className="bg-green-600 text-white rounded-3xl p-2 font-medium">Sign Up</button></div>
        </div>
      </div>
    </div>
  );
}
