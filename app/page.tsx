import Footer from "@/components/Footer";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className=" h-[calc(100vh-3.5rem)] ">
       <div className="mx-auto max-w-screen-xl sm:flex sm:justify-center sm:items-center px-4 sm:gap-8 text-center sm:text-left h-[calc(100vh-11rem)] pt-36 sm:pt-0">
       <div className="">
          <div className="text-wrap text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Make Better <span className="text-green-600">Investment</span> Decisions With Alternate Data
          </div>
          <p className="font-semibold text-base sm:text-lg mb-4">
            Get the inside scoop on companies like never before
          </p>
        </div>
        <div>
          <Image
            src="/heroimage.jpg"
            width={3000}
            height={3000}
            alt="Hero image"
            className="object-contain max-w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] rounded-lg"
          />
        </div>
       </div>
       <div className="bg-black h-32 flex"><Footer/></div>
      </div>
    </div>
  );
}
