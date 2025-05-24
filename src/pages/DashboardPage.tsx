import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/layouts/DataTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { BarChart2, Settings2, Download, ChevronRight, Search, CheckCircle2, DollarSign, TrendingUp, BarChart3, Activity } from "lucide-react";
import { ApiResponse, ApiResponseError, TransactionItem } from "@/types";
// import { useQuery, useSubscription } from "@apollo/client";
// import {
//   GET_ALL_TRANSACTIONS,
//   SUBSCRIBE_TO_TRANSACTION,
// } from "@/lib/graphql/schema";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";


export const DashboardPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const { loading, data } = useQuery(GET_ALL_TRANSACTIONS);
  const { isLoading, data } = useQuery<ApiResponse<TransactionItem[]>, ApiResponseError>({
    queryKey: ["transactions"],
    queryFn: async () => await getRequest("transactions"),
  })

  // Replace the query with subscription
  // const subscriptionQuery = useSubscription(SUBSCRIBE_TO_TRANSACTION, {
  //   onData: ({ data }) => {
  //     console.log(
  //       "Subscription data received!",
  //       transformTransactionUpdateData(data?.data)
  //     );
  //   },
  //   skip: !data?.transactions,
  // });

  // const paginateData = (
  //   data: TransactionData[],
  //   pageIndex: number,
  //   pageSize: number
  // ) => {
  //   const start = pageIndex * pageSize;
  //   const end = start + pageSize;
  //   return data.slice(start, end);
  // };

  // const defaultTransaction: { transactions: TransactionData[] } = {
  //   transactions: [],
  // };

  // const transformedData = useMemo(() => {
  //   const allData = transformTransactionData(
  //     data as any,
  //     "transactions"
  //   ) as TransactionData[];

  //   // const subData = transformTransactionUpdateData(
  //   //   subscriptionQuery?.data
  //   // ) as TransactionData;

  //   const combinedData = subData?.transaction_id ? [...allData, subData] : allData;
  //   console.log('heloo', data?.transactions);
    
  //   // Sort the combined data based on the timestamp
  //   combinedData.sort((a, b) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime());
  
  //   return paginateData(
  //     combinedData,
  //     pagination.pageIndex,
  //     pagination.pageSize
  //   );
  // }, [data, pagination]);

  const transformedData = Array.isArray(data?.data) ? data.data : [];

  const columns: ColumnDef<TransactionItem>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "root_transaction_id", header: "ROOT Transaction ID" },
    { accessorKey: "total_transactions", header: "TOTAL TRANSACTIONS" },
    {
      accessorKey: "total_amount",
      header: "TOTAL AMOUNT",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
        const formatted = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(amount);
        return formatted;
      },
    },
    { accessorKey: "status", header: "STATUS" },
    {
      accessorKey: "created_at",
      header: "DATE",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as TransactionItem["created_at"];
        return format(date ?? '12/05/2024', "do MMMM yyyy hh:mm aaa");
      },
    },
    // { accessorKey: "receiver_bank_name", header: "RECEIVER BANK" },
    // {
    //   accessorKey: "overall_score",
    //   header: "OVERALL SCORE",
    //   cell: ({ row }) => {
    //     const score = row.getValue(
    //       "overall_score"
    //     ) as TransactionData["overall_score"];

    //     const getStatusColor = (status?: string) => {
    //       switch (status) {
    //         case "MEDIUM":
    //           return "text-amber-600 bg-amber-100";
    //         case "LOW":
    //           return "text-emerald-600 bg-emerald-100";
    //         case "HIGH":
    //           return "text-red-600 bg-red-100";
    //         default:
    //           return "text-gray-600 bg-gray-100";
    //       }
    //     };

    //     return (
    //       <span
    //         className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(
    //           parseInt(score) <= 40 ? "LOW" : parseInt(score) <= 60 ? "MEDIUM" : "HIGH"
    //         )}`}
    //       >
    //         {parseInt(score) <= 40 ? "LOW" : parseInt(score) <= 60 ? "MEDIUM" : "HIGH"}
    //       </span>
    //     );
    //   },
    // },
    // { accessorKey: "transfer_type", header: "TRANSFER TYPE" },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() =>
              navigate("/dashboard/reports", {
                state: { id: row.original.id },
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Transaction Reports
              </h1>
              <p className="text-slate-600">Monitor and analyze your transaction data</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Total Transactions</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{transformedData?.length || 0}</p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(transformedData?.reduce((sum, t) => sum + t.total_amount, 0) || 0)}
                  </p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">100%</p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>All transactions completed</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={transformedData ?? []}
              options={{
                isLoading: isLoading,
                disablePagination: false,
                manualPagination: true,
                disableSelection: true,
                totalCounts: transformedData?.length,
                pagination,
                setPagination,
              }}
              header={() => (
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search transactions by ID, amount, or status..."
                        className="pl-10 border-slate-200 focus:border-slate-400 focus:ring-slate-400 max-w-md"
                      />
                    </div>
                    {/* <FilterDropdown /> */}
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
