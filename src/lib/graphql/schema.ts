import { gql, TypedDocumentNode } from "@apollo/client";

export const GET_ALL_TRANSACTIONS: TypedDocumentNode<
  { transactions: Transaction },
  undefined
> = gql`
  query GetAllTransactions {
    transactions {
      id
      label
      properties {
        key
        value
      }
    }
  }
`;

type GetTransactionParams = {
  id: string;
};

type GetTransactionResponse = {
  getTransaction: Transaction;
};

export const GET_TRANSACTION: TypedDocumentNode<
  GetTransactionResponse,
  GetTransactionParams
> = gql`
  query GetTransaction($id: String!) {
    getTransaction(transactionId: $id) {
      id
      properties {
        key
        value
      }
    }
  }
`;

type GetTransactionForwardParams = {
  depth: number;
  timestamp: string;
  accountNumber: string;
};

type GetTransactionForwardResponse = {
  traceTransactionForward: Transaction[];
};

export const GET_FORWARD_TRACING: TypedDocumentNode<
  GetTransactionForwardResponse,
  GetTransactionForwardParams
> = gql`
  query ForwardTraceTransaction(
    $accountNumber: String!
    $depth: Int!
    $timestamp: String!
  ) {
    traceTransactionForward(
      accountNumber: $accountNumber
      depth: $depth
      timestamp: $timestamp
    ) {
      id
      properties {
        key
        value
      }
    }
  }
`;

type GetTransactionBackwardParams = {
  depth: number;
  timestamp: string;
  accountNumber: string;
};

type GetTransactionBackwardResponse = {
  traceTransactionBackward: Transaction;
};

export const GET_BACKWARD_TRACING: TypedDocumentNode<
  GetTransactionBackwardResponse,
  GetTransactionBackwardParams
> = gql`
  query TraceBackward(
    $accountNumber: String!
    $depth: Int!
    $timestamp: String!
  ) {
    traceTransactionBackward(
      accountNumber: $accountNumber
      depth: $depth
      timestamp: $timestamp
    ) {
      id
      properties {
        key
        value
      }
    }
  }
`;

type Transaction = {
  id: string;
  label: string;
  properties: {
    key: string;
    value: string;
  }[];
};

export const SUBSCRIBE_TO_TRANSACTION: TypedDocumentNode<
  Transaction,
  undefined
> = gql`
  subscription TransactionUpdates {
    transactionUpdates {
      id
      label
      properties {
        key
        value
      }
    }
  }
`;

type TransactionCount = {
  transactionCount: {
    count: number;
  };
};

export const SUBSCRIBE_TO_TRANSACTION_COUNT: TypedDocumentNode<
  TransactionCount,
  undefined
> = gql`
  subscription TransactionCount {
    transactionCount {
      count
    }
  }
`;

type Bank = {
  bank: string;
  branch: string;
  logoUrl: string;
  sortCode: string;
  latitude: number;
  longitude: number;
};

export const GET_BANK: TypedDocumentNode<
  { getAllBranches: Bank[] },
  undefined
> = gql`
  query GetAllBranches {
    getAllBranches {
      bank
      branch
      sortCode
      latitude
      longitude
      logoUrl
    }
  }
`;
