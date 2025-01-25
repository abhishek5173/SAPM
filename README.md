well project start hua pehle designing a page 

---------------------------------------------
authentication structure

1 - install 
2- providers.tsx
3- layout - providers ko kra wrap
4- api/auth/[...nextauth] ke andar route.ts aur route.ts ke andar handler ko pass krenge
5- lib - auth.ts is file mai saare configurations krenge..
<!-- const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (session?.user) {
    redirect("/");
  } -->
is trh se session check krenge
6- signin and signup page banayenge 
7- <!-- 7- design ke baad   <button onClick={async () => {
            const res = await signIn("credentials", {
                username: "",
                password: "",
                redirect: false,
            });
            console.log(res);
            router.push("/")
        }} className="w-full p-3 bg-white/45 text-green-600 font-medium rounded-md hover:bg-green-700 hover:text-white transition duration-500">
          Log In
        </button>  --> aise ham functionality use krenge
8- <!-- 8-<button onClick={async () => {
            await signIn("google");}} className="w-full p-3 bg-white text-black rounded-md flex items-center justify-center gap-2 hover:bg-gray-200 transition">  --> isme ham providers ki functionality
9- middleware ka use krke routes ko protect krenge


aur ham signin page se redirect krenge taaki login hone pr login page access na ho iske liye reidrect krenge signin page se home page aur home page pr already condition hai ki agar sign in toh dashboard dikhao...

-------------------------------------------------------------------------------------------------------------------------------------------------

ab yha se ham complete authentication krenge database.

