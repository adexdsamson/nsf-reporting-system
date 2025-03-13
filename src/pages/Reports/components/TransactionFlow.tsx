import { Badge } from "@/components/ui/badge";
import {
  addEdge,
  Background,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Ban, Building, CreditCard } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import '@xyflow/react/dist/style.css';
import { Transaction } from "@/types";

interface BankNodeProps {
  id: string;
  data: {
    label: string;
    balance: number;
    frozen: boolean;
  };
}

const BankNode = ({ data }: BankNodeProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-md min-w-[180px]">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
        <Building className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold">{data.label}</h3>
        {data.frozen && (
          <Badge
            variant="secondary"
            className="ml-auto flex items-center gap-1 bg-red-50 text-red-500 text-xs"
          >
            <Ban className="h-3 w-3" />
            <span>Frozen</span>
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Role:</span>
          <span className="text-xs font-medium">Financial Institution</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#9CA3AF", width: 8, height: 8 }}
      />
    </div>
  );
};

interface AccountNodeProps {
  id: string;
  data: {
    accountNumber: string;
    bank: string;
    balance: number;
    frozen: boolean;
  };
}

const AccountNode = ({ data }: AccountNodeProps) => {
  const formattedBalance =
    typeof data.balance === "number"
      ? `₦${data.balance.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`
      : "₦0.00";

  // const maskedAccountNumber =
  //   data.accountNumber?.substring?.(0, 3) +
  //   "****" +
  //   data.accountNumber?.substring?.(data.accountNumber.length - 3);

  return (
    <div
      className={`bg-white rounded-lg border px-3 py-2 shadow-md min-w-[180px] ${
        data.frozen ? "border-red-300" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
        <CreditCard className="h-4 w-4 text-gray-500" />
        <h3 className="text-xs font-mono">{data.accountNumber}</h3>
        {data.frozen && (
          <Badge
            variant="secondary"
            className="ml-auto flex items-center gap-1 bg-red-50 text-red-500 text-xs"
          >
            <Ban className="h-3 w-3" />
            <span>Frozen</span>
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Bank:</span>
          <span className="text-xs font-medium">{data.bank}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Balance:</span>
          <span className="text-xs font-medium">{formattedBalance}</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#9CA3AF", width: 8, height: 8 }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#9CA3AF", width: 8, height: 8 }}
      />
    </div>
  );
};

const nodeTypes = {
  bank: BankNode,
  account: AccountNode,
};


interface TransactionFlowProps {
  transactions?: Transaction[];
  activeReferenceNumber?: string;
}

export const TransactionFlow = ({
  transactions = [],
  activeReferenceNumber,
}: TransactionFlowProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Create nodes based on transactions
  const initialNodes: Node[] = useMemo(() => {
    const nodeMap = new Map();
    const nodes: Node[] = [];
    let xPosition = 0;

    
    // Process banks first
    transactions.forEach((transaction) => {
      if (!nodeMap.has(transaction.bank_code)) {
        const node = {
          id: `bank-${transaction.bank_code}`,
          type: "bank",
          data: { label: transaction.bank_name, balance: 0, frozen: false },
          position: { x: xPosition, y: 100 },
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
        xPosition += 300;
      }

      if (!nodeMap.has(`bank-${transaction.recipient_bank_code}`)) {
        const node = {
          id: `bank-${transaction.recipient_bank_code}`,
          type: "bank",
          data: { label: transaction.recipient_bank_name, balance: 0, frozen: false },
          position: { x: xPosition, y: 100 },
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
        xPosition += 300;
      }
    });

    // Reset for accounts
    xPosition = 50;
    let yPosition = 250;

    // Process accounts
    // transactions.forEach((transaction, index) => {
    //   if (!nodeMap.has(`account-${transaction.recipient}`)) {
    //     const node = {
    //       id: `account-${transaction.recipient}`,
    //       type: "account",
    //       data: {
    //         accountNumber: transaction.recipient,
    //         bank: transaction.bank_name,
    //         balance: Math.random() * 10000,
    //         frozen: false,
    //       },
    //       position: { x: xPosition, y: yPosition * index },
    //     };
    //     nodes.push(node);
    //     nodeMap.set(node.id, node);
    //     xPosition += 200;
    //   }

    //   if (!nodeMap.has(`account-${transaction.recipient}`)) {
    //     const node = {
    //       id: `account-${transaction.recipient}`,
    //       type: "account",
    //       data: {
    //         accountNumber: transaction.recipient,
    //         bank: transaction.recipient_bank_name,
    //         balance: transaction.amount,
    //         frozen:
    //           transaction.status === "frozen" ||
    //           transaction.status === "recovered",
    //       },
    //       position: { x: xPosition, y: yPosition },
    //     };
    //     nodes.push(node);
    //     nodeMap.set(node.id, node);
    //     xPosition += 200;

    //     if (xPosition > 800) {
    //       xPosition = 50;
    //       yPosition += 150;
    //     }
    //   }
    // });

    return nodes;
  }, [transactions]);

  // Create edges based on transactions
  const initialEdges: Edge[] = useMemo(() => {
    return transactions
      .map((transaction) => ({
        id: transaction.transaction_id,
        source: `bank-${transaction.bank_code}`,
        target: `bank-${transaction.recipient_bank_code}`,
        animated: false,
        style: { strokeWidth: 2 },
        // markerEnd: {
        //   type: MarkerType.ArrowClosed,
        // },
      }));
  }, [transactions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.5}
      maxZoom={1.5}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
    >
      {/* <Controls /> */}
      <MiniMap zoomable pannable />
      <Background color="#f9fafb" size={1.5} />

      <Panel
        position="top-left"
        className="bg-white bg-opacity-80 p-2 rounded-md shadow-sm border border-gray-100"
      >
        <div className="flex flex-col gap-2">
          {activeReferenceNumber && (
            <Badge variant="outline" className="text-xs mb-2">
              Reference: {activeReferenceNumber}
            </Badge>
          )}
        </div>
      </Panel>
    </ReactFlow>
  );
};
