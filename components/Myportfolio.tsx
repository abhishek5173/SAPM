"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function MyPortfolio() {
  interface Stockitem {
    id: string;
    stockName: string;
    price: number;
    quantity: number;
    Low52: number;
    "52_Week_Low"?: number; // Add this property to match the data structure
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
    PE: number;
    EPS: number;
    High52: number;
    Low52: number;
  }

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);
  const [stockPrices, setStockPrices] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isStockDialogOpen, setStockDialogOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
const [showHighList, setShowHighList] = useState(false);
const [showLowList, setShowLowList] = useState(false);


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
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this portfolio?"
    );
    if (!userConfirmed) return;

    axios.delete("/api/my", { data: { id } }).then(() => {
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function handleStockClick(stockName: string) {
    const stock = stockPrices.find((s) => s.Stock === stockName);
    if (stock) {
      setSelectedStock(stock);
      setStockDialogOpen(true);
    }
  }

  const chartData = selectedPortfolio
    ? selectedPortfolio.stocks.map((stock) => {
        const currentStock = stockPrices.find(
          (s) => s.Stock === stock.stockName
        );
        return {
          name: stock.stockName,
          investment: stock.price * stock.quantity,
          currentValue: currentStock ? currentStock.Price * stock.quantity : 0,
        };
      })
    : [];

  const totalCurrentPrice = selectedPortfolio
    ? selectedPortfolio.stocks.reduce((acc, stock) => {
        const currentStock = stockPrices.find(
          (s) => s.Stock === stock.stockName
        );
        return acc + (currentStock ? currentStock.Price * stock.quantity : 0);
      }, 0)
    : 0;

  const percentageChange =
    selectedPortfolio && totalCurrentPrice && selectedPortfolio.totalPrice
      ? ((totalCurrentPrice - selectedPortfolio.totalPrice) /
          selectedPortfolio.totalPrice) *
        100
      : 0;

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
                onClick={() => {
                  setSelectedPortfolio(p);
                  setDialogOpen(true);
                }}
              >
                <h2 className="sm:text-xl text-sm font-semibold text-green-700 text-wrap">
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </h2>
                <p className="sm:text-lg text-sm text-gray-700">
                  <span className="font-bold">₹{p.totalPrice.toFixed(2)}</span>
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
                {selectedPortfolio.name.charAt(0).toUpperCase() +
                  selectedPortfolio.name.slice(1)}{" "}
                : Portfolio Details
              </h1>
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
              >
                {showAnalysis ? "Hide Analysis" : "Show Sector & Cap Analysis"}
              </button>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-gray-700 hover:text-red-600"
              >
                <CgClose className="h-8 w-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                    <Bar
                      dataKey="investment"
                      fill="#8884d8"
                      name="Investment"
                    />
                    <Bar
                      dataKey="currentValue"
                      fill="#82ca9d"
                      name="Current Value"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-100 h-64 flex flex-col items-start justify-center rounded-lg">
                <p className="p-2 text-green-600 font-bold text-sm sm:text-lg md:text-xl text-center sm:text-left">
                  <span className="text-black">Total Investment:</span> ₹
                  {(selectedPortfolio.totalPrice).toFixed(2)}
                </p>
                <p className="p-2 text-green-600 font-bold text-sm sm:text-lg md:text-xl text-center sm:text-left">
                  <span className="text-black">Date:</span>{" "}
                  {new Date(selectedPortfolio.createdAt).toLocaleString()}
                </p>

                <p className="p-2 font-bold text-sm sm:text-lg md:text-xl text-center sm:text-left">
                  <span className="text-black">Total Current Price:</span>{" "}
                  {totalCurrentPrice < selectedPortfolio.totalPrice ? (
                    <span className="text-red-600">
                      ₹{totalCurrentPrice.toFixed(2)}{" "}
                      <span className="text-red-600 inline-block ">
                        <BiDownArrow />
                      </span>
                    </span>
                  ) : (
                    <span className="text-green-600">
                      ₹{totalCurrentPrice.toFixed(2)}{" "}
                      <span className="inline-block text-green-600">
                        <BiUpArrow />
                      </span>
                    </span>
                  )}
                </p>
                <p
                  className={`p-2 font-bold text-sm sm:text-lg md:text-xl text-center sm:text-left ${
                    percentageChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Change: {percentageChange.toFixed(2)}%{" "}
                  {selectedPortfolio.totalPrice > totalCurrentPrice ? (
                    <span className="text-red-600">
                      (-₹
                      {(
                        selectedPortfolio.totalPrice - totalCurrentPrice
                      ).toFixed(2)}
                      )
                    </span>
                  ) : (
                    <span className="text-green-600">
                      (+₹
                      {(
                        totalCurrentPrice - selectedPortfolio.totalPrice
                      ).toFixed(2)}
                      )
                    </span>
                  )}
                </p>
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
                          <th className="border p-2">Invested</th>
                          <th className="border p-2">Current Price</th>
                          <th className="border p-2">Current Value</th>
                          <th className="border p-2">Total Profit/Loss</th>
                          <th className="border p-2">Stock Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPortfolio.stocks.map((stock) => {
                          const currentStock = stockPrices.find(
                            (s) => s.Stock === stock.stockName
                          );
                          return (
                            <tr
                              key={stock.id}
                              className="text-center text-xs sm:text-sm md:text-base"
                            >
                              <td
                                className="border p-2 text-blue-600 cursor-pointer underline"
                                onClick={() => handleStockClick(stock.stockName)}
                              >
                                {stock.stockName}
                              </td>
                              <td className="border p-2">₹{stock.price}</td>
                              <td className="border p-2">{stock.quantity}</td>
                              <td className="border p-2">
                                ₹{(stock.price * stock.quantity).toFixed(2)}
                              </td>
                              <td className="border p-2">
                                {currentStock
                                  ? `₹${currentStock.Price}`
                                  : "Loading"}
                              </td>
                              <td className="border p-2">
                                {currentStock && currentStock.Price * stock.quantity > stock.price * stock.quantity ? (
                                  <div className="text-green-600">
                                    ₹{(currentStock.Price * stock.quantity).toFixed(2)}
                                  </div>
                                ) : (
                                  <div className="text-red-600">
                                    {currentStock ? `₹${(currentStock.Price * stock.quantity).toFixed(2)}` : "Loading"}
                                  </div>
                                )}
                              </td>
                              <td className="border p-2">
                                {currentStock ? (
                                currentStock.Price * stock.quantity - stock.price * stock.quantity > 0 ? (
                                  <div className="text-green-600">
                                  ₹{(currentStock.Price * stock.quantity - stock.price * stock.quantity).toFixed(2)} (Profit)
                                  </div>
                                ) : (
                                  <div className="text-red-600">
                                  ₹{(currentStock.Price * stock.quantity - stock.price * stock.quantity).toFixed(2)} (Loss)
                                  </div>
                                )
                                ) : (
                                <div className="text-gray-600">Loading</div>
                                )}
                              </td>
                              <td className="border p-2">
                                {currentStock ? (
                                currentStock.Price  - stock.price  > 0 ? (
                                  <div className="text-green-600">
                                  ₹{(currentStock.Price  - stock.price).toFixed(2)} (Gain)
                                  </div>
                                ) : (
                                  <div className="text-red-600">
                                  ₹{(currentStock.Price - stock.price).toFixed(2)} (Loss)
                                  </div>
                                )
                                ) : (
                                <div className="text-gray-600">Loading</div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

{isStockDialogOpen && selectedStock && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-700">
          {selectedStock.Stock} Details
        </h2>
        <button
          onClick={() => setStockDialogOpen(false)}
          className="text-gray-700 hover:text-red-600"
        >
          <CgClose className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-4">
        <p>
          <span className="font-bold">PE Ratio:</span> {selectedStock.PE}{" "}
          {selectedStock.PE < 15 ? (
            <span className="text-green-600">(Undervalued)</span>
          ) : selectedStock.PE > 25 ? (
            <span className="text-red-600">(Overvalued)</span>
          ) : (
            <span className="text-yellow-600">(Fairly Valued)</span>
          )
          }<span className="text-gray-600 ml-3">(Range: 15 to 25)</span>
        </p>
        <p>
          <span className="font-bold">EPS:</span> {selectedStock.EPS}{" "}
          {selectedStock.EPS > 10 ? (
            <span className="text-green-600">(Strong Earnings)</span>
          ) : (
            <span className="text-red-600">(Weak Earnings)</span>
          )}    <span className="text-gray-600 ml-3">(Range: More than 10)</span>
        </p>
        <p>
          <span className="font-bold">52-Week High:</span> ₹{selectedStock.High52}
        </p>
        <p>
          <span className="font-bold">52-Week Low:</span> ₹{selectedStock.Low52}
        </p>
        <p>
          <span className="font-bold">Price:</span> ₹{selectedStock.Price}
        </p>
        <p>
          <span className="font-bold">Volatility:</span>{" "}
          {selectedStock.High52 - selectedStock.Low52 > selectedStock.Low52 * 0.5 ? (
            <span className="text-red-600">High (Risky)</span>
          ) : (
            <span className="text-green-600">Moderate (Stable)</span>
          )}
        </p>
        <div className="mt-4 p-3 rounded-md bg-gray-100">
          <h3 className="text-lg font-bold">Recommendation:</h3>
          {selectedStock.PE < 15 && selectedStock.EPS > 10 ? (
            <p className="text-green-700 font-semibold">✅ Strong Buy - Great valuation and earnings!</p>
          ) : selectedStock.PE > 25 ? (
            <p className="text-red-700 font-semibold">❌ Overvalued - Not a good buy right now.</p>
          ) : (
            <p className="text-yellow-700 font-semibold">⚠️ Hold - Wait for better entry points.</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}

{showAnalysis && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
    <div className="w-full max-w-screen-lg h-[90vh] bg-white shadow-2xl rounded-3xl p-6 overflow-auto relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-700">Portfolio Analysis</h2>
        <button onClick={() => setShowAnalysis(false)} className="text-gray-700 hover:text-red-600 transition">
          <CgClose className="h-7 w-7" />
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector-wise Distribution */}
        <div className="bg-gray-50 rounded-xl p-5 shadow-inner flex flex-col h-[450px]">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Sector-wise Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  selectedPortfolio?.stocks.reduce((acc, stock) => {
                    const currentStock = stockPrices.find(s => s.Stock.trim().toLowerCase() === stock.stockName.trim().toLowerCase());
                    if (currentStock) {
                      const sector = currentStock.Sector || "Unknown";
                      const value = stock.price * stock.quantity;
                      const existing = acc.find(item => item.name === sector);
                      if (existing) {
                        existing.value += value;
                      } else {
                        acc.push({ name: sector, value });
                      }
                    }
                    return acc;
                  }, [] as { name: string; value: number }[]) || []
                }
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <XAxis type="number" tickFormatter={(v) => `₹${v}`} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="mt-3 text-sm text-gray-700">
            {(() => {
              const data = selectedPortfolio?.stocks.reduce((acc, stock) => {
                const currentStock = stockPrices.find(s => s.Stock.trim().toLowerCase() === stock.stockName.trim().toLowerCase());
                if (currentStock) {
                  const sector = currentStock.Sector || "Unknown";
                  const value = stock.price * stock.quantity;
                  acc[sector] = (acc[sector] || 0) + value;
                }
                return acc;
              }, {} as Record<string, number>);
              if (!data) return null;
              const total = Object.values(data).reduce((a, b) => a + b, 0);
              const top = Object.entries(data).reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);
              const sorted = Object.values(data).sort((a, b) => b - a);
              const top3 = sorted.slice(0, 3).reduce((a, b) => a + b, 0);
              return (
                <>
                  <p>Total Investment: <span className="font-medium">₹{total.toFixed(2)}</span></p>
                  <p>Top Sector: <span className="font-medium">{top[0]}</span> (₹{top[1].toFixed(2)})</p>
                  <p>Top 3 Sector Concentration: <span className="font-medium">{((top3 / total) * 100).toFixed(2)}%</span></p>
                </>
              );
            })()}
          </div>
        </div>

        {/* Cap-wise Distribution */}
        <div className="bg-gray-50 rounded-xl p-5 shadow-inner flex flex-col h-[450px]">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Cap-wise Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  selectedPortfolio?.stocks.reduce((acc, stock) => {
                    const currentStock = stockPrices.find(s => s.Stock.trim().toLowerCase() === stock.stockName.trim().toLowerCase());
                    if (currentStock) {
                      const cap = currentStock.Cap || "Unknown";
                      const value = stock.price * stock.quantity;
                      const existing = acc.find(item => item.name === cap);
                      if (existing) {
                        existing.value += value;
                      } else {
                        acc.push({ name: cap, value });
                      }
                    }
                    return acc;
                  }, [] as { name: string; value: number }[]) || []
                }
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <XAxis type="number" tickFormatter={(v) => `₹${v}`} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="mt-3 text-sm text-gray-700">
            {(() => {
              const data = selectedPortfolio?.stocks.reduce((acc, stock) => {
                const currentStock = stockPrices.find(s => s.Stock.trim().toLowerCase() === stock.stockName.trim().toLowerCase());
                if (currentStock) {
                  const cap = currentStock.Cap || "Unknown";
                  const value = stock.price * stock.quantity;
                  acc[cap] = (acc[cap] || 0) + value;
                }
                return acc;
              }, {} as Record<string, number>);
              if (!data) return null;
              const total = Object.values(data).reduce((a, b) => a + b, 0);
              const top = Object.entries(data).reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);
              const sorted = Object.values(data).sort((a, b) => b - a);
              const top3 = sorted.slice(0, 3).reduce((a, b) => a + b, 0);
              return (
                <>
                  <p>Total Investment: <span className="font-medium">₹{total.toFixed(2)}</span></p>
                  <p>Top Cap: <span className="font-medium">{top[0]}</span> (₹{top[1].toFixed(2)})</p>
                  <p>Top 3 Cap Concentration: <span className="font-medium">{((top3 / total) * 100).toFixed(2)}%</span></p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Global Insights */}
      {/* Global Insights */}
<div className="mt-6 p-4 bg-gray-100 rounded-xl text-sm text-gray-800">
  <h4 className="text-lg font-semibold text-green-700 mb-2">Overall Portfolio Insights</h4>
  {(() => {
    const allStocks = selectedPortfolio?.stocks.map(stock => {
      const stockInfo = stockPrices.find(s => s.Stock === stock.stockName);
      return {
        ...stock,
        total: stock.price * stock.quantity,
        PE: stockInfo?.PE || 0,
        EPS: stockInfo?.EPS || 0,
        high: stockInfo?.High52 || 0,
        low: stockInfo?.Low52 || 0
      };
    }) || [];

    const totalQty = allStocks.reduce((sum, s) => sum + s.quantity, 0);
    const totalVal = allStocks.reduce((sum, s) => sum + s.total, 0);
    const avgInvestment = totalVal / (allStocks.length || 1);

    const sorted = [...allStocks].sort((a, b) => b.total - a.total);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    const peList = allStocks.map(s => s.PE).filter(Boolean);
    const epsList = allStocks.map(s => ({ stockName: s.stockName, EPS: s.EPS })).sort((a, b) => b.EPS - a.EPS);
    const nearHigh = allStocks.filter(s => s.price >= s.high * 0.9);
    const nearHighCount = nearHigh.length;
    const nearLow = allStocks.filter(s => s.price <= s.low * 1.1);
    const nearLowCount = allStocks.filter(s => s.price <= s.low * 1.1).length;
    const avgPE = peList.reduce((a, b) => a + b, 0) / (peList.length || 1);
    const avgEPS = epsList.reduce((a, b) => a + b.EPS, 0) / (epsList.length || 1);

    return (
      <>
        <p>Unique Stocks: <span className="font-medium">{allStocks.length}</span></p>
        <p>Average Investment per Stock: <span className="font-medium">₹{avgInvestment.toFixed(2)}</span></p>
        <p>Highest Holding: <span className="font-medium">{highest.stockName}</span> (₹{highest.total.toFixed(2)})</p>
        <p>Lowest Holding: <span className="font-medium">{lowest.stockName}</span> (₹{lowest.total.toFixed(2)})</p>
        <p>Total Quantity of Stocks: <span className="font-medium">{totalQty}</span></p>
        <hr className="my-2" />
        <p>Average P/E Ratio: <span className="font-medium">{avgPE.toFixed(2)}</span> {avgPE > 25 ? "(Overvalued)" : avgPE < 10 ? "(Undervalued)" : "(Fairly Valued)"}</p>
        <p>Average EPS: <span className="font-medium">{avgEPS.toFixed(2)}</span></p>
        <p>Top EPS: <span className="font-medium">{epsList[0].stockName}</span> ({epsList[0].EPS.toFixed(2)})</p>
        <p>Stocks near 52-week high: <span className="font-medium">{nearHighCount}</span> <button
        onClick={() => setShowHighList(prev => !prev)}
        className="text-blue-600 text-xs underline hover:text-blue-800"
      >
        {showHighList ? "Hide list" : "Show list"}
      </button></p>    {showHighList && (
      <ul className="mt-1 ml-4 list-disc text-gray-600">
        {nearHigh.map(stock => (
          <li key={stock.stockName}>
            {stock.stockName} — ₹{stock.price.toFixed(2)} (High: ₹{stock.high})
          </li>
        ))}
      </ul>
    )}
        <p>Stocks near 52-week low: <span className="font-medium">{nearLowCount}</span><button
        onClick={() => setShowLowList(prev => !prev)}
        className="text-blue-600 text-xs underline hover:text-blue-800"
      >
        {showLowList ? "Hide list" : "Show list"}
      </button></p>  {showLowList && (
      <ul className="mt-1 ml-4 list-disc text-gray-600">
        {nearLow.map(stock => (
          <li key={stock.stockName}>
            {stock.stockName} — ₹{stock.price.toFixed(2)} (Low: ₹{stock.low})
          </li>
        ))}
      </ul>
    )}
      </>
    );
  })()}
</div>

    </div>
  </div>
)}





    </div>
  );
}
