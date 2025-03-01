/**
 * Transforms GraphQL transaction response into a flattened array of objects
 */
export const transformTransactionData = <T extends Record<string, any>>(
  data: T,
  key: keyof T
): Record<string, any>[] => {
  if (!data?.[key] || !Array.isArray(data?.[key])) return [];

  return data?.[key]?.map?.((transaction: any) => {
    // Start with base transaction fields
    const transformedTransaction: Record<string, any> = {
      id: transaction.id,
      label: transaction.label,
    };

    // Convert properties array into object key-value pairs
    transaction.properties?.forEach((prop: { key: string; value: any }) => {
      transformedTransaction[prop.key] = prop.value;
    });

    return transformedTransaction;
  });
};

/**
 * Transforms GraphQL transaction response into a flattened array of objects
 */
export const transformTransactionUpdateData = (data: any) => {
  if (!data?.transactionUpdates) return;

  // Start with base transaction fields
  const transformedTransaction: Record<string, any> = {};

  // Convert properties array into object key-value pairs
  data?.transactionUpdates.properties?.forEach(
    (prop: { key: string; value: any }) => {
      transformedTransaction[prop.key] = prop.value;
    }
  );

  return transformedTransaction;
};

/**
 * Transforms a single GraphQL transaction response into a flattened object
 */
export const transformSingleTransaction = (data: any) => {
  if (!data?.getTransaction) return null;

  const transaction = data.getTransaction;

  // Start with base transaction fields
  const transformedTransaction: Record<string, any> = {
    id: transaction.id,
  };

  // Convert properties array into object key-value pairs
  transaction.properties?.forEach((prop: { key: string; value: any }) => {
    transformedTransaction[prop.key] = prop.value;
  });

  return transformedTransaction;
};
