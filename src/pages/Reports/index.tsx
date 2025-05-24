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
import React, { useEffect, useState } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, Handle } from 'react-flow-renderer';
import { getLayoutedElements } from '@/utils/layout';
import { ApiResponse, ApiResponseError, TransactionItem } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getRequest } from '@/lib/axiosInstance';
import { Position } from '@xyflow/react';
import { stringToColour } from '../../utils/helpers';
import { ContentItem } from '../Detail';
import { Button } from '@/components/ui/button';

export const Reports = () => {
  const { id } = useParams()

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [selectedNode, setSelectedNode] = useState(null)

  const { isLoading, data } = useQuery<ApiResponse<TransactionItem>, ApiResponseError>({
    queryKey: ["transactions"],
    queryFn: async () => await getRequest(`transactions/${id}`),
  })

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
      
    const fetchedNodes = data?.data?.transactions ?? []
    if (!fetchedNodes) return

    const fetchedEdges = []

    for (let i = 0; i < fetchedNodes.length - 1; i++) {
      const amount = fetchedNodes[i].amount ?? fetchedNodes[i].transaction_amount;
      const formattedAmount = typeof amount === "number" ? amount.toLocaleString() : amount;
      const edge = {
        source: `${fetchedNodes[i].transaction_id}${i}`,
        target: `${fetchedNodes[i + 1].transaction_id}${i + 1}`,
        label: `₦${formattedAmount}`
      }
      fetchedEdges.push(edge)
    }

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
    const rfNodes: Node[] = fetchedNodes.map((bank, index) => ({
      id: `${bank.transaction_id}${index}`,
      type: "custom",
      data: { ...bank },
      position: { x: 0, y: 0 },
      style: {
        background: stringToColour(bank.bank_name),
        color: 'white',
        padding: 10,
        borderRadius: 2,
        fontWeight: 'bold',
        width: 100,
      },
      className: `${bank.queue_number == selectedNode?.queue_number ? "animate-qrute" : ""}`
    }));

    const rfEdges: Edge[] = fetchedEdges.map((link, index) => ({
      id: `e${index}`,
      source: link.source,
      target: link.target,
      label: link.label,
      animated: true,
      style: { stroke: '#facc15' },
    }));

    const layouted = getLayoutedElements(rfNodes, rfEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [data, selectedNode]);

  console.log("nodes", nodes)
  console.log("edges", edges)

  const nodeTypes = { custom: ({data}) => (
    <div onClick={() => setSelectedNode({...data})}>
      <p style={{fontSize: "7px", marginTop: "-0px"}}>{data?.bank_name}</p>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  ) };

  return (
    <div style={{ height: '100vh', backgroundColor: 'transparent' }}>
      <div className="p-4 absolute z-50">
        <h1 className="text-2xl font-bold">FRAUD INVESTIGATION SYSTEM</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Follow the money trail across multiple banks and accounts with
          precision and clarity. Identify fraud patterns and take action to
          freeze compromised accounts.
        </p>
      </div>
      <div className='flex h-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          elementsSelectable={true}
          nodeTypes={nodeTypes}
          >
          <Background />
          <Controls />
        </ReactFlow>
        {selectedNode && (
          <div className='relative w-[40%] h-screen bg-gray-200'>
            <h3 className='text-lg font-bold px-4 pt-4'>Accout & Transaction Details</h3>
            <p className='text-xs font-bold px-4' style={{color: stringToColour(selectedNode.bank_name)}}>{selectedNode.bank_name}</p>
            <div className='h-[1px] w-full bg-gray-400 my-4' />
            <div className='flex flex-col space-y-3 px-4'>
              <div>
                <h4 className='text-xs text-gray-700'>Transaction Id</h4>
                <p className='text-sm font-semibold text-gray-700'>{selectedNode.transaction_id}</p>
              </div>
              <div>
                <h4 className='text-xs text-gray-700'>Timestamp</h4>
                <p className='text-sm font-semibold text-gray-700'>{
                  selectedNode.timestamp
                  ? new Date(selectedNode.timestamp).toLocaleString()
                  : selectedNode.transaction_time
                    ? new Date(selectedNode.transaction_time).toLocaleString()
                    : ""
                  }
                </p>
              </div>
              <div>
                <h4 className='text-xs text-gray-700'>Description</h4>
                <p className='text-sm font-semibold text-gray-700'>{selectedNode.description}</p>
              </div>
              <div>
                <h4 className='text-xs text-gray-700'>To</h4>
                <p className='text-sm font-semibold text-gray-700'>{selectedNode.recipient_bank_name ?? "---"}</p>
              </div>
              <div>
                <h4 className='text-xs text-gray-700'>Balance</h4>
                <p className='text-sm font-semibold text-gray-700'>₦{formatAmount(selectedNode.remaining_balance) ?? "---"}</p>
              </div>
              <div>
                <h4 className='text-xs text-gray-700'>Suggestion</h4>
                <p className='text-sm font-semibold text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium vitae enim dicta, totam, magni magnam perspiciatis aspernatur libero odit, adipisci at eum exercitationem similique dignissimos animi et expedita blanditiis neque?</p>
              </div>
            </div>
            <div className='absolute bottom-0 left-0 p-4 w-full border-t border-gray-400 flex space-x-4'>
              <Button className='w-full rounded-sm' onClick={() => setSelectedNode(null)}>Close</Button>
              <Button variant="destructive" className='w-full rounded-sm'>Suggest PND</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};