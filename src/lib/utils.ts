import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getFormatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

// Define GraphQL types
type GraphQLProperty = {
  key: string;
  value: any;
  __typename: string;
};

type GraphQLTransaction = {
  id: string;
  label: string;
  properties: GraphQLProperty[];
  __typename: string;
};


// Convert a single transaction into a Gremlin node object
function convertTransactionToNode(tx: GraphQLTransaction): Record<string, any> {
  // Start with an empty node object
  const node: Record<string, any> = {};

  // For each property, wrap its value (stringified if object) in an array.
  tx.properties.forEach((prop) => {
    let val: string;
    if (typeof prop.value === "object" && prop.value !== null) {
      val = JSON.stringify(prop.value);
    } else {
      val = String(prop.value);
    }
    node[prop.key] = [val];
    if (prop.key === "receiver_account_number") {
      node["<T.id: 1>"] = prop.value;
    }
  });

  // Add the special Gremlin node fields
  node["<T.label: 4>"] = "processed_transaction";
  return node;
}

/**
 * Converts a GraphQLResponse into a Gremlin-style path array.
 * The path alternates between nodes and "next" relationship edges.
 *
 * @param response - The original GraphQL response.
 * @returns An array representing the Gremlin path.
 */
export function convertToGremlinPath<T extends Record<string, any>>(response: T, key: T['data']): any[] {
  const txs = response?.data?.[key];
  if (!txs || !txs.length) return [];

  const path: any[] = [];
  // Process the first transaction node.
  path.push(convertTransactionToNode(txs[0]));

  // For each subsequent transaction, insert an edge then the node.
  for (let i = 1; i < txs.length; i++) {
    // Create an edge object representing the relationship "next"
    const edge = {
      "<T.id: 1>": txs[i - 1].id,
      "<T.label: 4>": "next",
    };
    path.push(edge);
    path.push(convertTransactionToNode(txs[i]));
  }
  return path;
}

export function convertGremlinPathToD3Tree(
  path: Record<string, string>[]
): any {
  if (path?.length === 0) return { name: "empty", children: [] };

  // Set the root name to the first transaction's ID
  const root = {
    name: path?.[0]?.["<T.id: 1>"],
    children: [] as Record<string, any>[],
    transaction: path?.[0],
  };

  // Process each element in the path
  for (let i = 0; i < path?.length; i++) {
    const item = path?.[i];

    // Only process node items (skip edges)
    if (item["<T.label: 4>"] === "processed_transaction") {
      const nodeName = item?.["<T.id: 1>"];

      // Skip nodes with undefined names
      if (!nodeName) continue;

      const treeNode = {
        name: nodeName,
        children: [] as any[],
        transaction: item,
      };
      console.log({ treeNode });

      // Reference the next transaction if it exists
      if (
        i + 1 < path?.length &&
        path?.[i + 1]?.["<T.label: 4>"] === "processed_transaction"
      ) {
        const nextNodeName = path?.[i + 1]["<T.id: 1>"];
        treeNode.children.push({
          name: nextNodeName,
          size: 100,
          transaction: path[i + 1],
        }); // Increased size
      }

      // Add the node to the root's children
      root.children.push(treeNode);
    }
  }

  return root;
}

/**
 * Converts a GraphQLResponse into a ForceGraphProps data structure using sender_account_number as the node id.
 *
 * @param response - The GraphQL response to convert.
 * @returns An object representing the force graph data.
 */
export function convertGraphQLResponseToForceGraph<T extends Record<string, any>>(
  response: T,
  key: keyof T["data"]
): any {
  const nodes = response?.data?.[key]?.map((tx: any) => {
    const senderAccountNumber = tx.properties.find(
      (prop: any) => prop.key === "sender_account_number"
    )?.value;
    return {
      id: senderAccountNumber,
      label: senderAccountNumber,
      group: 1, // Assign a group number for color coding if needed
      data: tx.properties.reduce((acc: any, prop: any) => {
        acc[prop.key] = prop.value;
        return acc;
      }, {} as any),
    };
  });

  const links = response?.data?.traceTransactionForward
    ?.slice?.(1)
    ?.map?.((tx: any, index: any) => {
      const previousSenderAccountNumber = response.data.traceTransactionForward[
        index
      ].properties.find((prop: any) => prop.key === "sender_account_number")?.value;
      const currentSenderAccountNumber = tx.properties.find(
        (prop: any) => prop.key === "sender_account_number"
      )?.value;
      return {
        source: previousSenderAccountNumber,
        target: currentSenderAccountNumber,
        value: 1, // Assign a default value for link width if needed
      };
    });

  return { nodes, links };
}

// Example usage:
// const forceGraphData = convertGraphQLResponseToForceGraph(yourGraphQLResponse);
