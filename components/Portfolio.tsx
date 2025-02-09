"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Stock {
  stock: string;
  price: number;
}

interface SectorStocks {
  [key: string]: Stock[];
}

interface SelectedStock extends Stock {
  quantity: number;
}

export default function Portfolio() {
  const [sectorsWithStocks, setSectorsWithStocks] = useState<SectorStocks>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [portfolioName, setPortfolioName] = useState<string>("");

  useEffect(() => {
    axios
      .get(
        "https://script.googleusercontent.com/macros/echo?user_content_key=XFbb6r627vwBTWNdOBTDSeL0KQYrq-qcZ0yIS5VE0LD8_JG-uOkhsq1LRatZHjruHVpn2SVehCYxvoEZrqEn2wGPG-hQxknYm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO7vxK_gh2q46FW8N6O32tMyaCbTi7OtvoWObHj5wLmMqVHJHpcJNUK0vEe8zNmHvhl9PhPIIbUVdk4NPkHSl66Y6h1Fe1rV9dz9Jw9Md8uu&lib=MfEcSXofpCfK_wuKbVXUkRi91h4gJfZU7"
      )
      .then((response) => {
        const transformedData: SectorStocks = {};
        response.data.data.forEach(
          (item: { Sector: string; Stock: string; Price: number }) => {
            transformedData[item.Sector] = transformedData[item.Sector] || [];
            transformedData[item.Sector].push({
              stock: item.Stock,
              price: item.Price,
            });
          }
        );
        setSectorsWithStocks(transformedData);
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, []);

  const handleStockSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
    sector: string
  ) => {
    const stockName = event.target.value;
    if (!stockName) return;

    const stockData = sectorsWithStocks[sector].find(
      (s) => s.stock === stockName
    );
    if (!stockData) return;

    setSelectedStocks((prev) => {
      const existingStock = prev.find((s) => s.stock === stockName);
      if (existingStock) {
        return prev.map((s) =>
          s.stock === stockName ? { ...s, quantity: s.quantity + 1 } : s
        );
      }
      return [...prev, { ...stockData, quantity: 1 }];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    setSelectedStocks((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, quantity: Math.max(1, quantity) } : s
      )
    );
  };

  const resetSelections = () => {
    setSelectedStocks([]);
    setPortfolioName("");
  };
  const totalPrice = selectedStocks.reduce(
    (acc, s) => acc + s.price * s.quantity,
    0
  );

  const savePortfolio = async () => {
    if (!portfolioName.trim()) {
      alert("Please enter a portfolio name.");
      return;
    }

    if (selectedStocks.length === 0) {
      alert("Please select at least one stock.");
      return;
    }

    const payload = {
      name: portfolioName,
      totalPrice: totalPrice,
      selectedStocks,
    };

    try {
      const response = await axios.post("/api/portfolio", payload);

      alert("Portfolio saved successfully!");
      resetSelections();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Failed to save portfolio.");
    }
  };

  if (loading)
    return <div className="text-center text-xl font-bold">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-col justify-center items-center w-full overflow-auto">
      <div className="w-full min-h-screen bg-white flex flex-col items-center py-10">
        <h1 className="text-green-600 font-bold text-xl sm:text-3xl text-center mb-6">
          Available Stocks & Sectors
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 w-full max-w-7xl">
          {Object.keys(sectorsWithStocks).map((sector, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 p-4 rounded-xl shadow-lg w-full"
            >
              <label className="font-semibold text-sm sm:text-lg mb-2">
                {sector}
              </label>
              <select
                className="p-2 border rounded-md w-full bg-white"
                onChange={(e) => handleStockSelect(e, sector)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a stock
                </option>
                {sectorsWithStocks[sector]?.map((stock, idx) => (
                  <option key={idx} value={stock.stock}>
                    {stock.stock} - ₹{stock.price}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-green-600 p-2 mt-4 text-white font-semibold rounded-2xl"
        >
          Your Cart ({selectedStocks.length})
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4 text-center">Your Cart</h2>

            <input
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="Enter Portfolio Name"
              className="w-full p-2 border rounded-md mb-3"
            />

            {selectedStocks.length > 0 ? (
              <div className="overflow-auto max-h-60">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-sm sm:text-base">
                      <th className="border p-2">Stock</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Qty</th>
                      <th className="border p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStocks.map((item, index) => (
                      <tr
                        key={index}
                        className="text-center text-sm sm:text-base"
                      >
                        <td className="border p-2">{item.stock}</td>
                        <td className="border p-2">₹{item.price}</td>
                        <td className="border p-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                index,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-10 text-center border rounded-md"
                          />
                        </td>
                        <td className="border p-2">
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            )}

            <div className="text-right font-bold text-lg mt-4">
              Total: ₹{totalPrice}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={resetSelections}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={savePortfolio}
              >
                Save Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
