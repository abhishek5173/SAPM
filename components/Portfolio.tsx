"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Portfolio() {
  const [sectorsWithStocks, setSectorsWithStocks] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://script.googleusercontent.com/macros/echo?user_content_key=XFbb6r627vwBTWNdOBTDSeL0KQYrq-qcZ0yIS5VE0LD8_JG-uOkhsq1LRatZHjruHVpn2SVehCYxvoEZrqEn2wGPG-hQxknYm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO7vxK_gh2q46FW8N6O32tMyaCbTi7OtvoWObHj5wLmMqVHJHpcJNUK0vEe8zNmHvhl9PhPIIbUVdk4NPkHSl66Y6h1Fe1rV9dz9Jw9Md8uu&lib=MfEcSXofpCfK_wuKbVXUkRi91h4gJfZU7"
      )
      .then((response) => {
        const transformedData: { [key: string]: string[] } = {};

        response.data.data.forEach((item: { Sector: string; Stock: string }) => {
          transformedData[item.Sector] = transformedData[item.Sector] || [];
          transformedData[item.Sector].push(item.Stock);
        });

        setSectorsWithStocks(transformedData);
        console.log(transformedData);
      })
      .catch((err) => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-xl font-bold">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

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
              <label className="font-semibold text-sm sm:text-lg mb-2">{sector}</label>
              <select className="p-2 border rounded-md w-full bg-white" defaultValue="">
                <option value="" disabled>
                  Select a stock
                </option>
                {sectorsWithStocks[sector]?.map((stock, idx) => (
                  <option key={idx} value={stock}>
                    {stock}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div><button className="bg-green-600 p-2 text-white font-semibold rounded-2xl">Your Cart</button></div>
      </div>
    </div>
  );
}
