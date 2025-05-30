import { Node, Edge } from 'react-flow-renderer';

export const stringToColour = (str: string = "") => {
  let hueValue = 0;

  for (let i = 0; i < str.length; i++) {
    hueValue += str.charCodeAt(i);
  }

  return `hsl(${hueValue % 360}, 60%, 50%)`
}

export interface TransactionNode {
  transaction_id?: string;
  tracking_id?: string;
  bank_name: string;
  amount?: number;
  children?: TransactionNode[];
  [key: string]: any;
}

interface FlattenResult {
  nodes: Node[];
  edges: Edge[];
}

export function flattenTransactions(
  txn: TransactionNode,
  parentId: string | null = null,
  nodes: Node[] = [],
  edges: Edge[] = [],
  index: { i: number } = { i: 0 }
): FlattenResult {
  const nodeId = `${txn.tracking_id || txn.transaction_id}_${index.i++}`;
  nodes.push({
    id: nodeId,
    type: "custom",
    data: { ...txn },
    position: { x: 0, y: 0 },
    style: {
      background: stringToColour("hello"),
      color: 'white',
      padding: 10,
      borderRadius: 2,
      fontWeight: 'bold',
      fontSize: 10,
    },
    className: "",
  });

  if (parentId) {
    edges.push({
      id: `e_${parentId}_${nodeId}`,
      source: parentId,
      target: nodeId,
      label: `₦${(txn.amount ?? 0).toLocaleString()}`,
      animated: true,
      style: { stroke: '#facc15' },
    });
  }

  if (Array.isArray(txn.children)) {
    txn.children.forEach(child =>
      flattenTransactions(child, nodeId, nodes, edges, index)
    );
  }

  return { nodes, edges };
}