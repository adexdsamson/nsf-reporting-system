import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { BarChart2, Settings2, Download, ChevronRight } from "lucide-react";
import { TransactionData } from "@/types";
import { useQuery } from "@apollo/client";
import { GET_ALL_TRANSACTIONS } from "@/lib/graphql/schema";
import { transformTransactionData } from "@/lib/transforms/documentTransform";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS, {
    variables: {},
    onCompleted: (data) => {
      console.log("Transformed data:", transformTransactionData(data));
    },
  });

  const transformedData = transformTransactionData(data) as TransactionData[];

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
        const date = parseFloat(row.getValue("transaction_amount"));
        return format(date, "d0 MMMM yyyy");
      },
    },
    { accessorKey: "receiver_bank_name", header: "RECEIVER BANK" },
    { accessorKey: "transfer_type", header: "TRANSFER TYPE" },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => navigate("/dashboard/detail")}
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
          disableSelection: false,
        }}
        header={(table) => (
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
