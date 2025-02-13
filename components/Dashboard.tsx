"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data: session } = useSession();
  interface PortfolioItem {
    name: string;
    totalPrice: number;
    stocks: { stockName: string; price: number; quantity: number }[];
  }

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  interface StockPrice {
    Stock: string;
    Price: number;
  }

  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      const response = await axios.get("/api/my");
      setPortfolio(response.data);
      setLoading(false);
    }
    async function fetchStockPrices() {
      try {
        const stockRes = await axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=XFbb6r627vwBTWNdOBTDSeL0KQYrq-qcZ0yIS5VE0LD8_JG-uOkhsq1LRatZHjruHVpn2SVehCYxvoEZrqEn2wGPG-hQxknYm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO7vxK_gh2q46FW8N6O32tMyaCbTi7OtvoWObHj5wLmMqVHJHpcJNUK0vEe8zNmHvhl9PhPIIbUVdk4NPkHSl66Y6h1Fe1rV9dz9Jw9Md8uu&lib=MfEcSXofpCfK_wuKbVXUkRi91h4gJfZU7"
        );
        setStockPrices(stockRes.data.data);
      } catch (error) {
        console.error("Error fetching stock prices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStockPrices();
    fetchPortfolio();
  }, []);

  const totalValue = portfolio.reduce((acc, p) => acc + p.totalPrice, 0);
  const topStock = portfolio
  .flatMap((p) => p.stocks)
  .reduce((prev, curr) => (curr.price * curr.quantity > prev.price * prev.quantity ? curr : prev), { stockName: "", price: 0, quantity: 0 });

  const chartData = portfolio.map((portfolio) => {
    const totalCurrentValue = portfolio.stocks.reduce((acc, stock) => {
      const currentStock = stockPrices.find((s) => s.Stock === stock.stockName);
      return acc + (currentStock ? currentStock.Price * stock.quantity : 0);
    }, 0);

    return {
      name: portfolio.name,
      investment: portfolio.totalPrice.toFixed(2),
      currentValue: totalCurrentValue.toFixed(2),
    };
  });

  return (
    <div className="min-h-screen w-full p-6 bg-gray-100 overflow-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome {session?.user?.username ?? "Guest"}{" "}
      </h1>
      {/* First Grid - Responsive Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 sm:p-10 rounded-2xl shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-xl">
          <h2 className="text-white text-lg sm:text-xl font-semibold flex items-center justify-center gap-2">
            📊 Total Portfolios
          </h2>
          <p className="text-white text-3xl sm:text-4xl font-bold mt-2">
            {loading ? "⏳" : portfolio.length}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 sm:p-10 rounded-2xl shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-xl">
          <h2 className="text-white text-lg sm:text-xl font-semibold flex items-center justify-center gap-2">
            📊 Total Portfolio Value
          </h2>
          <p className="text-white text-3xl sm:text-4xl font-bold mt-2">
          ₹{loading ? "⏳" : totalValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 sm:p-10 rounded-2xl shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-xl">
          <h2 className="text-white text-lg sm:text-xl font-semibold flex items-center justify-center gap-2">
          🔥 Best Stock
          </h2>
          <p className="text-white text-lg sm:text-2xl font-bold mt-2">
          {loading ? "⏳" : topStock.stockName}
          </p>
        </div>
      </div>

      {/* Second Grid - Responsive Layout for Larger Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      <div className="lg:col-span-3 lg:row-span-2">
  <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-300">
    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-center mb-4 text-green-700">
      📊 Portfolio Comparison
    </h2>

    {loading ? (
      <p className="text-center text-gray-500">Loading...</p>
    ) : (
      <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-x-auto">
        {loading ? (
          <div className="font-bold text-xl">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                angle={-10} 
                interval={0} 
              />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="investment" fill="#8884d8" name="Investment" />
              <Bar dataKey="currentValue" fill="#82ca9d" name="Current Value" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    )}
  </div>
</div>


        
      </div>
    </div>
  );
}
