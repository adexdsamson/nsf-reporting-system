import React, { useState, useEffect, useRef } from "react";
import { GeoMap } from "@/components/layouts/GeoMap";
import data from "@/components/layouts/world-map.json";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalDailyTransactions, setTotalDailyTransactions] =
    useState<number>(5266466); // Sample number for demonstration

  useEffect(() => {
    const interval = setInterval(() => {
      // Existing transaction generation logic
      const nigerianBanks = BANKS.slice(0, 12);
      const internationalBanks = BANKS.slice(12);
      const isInternational = Math.random() < 0.1;

      let source, target;
      if (isInternational) {
        source =
          internationalBanks[
            Math.floor(Math.random() * internationalBanks.length)
          ];
        target =
          nigerianBanks[Math.floor(Math.random() * nigerianBanks.length)];
      } else {
        source =
          nigerianBanks[Math.floor(Math.random() * nigerianBanks.length)];
        target =
          nigerianBanks[Math.floor(Math.random() * nigerianBanks.length)];
      }

      if (source !== target) {
        const newTx = {
          id: Math.random().toString(36).substring(2),
          source: source.coordinates,
          target: target.coordinates,
        };

        setTransactions((prev) => [...prev, newTx]);
        setTotalDailyTransactions(
          (prev) => prev + Math.floor(Math.random() * 100)
        );

        setTimeout(() => {
          setTransactions((curr) => curr.filter((tx) => tx.id !== newTx.id));
        }, 3000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-[#1a1a1a] text-white">
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar - Recent transactions graph */}
        <div className="w-64 p-4">
          <h2 className="text-sm font-semibold mb-4">
            RECENT DAILY TRANSACTIONS
          </h2>
          <div className="h-48 bg-gradient-to-t from-pink-500/20 to-transparent relative">
            {/* Graph placeholder */}
          </div>
        </div>

        {/* Main map area */}
        <div className="flex-1 relative overflow-auto">
          {/* Header */}
          <div className="flex flex-col items-center p-6  backdrop-blur-md absolute w-full">
            <h1 className="text-3xl font-thin mb-2">LIVE TRANSACTION MAP</h1>
            <div className="text-pink-500 text-base">
              {totalDailyTransactions.toLocaleString()} TRANSACTIONS ON THIS DAY
            </div>
          </div>

          <GeoMap
            data={data}
            property="pop_est"
            defaultCountry={data.features.find(
              (item) => item.properties.name === "Nigeria"
            )}
            transactions={transactions}
            banks={BANKS}
          />

          <div className="absolute bottom-3 w-full  py-3 grid place-items-center">
            <Button
              onClick={() => navigate("/dashboard/home")}
              variant={"outline"}
              className=""
            >
              View Transactions
            </Button>
          </div>
        </div>

        {/* Right sidebar - Statistics */}
        <div className="w-64 p-4">
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-4">
              TOP TRANSACTION SOURCES
            </h2>
            <div className="space-y-2">
              {BANKS.slice(0, 5).map((bank) => (
                <div
                  key={bank.code}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <img
                    src={`/bank-icons/${bank.code.toLowerCase()}.png`}
                    alt=""
                    className="w-6 h-6"
                  />
                  <span>{bank.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-4">
              TOP TRANSACTION TYPES
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Domestic Transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>International Transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Mobile Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------
// 1. Types & Sample Data
// -------------------
interface Bank {
  name: string;
  address: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface Transaction {
  id: string;
  source: Bank;
  target: Bank;
}

// Sample bank data. Replace with your own or fetch dynamically.
const BANKS: Bank[] = [
  // Nigerian Banks and their branches
  {
    name: "First Bank of Nigeria HQ",
    address: "Lagos",
    code: "FBN",
    coordinates: [3.3792, 6.5244],
    type: "commercial",
  },
  {
    name: "First Bank Abuja Branch",
    address: "Abuja",
    code: "FBN-ABJ",
    coordinates: [7.3986, 9.0765],
    type: "commercial",
    parentBank: "FBN",
    isBranch: true,
  },
  {
    name: "Access Bank HQ",
    address: "Lagos",
    code: "ACB",
    coordinates: [3.3986, 6.4505],
    type: "commercial",
  },
  {
    name: "Access Bank Kano Branch",
    address: "Kano",
    code: "ACB-KN",
    coordinates: [8.5167, 12.0],
    type: "commercial",
    parentBank: "ACB",
    isBranch: true,
  },
  {
    name: "Zenith Bank HQ",
    address: "Lagos",
    code: "ZNB",
    coordinates: [3.3792, 6.5844],
    type: "commercial",
  },
  {
    name: "Zenith Bank PH Branch",
    address: "Port Harcourt",
    code: "ZNB-PH",
    coordinates: [7.0134, 4.8242],
    type: "commercial",
    parentBank: "ZNB",
    isBranch: true,
  },
  {
    name: "GTBank HQ",
    address: "Lagos",
    code: "GTB",
    coordinates: [3.3792, 6.4544],
    type: "commercial",
  },
  {
    name: "GTBank Ibadan Branch",
    address: "Ibadan",
    code: "GTB-IB",
    coordinates: [3.8967, 7.3775],
    type: "commercial",
    parentBank: "GTB",
    isBranch: true,
  },
  // International Banks
  {
    name: "HSBC London",
    address: "London",
    code: "HSBC",
    coordinates: [-0.1276, 51.5074],
    type: "commercial",
  },
  {
    name: "JP Morgan NY",
    address: "New York",
    code: "JPM",
    coordinates: [-74.0059, 40.7128],
    type: "commercial",
  },
  {
    name: "Deutsche Bank Frankfurt",
    address: "Frankfurt",
    code: "DB",
    coordinates: [8.6821, 50.1109],
    type: "commercial",
  },
  {
    name: "Bank of China Beijing",
    address: "Beijing",
    code: "BOC",
    coordinates: [116.4074, 39.9042],
    type: "commercial",
  },
];
