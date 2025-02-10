"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MyPortfolio() {
  interface PortfolioItem {
    id: string;
    name: string;
    totalPrice: number;
  }

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

   function handledelete(id:string){
    const userConfirmed = window.confirm("Are you sure you want to cancel this portfolio?");
    
    if (!userConfirmed) {
      return;
    }


    axios.delete("/api/my", {
      data: {
        id: id,
      },
    }).then(() => {
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
      })

  }
  
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await axios.get("/api/my");
        setPortfolio(res.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-white p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        📈 My Portfolios
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 shadow-md rounded-lg p-6 animate-pulse"
                >
                  <div className="h-6 w-2/3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                </div>
              ))
          : portfolio.map((p) => (
              <motion.div
                key={p.id}
                className="bg-white border border-green-600 shadow-md rounded-lg p-2 flex justify-between items-center hover:shadow-lg transition-transform transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <h2 className="sm:text-xl text-sm font-semibold text-green-700 text-wrap">
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </h2>
                <p className="sm:text-lg text-sm text-gray-700">
                   <span className="font-bold">₹{p.totalPrice}</span>
                </p>
                <button className="sm:p-2 p-1 text-sm sm:text-lg bg-red-700/90 rounded-2xl text-white font-semibold" onClick={()=>handledelete(p.id)}>Delete</button>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
