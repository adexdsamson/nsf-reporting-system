import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { BarChart2, Settings2, Download, ChevronRight } from "lucide-react";
import { TransactionData } from "@/types";
import { useQuery, useSubscription } from "@apollo/client";
import {
  GET_ALL_TRANSACTIONS,
  SUBSCRIBE_TO_TRANSACTION,
} from "@/lib/graphql/schema";
import {
  transformTransactionData,
  transformTransactionUpdateData,
} from "@/lib/transforms/documentTransform";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { loading, data } = useQuery(GET_ALL_TRANSACTIONS, {
    onCompleted: (data) => {
      // console.log(
      //   "Transformed transactions data:",
      //   transformTransactionData(data)
      // );
    },
  });

  // Replace the query with subscription
  const subscriptionQuery = useSubscription(SUBSCRIBE_TO_TRANSACTION, {
    onData: ({ data }) => {
      console.log(
        "Subscription data received!",
        transformTransactionUpdateData(data?.data)
      );
    },
    skip: !data?.transactions,
  });

  const paginateData = (
    data: TransactionData[],
    pageIndex: number,
    pageSize: number
  ) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const defaultTransaction: { transactions: TransactionData[] } = {
    transactions: [],
  };

  const transformedData = useMemo(() => {
    const allData = transformTransactionData(
      data ?? defaultTransaction,
      "transactions"
    ) as TransactionData[];
    const subData = transformTransactionUpdateData(
      subscriptionQuery.data
    ) as TransactionData;
    const combinedData = subData ? [...allData, subData] : allData;
  
    // Sort the combined data based on the timestamp
    combinedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
    return paginateData(
      combinedData,
      pagination.pageIndex,
      pagination.pageSize
    );
  }, [data, pagination, subscriptionQuery.data]);

  console.log({ transformedData });
  

  const columns: ColumnDef<TransactionData>[] = [
    { accessorKey: "transaction_id", header: "ID" },
    { accessorKey: "sender_account_name", header: "SENDER" },
    { accessorKey: "transaction_type", header: "TRANSACTION TYPE" },
    {
      accessorKey: "transaction_amount",
      header: "AMOUNT",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("transaction_amount"));
        const formatted = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(amount);
        return formatted;
      },
    },
    { accessorKey: "state", header: "STATE" },
    {
      accessorKey: "timestamp",
      header: "DATE",
      cell: ({ row }) => {
        const date = row.getValue("timestamp") as TransactionData["timestamp"];
        return format(date, "do MMMM yyyy hh:mm aaa");
      },
    },
    { accessorKey: "receiver_bank_name", header: "RECEIVER BANK" },
    {
      accessorKey: "overall_score",
      header: "OVERALL SCORE",
      cell: ({ row }) => {
        const score = row.getValue(
          "overall_score"
        ) as TransactionData["overall_score"];

        const getStatusColor = (status?: string) => {
          switch (status) {
            case "MEDIUM":
              return "text-amber-600 bg-amber-100";
            case "LOW":
              return "text-emerald-600 bg-emerald-100";
            case "HIGH":
              return "text-red-600 bg-red-100";
            default:
              return "text-gray-600 bg-gray-100";
          }
        };

        return (
          <span
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(
              score <= 40 ? "LOW" : score <= 60 ? "MEDIUM" : "HIGH"
            )}`}
          >
            {score <= 40 ? "LOW" : score <= 60 ? "MEDIUM" : "HIGH"}
          </span>
        );
      },
    },
    { accessorKey: "transfer_type", header: "TRANSFER TYPE" },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() =>
              navigate("/dashboard/detail", {
                state: { id: row.original.transaction_id },
              })
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={transformedData}
        options={{
          isLoading: loading,
          disablePagination: false,
          manualPagination: true,
          disableSelection: true,
          totalCounts: transformTransactionData(data ?? defaultTransaction, 'transactions')?.length,
          pagination,
          setPagination,
        }}
        header={() => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input placeholder="Search..." className="max-w-md" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};
