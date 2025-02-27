import { useQuery, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      fintech_id
      country
      timestamp
      sender_account_number
      sender_account_name
      sender_account_balance
      bvn_number
      bank_name
      bank_code
      state
      city
      zip_code
      address
      card_fullname
      card_hash
      card_country
      card_last4
      card_expiry
      card_type
      card_bin
      cvv_result
      username
      nationality
      email
      phone_number
      birth_date
      first_name
      last_name
      middle_name
      device_id
      ip_address
      browser_hash
      password_hash
      device_type
      device_hash
      device_os
      browser_name
      brand_id
      cookie_hash
      transaction_amount
      transaction_or_session_id
      transaction_type
      transaction_currency
      transaction_description
      payment_method
      receiver_location
      sender_location
      destination_sortcode
      sortcode_bank_location
      transfer_type
      transfer_session_id
      receiver_bank_account
      receiver_bank_name
      receiver_name
      transaction_time_stamp
      wallet_id
      wallet_balance_before
      wallet_balance_after
      wallet_currency
      wallet_transaction_id
      gift_card_id
      gift_card_provider
      gift_card_currency
      gift_card_transaction_id
    }
  }
`;

const TRANSACTION_SUBSCRIPTION = gql`
  subscription OnTransactionAdded {
    transactionAdded {
      fintech_id
      country
      timestamp
      sender_account_number
      sender_account_name
      sender_account_balance
      bvn_number
      bank_name
      bank_code
      state
      city
      zip_code
      address
      card_fullname
      card_hash
      card_country
      card_last4
      card_expiry
      card_type
      card_bin
      cvv_result
      username
      nationality
      email
      phone_number
      birth_date
      first_name
      last_name
      middle_name
      device_id
      ip_address
      browser_hash
      password_hash
      device_type
      device_hash
      device_os
      browser_name
      brand_id
      cookie_hash
      transaction_amount
      transaction_or_session_id
      transaction_type
      transaction_currency
      transaction_description
      payment_method
      receiver_location
      sender_location
      destination_sortcode
      sortcode_bank_location
      transfer_type
      transfer_session_id
      receiver_bank_account
      receiver_bank_name
      receiver_name
      transaction_time_stamp
      wallet_id
      wallet_balance_before
      wallet_balance_after
      wallet_currency
      wallet_transaction_id
      gift_card_id
      gift_card_provider
      gift_card_currency
      gift_card_transaction_id
    }
  }
`;

export const useTransactions = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);

  const { data: subscriptionData } = useSubscription(TRANSACTION_SUBSCRIPTION);

  return {
    transactions: data?.transactions || [],
    newTransaction: subscriptionData?.transactionAdded,
    loading,
    error,
  };
};