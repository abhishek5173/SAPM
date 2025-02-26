"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from 'next-auth/react';
import { z } from "zod";
const signinschema=z.object({
  email:z.string().email("Invalid email address").min(1,"Email is too short"),
  password:z.string().min(1,"Password is Required")
})

export default function Signin() {
  const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const [error,seterror] = useState("");
    const [loading,setloading] = useState(false);
    const router = useRouter();

  const handlesignin = async () => {
    seterror("");
    setloading(true);

    const validation = signinschema.safeParse({email,password});

    if(!validation.success){
      seterror(validation.error.errors[0].message);
      setloading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {email,password,redirect:false});
      if(res?.error){
        seterror(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) { 
      if (err instanceof Error) {
        seterror(err.message);
      } else {
        seterror("Something went wrong. Please try again.");
      }
    }
    finally{
      setloading(false);
  }
}


  return (
    <div className="h-screen w-full flex justify-center items-center bg-green-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="text-green-600 font-bold text-3xl sm:text-4xl text-center mb-4 sm:mb-6">
          Log In
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
            onChange={(e) => setemail(e.target.value)}
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
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>

        <button onClick={handlesignin} disabled={loading} className="w-full p-2 sm:p-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-300">
        {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="my-4 sm:my-6 flex items-center">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="px-2 sm:px-4 text-gray-500">or</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>

       
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
