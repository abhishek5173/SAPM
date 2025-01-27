"use client";

import { useEffect, useState } from "react";
import Footcard from "./Footcard";
import axios from "axios";

export default function Footer() {
  const [data, setData] = useState<{ NAME: string; PRICE: number }[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "https://script.googleusercontent.com/macros/echo?user_content_key=j8p5_Bm-HugSuvKpXp7f34z3oYrFz01_ZXSAGgyU2aJkAnfEqPIWVZ4kJxqCvObFPeO-SzYWJnCG11nxjnytDeyj1WVZ3F4Vm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnC33MGu-v-qOfz7nttC74UzTjwd17yhm725gfAxkmVVnHojv849xrQIwQmqmLUjSMCxjfFcCpQtYQohmDyfQ5KIjhQLAS6HsHg&lib=MSwDhv6hGmNVSzVlVQ6dBcFjilJU4QU4H"
      );
      setData(response.data.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="h-32 flex justify-evenly items-center gap-8 w-screen">
      {loading ? (
        <div className="text-white text-xl">Loading...</div>
      ) : (
        data && data.map((item, index) => (
          <Footcard key={index} name={item.NAME} price={item.PRICE} />
        ))
      )}
    </div>
  );
}
