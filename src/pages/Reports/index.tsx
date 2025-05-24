import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRequest } from '@/lib/axiosInstance';
import { ApiResponse, ApiResponseError } from '@/types';
import { getLayoutedElements } from '@/utils/layout';
import { Separator } from '@radix-ui/react-separator';
import { useQuery } from '@tanstack/react-query';
import { Building, Calendar, Check, Download, Hash, Notebook, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Handle, Node, NodeProps, Position } from 'react-flow-renderer';
import { FaBuilding, FaMoneyBill } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { flattenTransactions } from '../../utils/helpers';

export const Reports = () => {
  const { id } = useParams();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  const { isLoading, data } = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ["transactions"],
    queryFn: async () => await getRequest(`transactions/${id}`),
  });

  useEffect(() => {
    if (!data?.data.transactions) return;
    const rootTxn = data.data.transactions;
    setSelectedTransaction(rootTxn);
  }, [data]);

  const formatAmount = (amount: string | number = 0) => {
    const formattedAmount = typeof amount === "number" ? amount.toLocaleString() : amount;
    return formattedAmount;
  };

  useEffect(() => {
    const txns = data?.data?.transactions ?? [];
    if (!txns) return;

    const { nodes: rfNodes, edges: rfEdges } = flattenTransactions(txns);

    rfNodes.forEach(n => {
      if (n.data.queue_number === selectedTransaction?.queue_number) {
        n.className = "animate-qrute";
      }
    });

    const layouted = getLayoutedElements(rfNodes, rfEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [data, selectedTransaction]);

  const nodeTypes = {
    custom: (props: NodeProps) => (
      <div
        style={{ cursor: "grab" }}
        className={`rounded-sm px-3 py-2 border border-slate-200 ${props.selected ? "ring-2 ring-blue-400" : ""}`}
        onClick={() => setSelectedTransaction({ ...props.data })}
      >
        <div className="flex items-center space-x-1">
          <FaBuilding />
          <p className="whitespace-nowrap">{props.data.bank_name}</p>
        </div>
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </div>
    ),
  };

  if (!nodes || !edges || isLoading) return <></>;
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex h-full w-full">
        {/* Main Dashboard */}
        <div className="flex w-full flex-col p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    FRAUD INVESTIGATION SYSTEM
                  </h1>
                  <p className="text-slate-600 text-md">
                    Advanced transaction flow analysis and pattern detection
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Check className="w-4 h-4" />
                  Mark as Resolved
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction Flow Chart */}
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodesDraggable={true}
              elementsSelectable={true}
              nodeTypes={nodeTypes}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>

        {/* Sidebar */}
        {selectedTransaction !== null && (
          <div className="w-[45%] h-screen flex flex-col justify-between bg-white/70 backdrop-blur-xl border-l border-slate-200 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Transaction Details</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/80 px-3 py-1">
                Investigation Active
              </Badge>
            </div>

            <div className="space-y-6 h-[73vh] overflow-auto">
              {/* Transaction ID */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Hash className="w-4 h-4" />
                  Transaction ID
                </div>
                <div className="font-mono text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  {selectedTransaction?.transaction_id}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Building className="w-4 h-4" />
                  Bank Name
                </div>
                <div className="text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  {selectedTransaction?.bank_name}
                </div>
              </div>

              {/* Timestamp */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="w-4 h-4" />
                  Timestamp
                </div>
                <div className="text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  {selectedTransaction?.timestamp
                    ? new Date(selectedTransaction?.timestamp).toLocaleString()
                    : selectedTransaction?.transaction_time
                      ? new Date(selectedTransaction?.transaction_time).toLocaleString()
                      : ""
                  }
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Notebook className="w-4 h-4" />
                  Description
                </div>
                <div className="text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  {selectedTransaction?.description}
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="w-4 h-4" />
                  Account Holder
                </div>
                <div className="text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  {selectedTransaction?.recipient ?? "---"}
                </div>
              </div>

              {/* Balance */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaMoneyBill className="w-4 h-4" />
                  Current Balance
                </div>
                <div className="text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  ₦{formatAmount(selectedTransaction?.remaining_balance ?? 0)}
                </div>
              </div>

              <Separator className="my-6" />

              {/* AI Analysis */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Shield className="w-4 h-4" />
                  AI Analysis & Recommendations
                </div>
                <div className="text-sm text-slate-700 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 leading-relaxed">
                  Place PND on this account
                </div>
              </div>

              <Separator className="my-6" />
            </div>

            {/* Action Buttons */}
            <div className="w-full flex space-x-2">
              <Button onClick={() => setSelectedTransaction(null)} className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold shadow-lg">
                Close
              </Button>
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg">
                Suggest PND
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};