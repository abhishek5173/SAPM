import Signin from "@/components/Signin";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function signin() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex justify-center items-center mx-auto">
      <Signin />
    </div>
  );
}
