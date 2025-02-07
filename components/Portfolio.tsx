"use client";

import { useState } from "react";

export default function Portfolio() {
  // Define sectors with stocks categorized by market cap
  const sectorsWithStocks: { [key: string]: { [key: string]: string[] } } = {
    IT: {
      Large: ["TCS", "Infosys", "Wipro"],
      Mid: ["Mindtree", "LTI", "Coforge"],
      Small: ["Zensar", "Mastek", "Happiest Minds"],
    },
    Finance: {
      Large: ["HDFC Bank", "ICICI Bank", "Kotak Mahindra Bank"],
      Mid: ["Canara Bank", "IDFC First Bank", "RBL Bank"],
      Small: ["Ujjivan Small Finance", "Equitas Bank", "AU Small Finance"],
    },
    Pharma: {
      Large: ["Sun Pharma", "Dr. Reddy's", "Cipla"],
      Mid: ["Lupin", "Glenmark", "Torrent Pharma"],
      Small: ["Aarti Drugs", "Caplin Point", "Eris Lifesciences"],
    },
  };

  // List of all sectors
  const allSectors = ["IT", "Finance", "Pharma"];

  // State to track selected cap category and quantity
  const [selectedCaps, setSelectedCaps] = useState<{ [key: string]: string }>({});
  const [selectedStocks, setSelectedStocks] = useState<{ [key: string]: { stock: string; quantity: number } }>({});

  // Handle cap category selection
  const handleCapSelect = (sector: string, cap: string) => {
    setSelectedCaps((prev) => ({ ...prev, [sector]: cap }));
  };

  // Handle stock quantity selection
  const handleStockQuantityChange = (sector: string, stock: string, quantity: number) => {
    setSelectedStocks((prev) => ({
      ...prev,
      [`${sector}-${stock}`]: { stock, quantity },
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center w-full overflow-auto">
      {/* Stocks & Sector Section */}
      <div className="w-full min-h-screen bg-white flex flex-col items-center py-10">
        <h1 className="text-green-600 font-bold text-xl sm:text-3xl text-center mb-6">
          Available Stocks & Sectors
        </h1>

        {/* Grid for Stocks and Sectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 w-full max-w-7xl">
          {allSectors.map((sector, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 p-4 rounded-xl shadow-lg w-full"
            >
              <label className="font-semibold text-sm sm:text-lg mb-2">{sector}</label>

              {/* Cap Selection Dropdown */}
              <select
                className="p-2 border rounded-md w-full bg-white mb-2"
                defaultValue=""
                onChange={(e) => handleCapSelect(sector, e.target.value)}
              >
                <option value="" disabled>
                  Select Cap Category
                </option>
                {Object.keys(sectorsWithStocks[sector]).map((cap) => (
                  <option key={cap} value={cap}>
                    {cap} Cap
                  </option>
                ))}
              </select>

              {/* Stock Selection Dropdown */}
              {selectedCaps[sector] && (
                <div className="w-full">
                  <select
                    className="p-2 border rounded-md w-full bg-white mb-2"
                    defaultValue=""
                    onChange={(e) => handleStockQuantityChange(sector, e.target.value, 1)}
                  >
                    <option value="" disabled>
                      Select a Stock
                    </option>
                    {sectorsWithStocks[sector][selectedCaps[sector]].map((stock, idx) => (
                      <option key={idx} value={stock}>
                        {stock}
                      </option>
                    ))}
                  </select>

                  {/* Quantity Input */}
                  {selectedStocks[`${sector}-${selectedStocks[`${sector}-${selectedCaps[sector]}`]?.stock}`] && (
                    <input
                      type="number"
                      min="1"
                      className="p-2 border rounded-md w-full bg-white"
                      placeholder="Quantity"
                      value={selectedStocks[`${sector}-${selectedStocks[`${sector}-${selectedCaps[sector]}`]?.stock}`]?.quantity || ""}
                      onChange={(e) =>
                        handleStockQuantityChange(sector, selectedStocks[`${sector}-${selectedCaps[sector]}`]?.stock, Number(e.target.value))
                      }
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
