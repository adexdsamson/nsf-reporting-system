import { Transaction, TransactionDetails, TransactionItem } from "@/types";
import { faker } from "@faker-js/faker";

export const makeArrayData = <T = unknown>(func: () => T) =>
  faker.helpers.multiple(func, { count: 10 });

export const GraphqlTransactionData = {
  data: {
    traceTransactionForward: [
      {
        id: "e",
        label: "p",
        properties: [
          {
            key: "country",
            value: "Nigeria",
            __typename: "Property",
          },
          {
            key: "card_hash",
            value: "8320",
            __typename: "Property",
          },
          {
            key: "cvv_result",
            value: "true",
            __typename: "Property",
          },
          {
            key: "gift_card_balance_before",
            value: "None",
            __typename: "Property",
          },
          {
            key: "birth_date",
            value: "1990-03-22",
            __typename: "Property",
          },
          {
            key: "wallet_balance_before",
            value: "None",
            __typename: "Property",
          },
          {
            key: "device_type",
            value: "Mobile",
            __typename: "Property",
          },
          {
            key: "gift_card_transaction_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "zip_code",
            value: "700001",
            __typename: "Property",
          },
          {
            key: "card_expiry",
            value: "08/28",
            __typename: "Property",
          },
          {
            key: "card_country",
            value: "Nigeria",
            __typename: "Property",
          },
          {
            key: "bank_id",
            value: "plutus-1740600641462",
            __typename: "Property",
          },
          {
            key: "destination_sortcode",
            value: "None",
            __typename: "Property",
          },
          {
            key: "sender_location",
            value: {
              name: "Ifeanyi Nwosu",
              latitude: 8.6753,
              longitude: 3.365,
            },
            __typename: "Property",
          },
          {
            key: "state",
            value: "Kano",
            __typename: "Property",
          },
          {
            key: "payment_method",
            value: "Online Payment",
            __typename: "Property",
          },
          {
            key: "sortcode_bank_location",
            value: "None",
            __typename: "Property",
          },
          {
            key: "card_fullname",
            value: "Ifeanyi Nwosu",
            __typename: "Property",
          },
          {
            key: "transaction_id",
            value: "TXN1740672417693",
            __typename: "Property",
          },
          {
            key: "sender_account_balance",
            value: "6500.0",
            __typename: "Property",
          },
          {
            key: "device_id",
            value: "d456e789-f012-345g-678h-901i23456789",
            __typename: "Property",
          },
          {
            key: "sender_account_name",
            value: "Ifeanyi Nwosu",
            __typename: "Property",
          },
          {
            key: "receiver_bank_name",
            value: "Zenith Bank",
            __typename: "Property",
          },
          {
            key: "card_last4",
            value: "7890",
            __typename: "Property",
          },
          {
            key: "transaction_type",
            value: "Online Payment",
            __typename: "Property",
          },
          {
            key: "transaction_description",
            value: "Payment via online gateway.",
            __typename: "Property",
          },
          {
            key: "brand_id",
            value: "brand-12",
            __typename: "Property",
          },
          {
            key: "browser_name",
            value: "Opera",
            __typename: "Property",
          },
          {
            key: "receiver_bank_code",
            value: "050",
            __typename: "Property",
          },
          {
            key: "gift_card_provider",
            value: "None",
            __typename: "Property",
          },
          {
            key: "nationality",
            value: "Nigerian",
            __typename: "Property",
          },
          {
            key: "browser_hash",
            value: "hashbrowser1234567890",
            __typename: "Property",
          },
          {
            key: "phone_number",
            value: "08123456789",
            __typename: "Property",
          },
          {
            key: "gift_card_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_transaction_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "bvn_number",
            value: "84930276514",
            __typename: "Property",
          },
          {
            key: "city",
            value: "Nassarawa",
            __typename: "Property",
          },
          {
            key: "transaction_amount",
            value: "5000.0",
            __typename: "Property",
          },
          {
            key: "receiver_location",
            value: {
              latitude: 8.6753,
              longitude: 3.365,
            },
            __typename: "Property",
          },
          {
            key: "cookie_hash",
            value: "cookiehash1234567890",
            __typename: "Property",
          },
          {
            key: "receiver_account_number",
            value: "9876543210",
            __typename: "Property",
          },
          {
            key: "device_hash",
            value: "devhash1234",
            __typename: "Property",
          },
          {
            key: "password_hash",
            value: "passwordhash1234567890",
            __typename: "Property",
          },
          {
            key: "bank_name",
            value: "UBA",
            __typename: "Property",
          },
          {
            key: "first_name",
            value: "Ifeanyi",
            __typename: "Property",
          },
          {
            key: "transaction_currency",
            value: "NGN",
            __typename: "Property",
          },
          {
            key: "email",
            value: "ifeanyi@example.com",
            __typename: "Property",
          },
          {
            key: "card_bin",
            value: "890123",
            __typename: "Property",
          },
          {
            key: "timestamp",
            value: "2024-01-21T21:45:00",
            __typename: "Property",
          },
          {
            key: "rule_score",
            value: "50.0",
            __typename: "Property",
          },
          {
            key: "bank_code",
            value: "058",
            __typename: "Property",
          },
          {
            key: "address",
            value: "15 Independence Road, Kano",
            __typename: "Property",
          },
          {
            key: "ai_score",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_currency",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transfer_session_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "sender_account_number",
            value: "5682934701",
            __typename: "Property",
          },
          {
            key: "last_name",
            value: "Nwosu",
            __typename: "Property",
          },
          {
            key: "ip_address",
            value: "44.33.235.107",
            __typename: "Property",
          },
          {
            key: "card_type",
            value: "VISA",
            __typename: "Property",
          },
          {
            key: "middle_name",
            value: "Chukwu",
            __typename: "Property",
          },
          {
            key: "device_os",
            value: "Android",
            __typename: "Property",
          },
          {
            key: "overall_score",
            value: "50.0",
            __typename: "Property",
          },
          {
            key: "wallet_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_balance_after",
            value: "None",
            __typename: "Property",
          },
          {
            key: "gift_card_balance_after",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transfer_type",
            value: "None",
            __typename: "Property",
          },
          {
            key: "gift_card_currency",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transaction_time_stamp",
            value: "2024-01-21T21:50:00.000000Z",
            __typename: "Property",
          },
          {
            key: "receiver_account_name",
            value: "Amara Obi",
            __typename: "Property",
          },
          {
            key: "username",
            value: "ifeanyi_n",
            __typename: "Property",
          },
        ],
        __typename: "TransactionType",
      },
      {
        id: "2",
        label: "n",
        properties: [],
        __typename: "TransactionType",
      },
      {
        id: "5",
        label: "p",
        properties: [
          {
            key: "country",
            value: "Nigeria",
            __typename: "Property",
          },
          {
            key: "card_hash",
            value: "4376",
            __typename: "Property",
          },
          {
            key: "cvv_result",
            value: "true",
            __typename: "Property",
          },
          {
            key: "gift_card_balance_before",
            value: "None",
            __typename: "Property",
          },
          {
            key: "birth_date",
            value: "1985-07-08",
            __typename: "Property",
          },
          {
            key: "wallet_balance_before",
            value: "None",
            __typename: "Property",
          },
          {
            key: "device_type",
            value: "Desktop",
            __typename: "Property",
          },
          {
            key: "gift_card_transaction_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "zip_code",
            value: "900211",
            __typename: "Property",
          },
          {
            key: "card_expiry",
            value: "09/27",
            __typename: "Property",
          },
          {
            key: "card_country",
            value: "Nigeria",
            __typename: "Property",
          },
          {
            key: "bank_id",
            value: "plutus-1740600641461",
            __typename: "Property",
          },
          {
            key: "destination_sortcode",
            value: "None",
            __typename: "Property",
          },
          {
            key: "sender_location",
            value: {
              name: "Ngozi Okonkwo",
              latitude: 6.423,
              longitude: 3.468,
            },
            __typename: "Property",
          },
          {
            key: "state",
            value: "Abuja",
            __typename: "Property",
          },
          {
            key: "payment_method",
            value: "Mobile Money",
            __typename: "Property",
          },
          {
            key: "sortcode_bank_location",
            value: "None",
            __typename: "Property",
          },
          {
            key: "card_fullname",
            value: "Ngozi Okonkwo",
            __typename: "Property",
          },
          {
            key: "transaction_id",
            value: "TXN95071",
            __typename: "Property",
          },
          {
            key: "sender_account_balance",
            value: "8500.25",
            __typename: "Property",
          },
          {
            key: "device_id",
            value: "c345d678-e901-234f-567g-890h12345678",
            __typename: "Property",
          },
          {
            key: "sender_account_name",
            value: "Ngozi Okonkwo",
            __typename: "Property",
          },
          {
            key: "receiver_bank_name",
            value: "UBA",
            __typename: "Property",
          },
          {
            key: "card_last4",
            value: "3456",
            __typename: "Property",
          },
          {
            key: "transaction_type",
            value: "Mobile Money Payment",
            __typename: "Property",
          },
          {
            key: "transaction_description",
            value: "Payment via mobile money.",
            __typename: "Property",
          },
          {
            key: "brand_id",
            value: "brand-11",
            __typename: "Property",
          },
          {
            key: "browser_name",
            value: "Safari",
            __typename: "Property",
          },
          {
            key: "receiver_bank_code",
            value: "058",
            __typename: "Property",
          },
          {
            key: "gift_card_provider",
            value: "None",
            __typename: "Property",
          },
          {
            key: "nationality",
            value: "Nigerian",
            __typename: "Property",
          },
          {
            key: "browser_hash",
            value: "hashbrowser0987654321",
            __typename: "Property",
          },
          {
            key: "phone_number",
            value: "07098765432",
            __typename: "Property",
          },
          {
            key: "gift_card_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_transaction_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "bvn_number",
            value: "73918264503",
            __typename: "Property",
          },
          {
            key: "city",
            value: "Garki",
            __typename: "Property",
          },
          {
            key: "transaction_amount",
            value: "7500.0",
            __typename: "Property",
          },
          {
            key: "receiver_location",
            value: {
              latitude: 6.423,
              longitude: 3.468,
            },
            __typename: "Property",
          },
          {
            key: "cookie_hash",
            value: "cookiehash0987654321",
            __typename: "Property",
          },
          {
            key: "receiver_account_number",
            value: "5682934701",
            __typename: "Property",
          },
          {
            key: "device_hash",
            value: "devhash0987",
            __typename: "Property",
          },
          {
            key: "password_hash",
            value: "passwordhash0987654321",
            __typename: "Property",
          },
          {
            key: "bank_name",
            value: "First Bank of Nigeria",
            __typename: "Property",
          },
          {
            key: "first_name",
            value: "Ngozi",
            __typename: "Property",
          },
          {
            key: "transaction_currency",
            value: "NGN",
            __typename: "Property",
          },
          {
            key: "email",
            value: "ngozi@example.com",
            __typename: "Property",
          },
          {
            key: "card_bin",
            value: "345678",
            __typename: "Property",
          },
          {
            key: "timestamp",
            value: "2024-01-21T21:30:00",
            __typename: "Property",
          },
          {
            key: "rule_score",
            value: "25.0",
            __typename: "Property",
          },
          {
            key: "bank_code",
            value: "063",
            __typename: "Property",
          },
          {
            key: "address",
            value: "5 Unity Road, Abuja, FCT",
            __typename: "Property",
          },
          {
            key: "ai_score",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_currency",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transfer_session_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "sender_account_number",
            value: "7693841205",
            __typename: "Property",
          },
          {
            key: "last_name",
            value: "Okonkwo",
            __typename: "Property",
          },
          {
            key: "ip_address",
            value: "43.33.235.106",
            __typename: "Property",
          },
          {
            key: "card_type",
            value: "MasterCard",
            __typename: "Property",
          },
          {
            key: "middle_name",
            value: "Chinwe",
            __typename: "Property",
          },
          {
            key: "device_os",
            value: "macOS",
            __typename: "Property",
          },
          {
            key: "overall_score",
            value: "25.0",
            __typename: "Property",
          },
          {
            key: "wallet_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_balance_after",
            value: "None",
            __typename: "Property",
          },
          {
            key: "gift_card_balance_after",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transfer_type",
            value: "None",
            __typename: "Property",
          },
          {
            key: "gift_card_currency",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transaction_time_stamp",
            value: "2024-01-21T21:35:00.000000Z",
            __typename: "Property",
          },
          {
            key: "receiver_account_name",
            value: "Ifeanyi Nwosu",
            __typename: "Property",
          },
          {
            key: "username",
            value: "ngozi_o",
            __typename: "Property",
          },
        ],
        __typename: "TransactionType",
      },
      {
        id: "8",
        label: "n",
        properties: [],
        __typename: "TransactionType",
      },
      {
        id: "d",
        label: "p",
        properties: [
          {
            key: "country",
            value: "Nigeria",
            __typename: "Property",
          },
          {
            key: "card_hash",
            value: "9189",
            __typename: "Property",
          },
          {
            key: "cvv_result",
            value: "true",
            __typename: "Property",
          },
          {
            key: "gift_card_balance_before",
            value: "None",
            __typename: "Property",
          },
          {
            key: "birth_date",
            value: "1980-09-20",
            __typename: "Property",
          },
          {
            key: "wallet_balance_before",
            value: "None",
            __typename: "Property",
          },
          {
            key: "device_type",
            value: "Mobile",
            __typename: "Property",
          },
          {
            key: "gift_card_transaction_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "zip_code",
            value: "500283",
            __typename: "Property",
          },
          {
            key: "card_expiry",
            value: "10/26",
            __typename: "Property",
          },
          {
            key: "card_country",
            value: "Nigeria",
            __typename: "Property",
          },
          {
            key: "bank_id",
            value: "plutus-1740600641460",
            __typename: "Property",
          },
          {
            key: "destination_sortcode",
            value: "None",
            __typename: "Property",
          },
          {
            key: "sender_location",
            value: {
              name: "Chinedu Eze",
              latitude: 9.082,
              longitude: 7.4913,
            },
            __typename: "Property",
          },
          {
            key: "state",
            value: "Rivers",
            __typename: "Property",
          },
          {
            key: "payment_method",
            value: "Debit Card",
            __typename: "Property",
          },
          {
            key: "sortcode_bank_location",
            value: "None",
            __typename: "Property",
          },
          {
            key: "card_fullname",
            value: "Chinedu Eze",
            __typename: "Property",
          },
          {
            key: "transaction_id",
            value: "TXN95070",
            __typename: "Property",
          },
          {
            key: "sender_account_balance",
            value: "11000.75",
            __typename: "Property",
          },
          {
            key: "device_id",
            value: "b234c567-d890-123e-456f-789g01234567",
            __typename: "Property",
          },
          {
            key: "sender_account_name",
            value: "Chinedu Eze",
            __typename: "Property",
          },
          {
            key: "receiver_bank_name",
            value: "First Bank of Nigeria",
            __typename: "Property",
          },
          {
            key: "card_last4",
            value: "9012",
            __typename: "Property",
          },
          {
            key: "transaction_type",
            value: "Debit Card Payment",
            __typename: "Property",
          },
          {
            key: "transaction_description",
            value: "Payment via debit card.",
            __typename: "Property",
          },
          {
            key: "brand_id",
            value: "brand-10",
            __typename: "Property",
          },
          {
            key: "browser_name",
            value: "Firefox",
            __typename: "Property",
          },
          {
            key: "receiver_bank_code",
            value: "063",
            __typename: "Property",
          },
          {
            key: "gift_card_provider",
            value: "None",
            __typename: "Property",
          },
          {
            key: "nationality",
            value: "Nigerian",
            __typename: "Property",
          },
          {
            key: "browser_hash",
            value: "fedcba0987654321fedcba0987654321",
            __typename: "Property",
          },
          {
            key: "phone_number",
            value: "08087654321",
            __typename: "Property",
          },
          {
            key: "gift_card_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_transaction_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "bvn_number",
            value: "62839415702",
            __typename: "Property",
          },
          {
            key: "city",
            value: "Port Harcourt",
            __typename: "Property",
          },
          {
            key: "transaction_amount",
            value: "9000.0",
            __typename: "Property",
          },
          {
            key: "receiver_location",
            value: {
              latitude: 9.082,
              longitude: 7.4913,
            },
            __typename: "Property",
          },
          {
            key: "cookie_hash",
            value: "cookiehash987654321",
            __typename: "Property",
          },
          {
            key: "receiver_account_number",
            value: "7693841205",
            __typename: "Property",
          },
          {
            key: "device_hash",
            value: "devicehash5678",
            __typename: "Property",
          },
          {
            key: "password_hash",
            value: "1234abcd5678efgh9012ijkl3456mnop",
            __typename: "Property",
          },
          {
            key: "bank_name",
            value: "GTBank",
            __typename: "Property",
          },
          {
            key: "first_name",
            value: "Chinedu",
            __typename: "Property",
          },
          {
            key: "transaction_currency",
            value: "NGN",
            __typename: "Property",
          },
          {
            key: "email",
            value: "chinedu@example.com",
            __typename: "Property",
          },
          {
            key: "card_bin",
            value: "789012",
            __typename: "Property",
          },
          {
            key: "timestamp",
            value: "2024-01-21T21:15:00",
            __typename: "Property",
          },
          {
            key: "rule_score",
            value: "25.0",
            __typename: "Property",
          },
          {
            key: "bank_code",
            value: "058",
            __typename: "Property",
          },
          {
            key: "address",
            value: "22 Oil Road, Port Harcourt, Rivers",
            __typename: "Property",
          },
          {
            key: "ai_score",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_currency",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transfer_session_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "sender_account_number",
            value: "8532097641",
            __typename: "Property",
          },
          {
            key: "last_name",
            value: "Eze",
            __typename: "Property",
          },
          {
            key: "ip_address",
            value: "42.33.235.105",
            __typename: "Property",
          },
          {
            key: "card_type",
            value: "VISA",
            __typename: "Property",
          },
          {
            key: "middle_name",
            value: "Emeka",
            __typename: "Property",
          },
          {
            key: "device_os",
            value: "Android",
            __typename: "Property",
          },
          {
            key: "overall_score",
            value: "25.0",
            __typename: "Property",
          },
          {
            key: "wallet_id",
            value: "None",
            __typename: "Property",
          },
          {
            key: "wallet_balance_after",
            value: "None",
            __typename: "Property",
          },
          {
            key: "gift_card_balance_after",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transfer_type",
            value: "None",
            __typename: "Property",
          },
          {
            key: "gift_card_currency",
            value: "None",
            __typename: "Property",
          },
          {
            key: "transaction_time_stamp",
            value: "2024-01-21T21:20:00.000000Z",
            __typename: "Property",
          },
          {
            key: "receiver_account_name",
            value: "Ngozi Okonkwo",
            __typename: "Property",
          },
          {
            key: "username",
            value: "chinedu_e",
            __typename: "Property",
          },
        ],
        __typename: "TransactionType",
      },
      
    ],
  },
  loading: false,
  networkStatus: 7,
};

