/**
 * Transforms GraphQL transaction response into a flattened array of objects
 */
export const transformTransactionData = (data: any) => {
  if (!data?.transactions) return [];

  return data.transactions.map((transaction: any) => {
    // Start with base transaction fields
    const transformedTransaction: Record<string, any> = {
      id: transaction.id,
      label: transaction.label
    };

    // Convert properties array into object key-value pairs
    transaction.properties?.forEach((prop: { key: string; value: any }) => {
      transformedTransaction[prop.key] = prop.value;
    });

    return transformedTransaction;
  });
};