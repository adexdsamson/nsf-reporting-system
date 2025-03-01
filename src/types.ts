import { AxiosResponse, AxiosError } from "axios";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
};

export type ApiError = {
  status: boolean;
  message: string;
};

export type ApiResponse<T = unknown> = AxiosResponse<T>;
export type ApiResponseError = AxiosError<ApiError>;

export interface TransactionData {
  bank_id: string;
  country: string;
  timestamp: string;
  sender_account_number: number;
  sender_account_name: string;
  sender_account_balance: number;
  bvn_number: string;
  bank_name: string;
  bank_code: string;
  state: string;
  city: string;
  zip_code: string;
  address: string;
  card_fullname: string;
  card_hash: string;
  card_country: string;
  card_last4: string;
  card_expiry: string;
  card_type: string;
  card_bin: string;
  cvv_result: string;
  username: string;
  nationality: string;
  email: string;
  phone_number: string;
  birth_date: Date;
  first_name: string;
  last_name: string;
  middle_name: string;
  device_id: string;
  ip_address: string;
  browser_hash: string;
  password_hash: string;
  device_type: string;
  device_hash: string;
  device_os: string;
  browser_name: string;
  brand_id: string;
  cookie_hash: string;
  transaction_amount: number;
  transaction_id: string;
  payment_method: string;
  transaction_type: string;
  transaction_description: string;
  transaction_currency: string;
  transaction_time_stamp: string;
  receiver_location: ReceiverLocation;
  sender_location: SenderLocation;
  destination_sortcode: null | string | string;
  sortcode_bank_location: null | string;
  transfer_type: null | string;
  transfer_session_id: null | string;
  receiver_bank_account_number: number;
  receiver_bank_code: string;
  receiver_bank_name: string;
  receiver_name: string;
  wallet_id: null | string;
  wallet_balance_before: null | string;
  wallet_balance_after: null | string;
  wallet_currency: null | string;
  wallet_transaction_id: null | string;
  gift_card_id: null | string;
  gift_card_balance_before: null | string;
  gift_card_balance_after: null | string;
  gift_card_provider: null | string;
  gift_card_currency: null | string;
  gift_card_transaction_id: null | string;
  rule_score: number;
  ai_score: null | number | string;
  overall_score: number;
}

export interface ReceiverLocation {
  latitude: number;
  longitude: number;
}

export interface SenderLocation {
  name: string;
  latitude: number;
  longitude: number;
}