enum TransactionStatus {
  COMPLETED = "completed",
  ACTION = "action-required",
}

enum BankName {
  GTBank = "GTBank",
  FirstBank = "First Bank of Nigeria",
  UBA = "UBA",
  WEMA = "WEMA"
}

export const getTransactionFlow = (): Transaction[] => makeArrayData(() => ({
  bank_code: faker.string.numeric({ length: 3 }),
  description: faker.finance.transactionDescription(),
  queue_number: faker.lorem.lines(),
  receiver_account:  faker.finance.accountNumber({ length: 10 }),
  receiver_bank: faker.helpers.enumValue(BankName),
  receiver_bank_code: faker.string.numeric({ length: 3 }),
  receiver_name: faker.person.fullName(),
  recipient_bank_code: faker.string.numeric({ length: 3 }),
  sender_account: faker.finance.accountNumber({ length: 10 }),
  sender_bank: faker.helpers.enumValue(BankName),
  sender_bank_code: faker.string.numeric({ length: 3 }),
  sender_name:  faker.person.fullName(),
  tracking_id: faker.string.uuid(),
  amount: faker.number.int({ min: 1000, max: 10000 }),
  transaction_id: faker.string.uuid(),
  transaction_type: faker.helpers.enumValue(TransactionStatus),
  parent_tracking_id: faker.string.uuid(),
  recipient: faker.person.fullName(),
  timestamp: faker.date.anytime().toISOString(),
  transaction_amount: faker.number.int({ min: 1000, max: 10000 }),
  transaction_time: faker.date.anytime(),
  report_type: faker.helpers.enumValue(TransactionStatus),
})) 

export const getTransactions = (): TransactionItem[] => makeArrayData(() => ({
  created_at: faker.date.anytime(),
  id: faker.string.uuid(),
  root_transaction_id: faker.string.uuid(),
  status: faker.helpers.enumValue(TransactionStatus),
  total_amount: faker.number.int({ min: 1000, max: 10000 }),
  total_transactions: faker.number.int({ min: 1, max: 10 }), 
}))

export const getTransactionDetail = (): TransactionDetails => {
  return {
    created_at: faker.date.anytime(),
    root_transaction_id: faker.string.uuid(),
    id: faker.string.uuid(),
    status: faker.helpers.enumValue(TransactionStatus),
    total_amount: faker.number.int({ min: 1000, max: 10000 }),
    total_transactions: faker.number.int({ min: 1, max: 10 }),
    transactions: getTransactionFlow(),
    updated_at: faker.date.anytime(),
  }
}