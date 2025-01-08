"use client";


import Footcard from "./Footcard";


export default function Footer() {
 
  
  return (
    <div className="h-32 flex justify-evenly items-center gap-8 w-screen">
        <Footcard name={"AAPL"} price={"100"} />
        <Footcard name={"AAPL"} price={"100"} />
        <Footcard name={"AAPL"} price={"100"} />
    </div>
  );
}
