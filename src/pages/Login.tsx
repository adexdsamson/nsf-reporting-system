import { useState } from "react";
// import { GeoMap } from "@/components/layouts/GeoMap";
// import data from "@/components/layouts/world-map.json";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import {
  GET_BANK,
  SUBSCRIBE_TO_TRANSACTION,
  SUBSCRIBE_TO_TRANSACTION_COUNT,
} from "@/lib/graphql/schema";
import { transformTransactionUpdateData } from "@/lib/transforms/documentTransform";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionData } from "@/types";
import { TransactionState } from "@/components/ui/transaction-state";
import { Clock } from "lucide-react";
import { Globe } from "@/components/ui/globe";
// import { GeoMap } from "@/components/layouts/GeoMap";

function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
}

export const Login = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);

  const transactionSubscriptionQuery = useSubscription(
    SUBSCRIBE_TO_TRANSACTION_COUNT
  );

  const subscriptionQuery = useSubscription(SUBSCRIBE_TO_TRANSACTION, {
    onData: ({ data }) => {
      if (data) {
        const transformedData = transformTransactionUpdateData(
          subscriptionQuery.data
        ) as TransactionData;

        if (parseInt(transformedData?.overall_score) < 10) return;
        if (Array.isArray(transformedData)) return;
        if (typeof transformedData === "undefined") return;

        setTransaction(transformedData);

        setTransactions((prevTransactions) => [
          ...prevTransactions,
          transformedData,
        ]);
      }
    },
  });

  const bankQuery = useQuery(GET_BANK);

  return (
    <div className="flex flex-col w-full h-screen bg-[#1a1a1a] text-white">
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar - Recent transactions graph */}
        <div className="w-64 p-4">
          <h2 className="text-sm font-semibold mb-4">
            RECENT DAILY TRANSACTIONS
          </h2>
          <ScrollArea>
            <div className="h-[90dvh]">
              <TransactionState
                states={transactions.map((item) => ({
                  description: item?.transaction_description,
                  icon: <Clock className="h-4 w-4" />,
                  status: item?.sender_account_name ?? "",
                  isActive: true,
                }))}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Main map area */}
        <div className="flex-1 relative overflow-auto">
          {/* Header */}
          <div className="flex flex-col items-center p-6  backdrop-blur-md absolute w-full">
            <h1 className="text-3xl font-thin mb-2">LIVE TRANSACTION MAP</h1>
            <div className="text-pink-500 text-base">
              {transactionSubscriptionQuery?.data?.transactionCount?.count}{" "}
              TRANSACTIONS ON THIS DAY
            </div>
          </div>

          {/* <GeoMap
            data={[]}
            property="pop_est"
            
            transactions={[]}
          /> */}

          <Globe
            className="top-28"
            config={{
              markers: transaction
                ? [
                    {
                      location: [
                        transaction?.sender_location?.latitude,
                        transaction?.sender_location?.longitude,
                      ],
                      size: 10,
                    },
                    {
                      location: [
                        transaction?.receiver_location?.latitude,
                        transaction?.receiver_location?.longitude,
                      ],
                      size: 10,
                    },
                  ]
                : [],
            }}
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
              FINANCIAL INSTITUTIONS
            </h2>
            <div className="space-y-3">
              {removeDuplicates(
                bankQuery?.data?.getAllBranches ?? [],
                "bank"
              ).map((bank) => (
                <div
                  key={bank.sortCode}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <img src={bank.logoUrl} alt="" className="w-6 h-6" />
                  <span>{bank.bank}</span>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="mb-8">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};
