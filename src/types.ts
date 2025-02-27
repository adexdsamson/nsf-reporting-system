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
  receiver_bank_account: string;
  country: string;
  birth_date: Date;
  device_type: string;
  sender_location_latitude: number;
  zip_code: string;
  receiver_location_longitude: number;
  destination_sortcode: string;
  state: string;
  payment_method: string;
  fintech_id: string;
  sender_account_balance: number;
  device_id: string;
  sender_location_name: string;
  sender_account_name: string;
  sortcode_bank_location_latitude: number;
  transaction_or_session_id: string;
  transaction_description: string;
  brand_id: string;
  browser_name: string;
  receiver_bank_code: string;
  nationality: string;
  browser_hash: string;
  phone_number: string;
  bvn_number: string;
  city: string;
  transaction_amount: number;
  cookie_hash: string;
  device_hash: string;
  sender_location_longitude: number;
  password_hash: string;
  bank_name: string;
  receiver_name: string;
  first_name: string;
  transaction_currency: string;
  email: string;
  timestamp: Date;
  bank_code: string;
  address: string;
  transfer_session_id: string;
  sender_account_number: string;
  last_name: string;
  ip_address: string;
  middle_name: string;
  device_os: string;
  receiver_location_latitude: number;
  transaction_type: string;
  receiver_bank_name: string;
  transfer_type: string;
  sortcode_bank_location_longitude: number;
  transaction_time_stamp: Date;
  username: string;
}
