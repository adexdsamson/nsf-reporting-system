// import { useQuery } from "@tanstack/react-query";
// import { TransactionFlow } from "./components/TransactionFlow";
// import {
//   TransactionStepProps,
//   TransactionTracker,
// } from "./components/TransactionTracker";
// import { ApiResponse, ApiResponseError, TransactionDetails } from "@/types";
// import { getRequest } from "@/lib/axiosInstance";
// import { useLocation } from "react-router-dom";
// import { getTransactionDetail } from "@/demo";
// import { ScrollArea } from "@/components/ui/scroll-area";


// const details = getTransactionDetail();

// export const Reports = () => {
//   const location = useLocation();

//   const { data } = useQuery<
//     ApiResponse<TransactionDetails>,
//     ApiResponseError
//   >({
//     queryKey: ["transactions-detail", location.state?.id],
//     queryFn: async () => await getRequest(`transactions/${location.state?.id}`),
//   });

//   const transactionSteps = data?.data.transactions.map((item) => ({
//     accountNumber: item.recipient,
//     amount: item.transaction_type.toLowerCase() === "initial" ? -(item.amount ?? 0) : item.amount ?? 0,
//     bankName: item.bank_name,
//     currency: "₦",
//     description: item.description,
//     id: item.tracking_id,
//     status: item.transaction_type.toLowerCase() === "initial" ? "completed" : "action-required",
//     timestamp: item.timestamp || item.transaction_time,
//     title: `${item.recipient_bank_name || item.bank_name} verification`,
//     actionLabel: "j",
//     stepNumber: item.tracking_id,
//     remaining_balance: item.remaining_balance
//   })) as TransactionStepProps[];

//   console.log({ transactionSteps });
  

//   return (
//     <div className="p-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">FRAUD INVESTIGATION SYSTEM</h1>
//         <p className="text-muted-foreground text-sm max-w-2xl">
//           Follow the money trail across multiple banks and accounts with
//           precision and clarity. Identify fraud patterns and take action to
//           freeze compromised accounts.
//         </p>
//       </div>

//       <div className="grid grid-cols-2 mt-14 gap-5 h-[80dvh]">
//         <ScrollArea>
//           <div className="h-full px-3">
//             <TransactionTracker {...{ steps: transactionSteps ?? [] }} />
//           </div>
//         </ScrollArea>
//         <div className="bg-white">
//           <TransactionFlow  transactions={details.transactions} />
//         </div>
//       </div>
//     </div>
//   );
// };
// File: BankNetworkFlow.jsx
// import React from 'react';

// File: BankNetworkFlowDynamic.jsx
import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, Handle, ReactFlowInstance } from 'react-flow-renderer';
import { getLayoutedElements } from '@/utils/layout';
import { ApiResponse, ApiResponseError, TransactionItem } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getRequest } from '@/lib/axiosInstance';
import { Position } from '@xyflow/react';
import { flattenTransactions, stringToColour } from '../../utils/helpers';
import { ContentItem } from '../Detail';
import { Button } from '@/components/ui/button';
import { Eye, Shield, Calendar, Hash, DollarSign, User, Search, Download, Notebook, Check, Building, PiggyBank } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@radix-ui/react-separator';
import { FaBuilding, FaCity, FaMoneyBill } from 'react-icons/fa';
import { MdCommentBank } from 'react-icons/md';

