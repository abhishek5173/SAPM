well project start hua pehle designing a page

---

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

---

## ab yha se ham complete authentication krenge database.

currnetly aaj authentication na krke hamne aaj data fetching kri --- footer.tsx
0- usestate(null)
1- useeffect(()=>{
setdata(reposnse.data.data) === isme data hamara http req hai but uske andar ek aur object hai data isliye aisa kra

    <!-- {

"data": [
{
"NAME": "NIFTY50",
"PRICE": 22829.15
},
{
"NAME": "SENSEX",
"PRICE": 75366.17
},
{
"NAME": "NIFTY_IT",
"PRICE": 42060.7
}
]
} --> api url isliye data.data kra
})

2- isi ke saath kra loading wala pehle state di true krke phir data fetching ke baad use effect mai hi setloqading(false)
3- condition di
{loading ?(loading div):(
conditional render kro footcard ko
data && data.map((item,index)=>(
<footcard key={index} name = {item.NAME} price = {item.PRICE}>

    {

"data": [
{
"NAME": "NIFTY50",
"PRICE": 22829.15
},
{
"NAME": "SENSEX",
"PRICE": 75366.17
},
{
"NAME": "NIFTY_IT",
"PRICE": 42060.7
}
]
} iske liye index key iski uniqueness ke liye aur .map se new array create hogi aur jo callback diye hai item aur index unki help se array item access honge then name ki aur rice ki value pass kr payenge item.NAME item.PRICE
))
)}



---------------------------------------------------------------------yha se new authentication-------------------

https://www.youtube.com/watch?v=bicCg4GxOP8

1- db install db folder
2- npm prisma install
3- npx prisma init - schema.prisma
4- model user 
5- npx prisma migrate dev --name init
6- npx prisma generate
7- singleton client in lib-db.ts
8- creating a register user api - api/user/route.ts zod validation added
9- creating signup frontend - page.tsx yha pr zod validation

------------------------------------------------------------yha se working for sign in form------------------------
1- npm install next-auth
2- api/auth/[...nextauth] - route.ts creating a handler
3- lib - auth.ts
4- credentials provider fro docs then pages-auth/signin to use custom signin page
5- npm i @next-auth/prisma-adapter
6- adapter in auth.ts
7- credentials provider configure - authorize function ko configure
8- signin component - zod validation 
9- handlesignin function and also added error and loading 
10- session adding with secret in auth.ts
11-after this here we add callbACKS which are added to configure session what session is returning (ex- adding username to session return)
12- also add middleware.ts