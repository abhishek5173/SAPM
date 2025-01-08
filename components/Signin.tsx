"use client"
import { useRouter } from "next/navigation";

export default function Signin() {
    const router = useRouter();
  return (
    <div className="h-2/3 w-1/3 bg-green-600 rounded-3xl flex justify-center items-center">
      <div className="w-3/4">
        <div className="text-white font-bold text-5xl text-center mb-8">
          Log In
        </div>

        <div className="mb-6">
          <label htmlFor="Email" className="text-white block mb-2">
            Email
          </label>
          <input
            className="w-full p-3 bg-black/15 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            type="email"
            name="Email"
            id="Email"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="Password" className="text-white block mb-2">
            Password
          </label>
          <input
            className="w-full p-3 bg-black/15 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            type="password"
            name="Password"
            id="Password"
            placeholder="Enter your password"
          />
        </div>

        <button className="w-full p-3 bg-white/45 text-green-600 font-medium rounded-md hover:bg-green-700 hover:text-white transition duration-500">
          Log In
        </button>

        <div className="my-6 flex items-center">
          <div className="w-full h-px bg-white/40"></div>
          <span className="px-4 text-white">or</span>
          <div className="w-full h-px bg-white/40"></div>
        </div>

        <button className="w-full p-3 bg-white text-black rounded-md flex items-center justify-center gap-2 hover:bg-gray-200 transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Login with Google
        </button>
        <div className="w-full flex justify-center items-center">
          <button onClick={() => router.push('/')} className="w-20 p-3 bg-white/45 text-green-600 font-medium rounded-3xl hover:bg-green-700 hover:text-white transition duration-500 mt-5 flex justify-center">
            <svg
              className="h-8 w-8 text-gray-700"
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