export const Reports = () => {
  const { id } = useParams()

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [selectedTransaction, setSelectedTransaction] = useState(null)
  
  const { isLoading, data } = useQuery<ApiResponse<TransactionItem>, ApiResponseError>({
    queryKey: ["transactions"],
    queryFn: async () => await getRequest(`transactions/${id}`),
  })

  useEffect(() => {
    if (!data?.data.transactions) return;
    // If the root is an object with children, select the root transaction itself
    const rootTxn = data.data.transactions;
    setSelectedTransaction(rootTxn);
  }, [data]);

  const formatAmount = (amount: string | number) => {
    const formattedAmount = typeof amount === "number" ? amount.toLocaleString() : amount;
    return formattedAmount
  }
  
  useEffect(() => {
    // Simulate fetching data from an API
    // const fetchedNodes = Array.from({ length: 20 }, (_, i) => ({
      //   id: `Bank${i + 1}`,
      //   label: `Bank ${i + 1}`,
      // }));
      
    const txns = data?.data?.transactions ?? []
    if (!txns) return

    const { nodes: rfNodes, edges: rfEdges } = flattenTransactions(txns);

    // const fetchedEdges = Array.from({ length: 4 }, () => {
    //   const source = `Bank${Math.ceil(Math.random() * 20)}`;
    //   let target = `Bank${Math.ceil(Math.random() * 20)}`;
    //   while (target === source) {
    //     target = `Bank${Math.ceil(Math.random() * 20)}`;
    //   }
    //   return {
    //     source,
    //     target,
    //     label: `$${(Math.random() * 10).toFixed(2)}M`,
    //   };
    // });

    // Convert to React Flow format
    // const rfNodes: Node[] = fetchedNodes.map((bank, index) => ({
    //   id: `${bank.transaction_id}${index}`,
    //   type: "custom",
    //   data: { ...bank },
    //   position: { x: 0, y: 0 },
    //   style: {
    //     background: stringToColour(bank.bank_name),
    //     color: 'white',
    //     padding: 10,
    //     borderRadius: 2,
    //     fontWeight: 'bold',
    //     fontSize: 10,
    //     // width: 100,
    //   },
    //   className: `${bank.queue_number == selectedTransaction?.queue_number ? "animate-qrute" : ""}`
    // }));

    // const rfEdges: Edge[] = fetchedEdges.map((link, index) => ({
    //   id: `e${index}`,
    //   source: link.source,
    //   target: link.target,
    //   label: link.label,
    //   animated: true,
    //   style: { stroke: '#facc15' },
    // }));

    rfNodes.forEach(n => {
      if (n.data.queue_number === selectedTransaction?.queue_number) {
        n.className = "animate-qrute";
      }
    });

    const layouted = getLayoutedElements(rfNodes, rfEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [data, selectedTransaction]);

  console.log("nodes", nodes)
  console.log("edges", edges)

  const nodeTypes = {
    custom: (props: NodeProps) => (
      <div
        style={{ cursor: "grab" }}
        className={`rounded-sm px-3 py-2 border border-slate-200 ${props.selected ? "ring-2 ring-blue-400" : ""}`}
        onClick={() => setSelectedTransaction({ ...props.data })}
        {...props}
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

  if (!nodes || !edges || isLoading) return <></>
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
              // onInit={instance => { reactFlowRef.current = instance; }}
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
                  {selectedTransaction?.to ?? "---"}
                </div>
              </div>

              {/* Balance */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FaMoneyBill className="w-4 h-4" />
                  Current Balance
                </div>
                <div className="text-sm bg-slate-100/80 p-4 rounded-xl border border-slate-200">
                  ₦{formatAmount(selectedTransaction?.remaining_balance) ?? "---"}
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
    // <div style={{ height: '100vh', backgroundColor: 'transparent' }}>
    //   <div className="p-4 absolute z-50">
    //     <h1 className="text-2xl font-bold">FRAUD INVESTIGATION SYSTEM</h1>
    //     <p className="text-muted-foreground text-sm max-w-2xl">
    //       Follow the money trail across multiple banks and accounts with
    //       precision and clarity. Identify fraud patterns and take action to
    //       freeze compromised accounts.
    //     </p>
    //   </div>
    //   <div className='flex h-full'>
    //     <ReactFlow
    //       nodes={nodes}
    //       edges={edges}
    //       fitView
    //       nodesDraggable={false}
    //       elementsSelectable={true}
    //       nodeTypes={nodeTypes}
    //       >
    //       <Background />
    //       <Controls />
    //     </ReactFlow>
    //     {selectedNode && (
    //       <div className='relative w-[40%] h-screen bg-gray-200'>
    //         <h3 className='text-lg font-bold px-4 pt-4'>Accout & Transaction Details</h3>
    //         <p className='text-xs font-bold px-4' style={{color: stringToColour(selectedNode.bank_name)}}>{selectedNode.bank_name}</p>
    //         <div className='h-[1px] w-full bg-gray-400 my-4' />
    //         <div className='flex flex-col space-y-3 px-4'>
    //           <div>
    //             <h4 className='text-xs text-gray-700'>Transaction Id</h4>
    //             <p className='text-sm font-semibold text-gray-700'>{selectedNode.transaction_id}</p>
    //           </div>
    //           <div>
    //             <h4 className='text-xs text-gray-700'>Timestamp</h4>
    //             <p className='text-sm font-semibold text-gray-700'>{
    //               selectedNode.timestamp
    //               ? new Date(selectedNode.timestamp).toLocaleString()
    //               : selectedNode.transaction_time
    //                 ? new Date(selectedNode.transaction_time).toLocaleString()
    //                 : ""
    //               }
    //             </p>
    //           </div>
    //           <div>
    //             <h4 className='text-xs text-gray-700'>Description</h4>
    //             <p className='text-sm font-semibold text-gray-700'>{selectedNode.description}</p>
    //           </div>
    //           <div>
    //             <h4 className='text-xs text-gray-700'>To</h4>
    //             <p className='text-sm font-semibold text-gray-700'>{selectedNode.recipient_bank_name ?? "---"}</p>
    //           </div>
    //           <div>
    //             <h4 className='text-xs text-gray-700'>Balance</h4>
    //             <p className='text-sm font-semibold text-gray-700'>₦{formatAmount(selectedNode.remaining_balance) ?? "---"}</p>
    //           </div>
    //           <div>
    //             <h4 className='text-xs text-gray-700'>Suggestion</h4>
    //             <p className='text-sm font-semibold text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium vitae enim dicta, totam, magni magnam perspiciatis aspernatur libero odit, adipisci at eum exercitationem similique dignissimos animi et expedita blanditiis neque?</p>
    //           </div>
    //         </div>
    //         <div className='absolute bottom-0 left-0 p-4 w-full border-t border-gray-400 flex space-x-4'>
    //           <Button className='w-full rounded-sm' onClick={() => setSelectedNode(null)}>Close</Button>
    //           <Button variant="destructive" className='w-full rounded-sm'>Suggest PND</Button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};