"use client"
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';

export default function Signup() {
    const router = useRouter();
  return (
    <div className="h-screen w-full flex justify-center items-center bg-green-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="text-green-600 font-bold text-3xl sm:text-4xl text-center mb-4 sm:mb-6">
          Sign Up
        </div>

        <div className="mb-4 sm:mb-6">
          <label htmlFor="Email" className="text-green-600 block mb-2">
            Email
          </label>
          <input
            className="w-full p-2 sm:p-3 bg-gray-100 text-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            type="email"
            name="Email"
            id="Email"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <label htmlFor="Password" className="text-green-600 block mb-2">
            Password
          </label>
          <input
            className="w-full p-2 sm:p-3 bg-gray-100 text-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            type="password"
            name="Password"
            id="Password"
            placeholder="Enter your password"
          />
        </div>

        <button className="w-full p-2 sm:p-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-300">
          Sign Up
        </button>

        <div className="my-4 sm:my-6 flex items-center">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="px-2 sm:px-4 text-gray-500">or</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>

        <button onClick={async () => {
            await signIn("google");}} className="w-full p-2 sm:p-3 bg-white text-green-600 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Icon"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          Sign Up with Google
        </button>
        <div className="w-full flex justify-center items-center">
          <button onClick={() => router.push('/')} className="w-20 p-3 bg-green-600 text-white font-medium rounded-3xl hover:bg-green-700 transition duration-300 mt-5 flex justify-center">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
