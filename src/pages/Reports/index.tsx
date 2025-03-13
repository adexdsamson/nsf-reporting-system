import { useQuery } from "@tanstack/react-query";
import { TransactionFlow } from "./components/TransactionFlow";
import {
  TransactionStepProps,
  TransactionTracker,
} from "./components/TransactionTracker";
import { ApiResponse, ApiResponseError, TransactionDetails } from "@/types";
import { getRequest } from "@/lib/axiosInstance";
import { useLocation } from "react-router-dom";
import { getTransactionDetail } from "@/demo";
import { ScrollArea } from "@/components/ui/scroll-area";


const details = getTransactionDetail();

export const Reports = () => {
  const location = useLocation();

  const { data } = useQuery<
    ApiResponse<TransactionDetails>,
    ApiResponseError
  >({
    queryKey: ["transactions-detail", location.state?.id],
    queryFn: async () => await getRequest(`transactions/${location.state?.id}`),
  });

  const transactionSteps = data?.data.transactions.map((item) => ({
    accountNumber: item.recipient,
    amount: item.transaction_type.toLowerCase() === "initial" ? -(item.amount ?? 0) : item.amount ?? 0,
    bankName: item.bank_name,
    currency: "₦",
    description: item.description,
    id: item.tracking_id,
    status: item.transaction_type.toLowerCase() === "initial" ? "completed" : "action-required",
    timestamp: item.timestamp || item.transaction_time,
    title: `${item.recipient_bank_name || item.bank_name} verification`,
    actionLabel: "j",
    stepNumber: item.tracking_id,
    remaining_balance: item.remaining_balance
  })) as TransactionStepProps[];

  console.log({ transactionSteps });
  

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">FRAUD INVESTIGATION SYSTEM</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Follow the money trail across multiple banks and accounts with
          precision and clarity. Identify fraud patterns and take action to
          freeze compromised accounts.
        </p>
      </div>

      <div className="grid grid-cols-2 mt-14 gap-5 h-[80dvh]">
        <ScrollArea>
          <div className="h-full px-3">
            <TransactionTracker {...{ steps: transactionSteps ?? [] }} />
          </div>
        </ScrollArea>
        <div className="bg-white">
          <TransactionFlow  transactions={details.transactions} />
        </div>
      </div>
    </div>
  );
};
