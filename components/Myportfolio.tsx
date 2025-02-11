"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CgClose } from "react-icons/cg";

export default function MyPortfolio() {
  interface Stockitem {
    id: string;
    stockName: string;
    price: number;
    quantity: number;
  }

  interface PortfolioItem {
    id: string;
    name: string;
    totalPrice: number;
    createdAt: string;
    stocks: Stockitem[];
  }

  interface StockData {
    Sector: string;
    Cap: string;
    Stock: string;
    Price: number;
  }

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [stockPrices, setStockPrices] = useState<StockData[]>([]);

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

    async function fetchStockPrices() {
      try {
        const stockRes = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=XFbb6r627vwBTWNdOBTDSeL0KQYrq-qcZ0yIS5VE0LD8_JG-uOkhsq1LRatZHjruHVpn2SVehCYxvoEZrqEn2wGPG-hQxknYm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO7vxK_gh2q46FW8N6O32tMyaCbTi7OtvoWObHj5wLmMqVHJHpcJNUK0vEe8zNmHvhl9PhPIIbUVdk4NPkHSl66Y6h1Fe1rV9dz9Jw9Md8uu&lib=MfEcSXofpCfK_wuKbVXUkRi91h4gJfZU7"
        );
        setStockPrices(stockRes.data.data);
      } catch (error) {
        console.error("Error fetching stock prices:", error);
      }
    }

    fetchPortfolio();
    fetchStockPrices();
  }, []);

  function handleDelete(id: string) {
    const userConfirmed = window.confirm("Are you sure you want to cancel this portfolio?");
    if (!userConfirmed) return;

    axios.delete("/api/my", { data: { id } }).then(() => {
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
    });
  }

  return (
    <div className="flex flex-col items-center w-full bg-white p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">📈 My Portfolios</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-100 shadow-md rounded-lg p-6 animate-pulse">
                  <div className="h-6 w-2/3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                </div>
              ))
          : portfolio.map((p) => (
              <motion.div
                key={p.id}
                className="bg-white border border-green-600 shadow-md rounded-lg p-2 flex justify-between items-center hover:shadow-lg transition-transform transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedPortfolio(p);
                  setDialogOpen(true);
                }}
              >
                <h2 className="sm:text-xl text-sm font-semibold text-green-700 text-wrap">
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </h2>
                <p className="sm:text-lg text-sm text-gray-700">
                  <span className="font-bold">₹{p.totalPrice}</span>
                </p>
                <button
                  className="sm:p-2 p-1 text-sm sm:text-lg bg-red-700/90 rounded-2xl text-white font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                >
                  Delete
                </button>
              </motion.div>
            ))}
      </div>

      {isDialogOpen && selectedPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 mt-10">
          <div className="w-full max-w-screen-lg h-[90vh] bg-white shadow-2xl rounded-3xl p-6 overflow-auto relative">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-2xl font-bold text-green-700">
                {selectedPortfolio.name.charAt(0).toUpperCase() + selectedPortfolio.name.slice(1)} : Portfolio Details
              </h1>
              <button onClick={() => setDialogOpen(false)} className="text-gray-700 hover:text-red-600">
                <CgClose className="h-8 w-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">Chart/Graph Area</p>
              </div>
              <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">Portfolio Info</p>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <div className="bg-gray-100 shadow-md rounded-lg p-4 w-full overflow-x-auto">
                  <div className="w-full min-w-[500px] sm:min-w-full">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 text-xs sm:text-sm md:text-base">
                          <th className="border p-2">Stock</th>
                          <th className="border p-2">Price</th>
                          <th className="border p-2">Qty</th>
                          <th className="border p-2">Total</th>
                          <th className="border p-2">Current Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPortfolio.stocks.map((stock) => {
                          const currentStock = stockPrices.find((s) => s.Stock === stock.stockName);
                          return (
                            <tr key={stock.id} className="text-center text-xs sm:text-sm md:text-base">
                              <td className="border p-2 text-wrap">{stock.stockName}</td>
                              <td className="border p-2">₹{stock.price}</td>
                              <td className="border p-2">{stock.quantity}</td>
                              <td className="border p-2">₹{stock.price * stock.quantity}</td>
                              <td className="border p-2">{currentStock ? `₹${currentStock.Price}` : "Loading"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="p-2 font-bold text-sm sm:text-lg md:text-xl text-center sm:text-left">
                    Total Investment: ₹{selectedPortfolio.totalPrice}
                  </p>
                  <p className="p-2 font-bold text-sm sm:text-lg md:text-xl text-center sm:text-left">
                    Date: {new Date(selectedPortfolio.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
