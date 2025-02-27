import { faker } from '@faker-js/faker';

const TRANSACTION_TYPES = ['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT'];
const PAYMENT_METHODS = ['CARD', 'BANK_TRANSFER', 'WALLET', 'GIFT_CARD'];
const TRANSFER_TYPES = ['LOCAL', 'INTERNATIONAL', 'SAME_BANK', 'INTER_BANK'];
const CARD_TYPES = ['VISA', 'MASTERCARD', 'VERVE', 'AMEX'];
const CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'];

export const generateMockTransaction = () => {
  const transactionType = faker.helpers.arrayElement(TRANSACTION_TYPES);
  const paymentMethod = faker.helpers.arrayElement(PAYMENT_METHODS);
  const currency = faker.helpers.arrayElement(CURRENCIES);
  const amount = faker.number.float({ min: 100, max: 1000000, precision: 0.01 });
  
  return {
    fintech_id: faker.string.uuid(),
    country: faker.location.country(),
    timestamp: faker.date.recent().toISOString(),
    sender_account_number: faker.finance.accountNumber(),
    sender_account_name: faker.person.fullName(),
    sender_account_balance: faker.number.float({ min: 1000, max: 10000000, precision: 0.01 }),
    bvn_number: faker.string.numeric(11),
    bank_name: faker.company.name(),
    bank_code: faker.string.numeric(3),
    state: faker.location.state(),
    city: faker.location.city(),
    zip_code: faker.location.zipCode(),
    address: faker.location.streetAddress(),
    card_fullname: faker.person.fullName(),
    card_hash: faker.string.alphanumeric(32),
    card_country: faker.location.country(),
    card_last4: faker.string.numeric(4),
    card_expiry: faker.date.future().toISOString().split('T')[0],
    card_type: faker.helpers.arrayElement(CARD_TYPES),
    card_bin: faker.string.numeric(6),
    cvv_result: faker.helpers.arrayElement(['MATCH', 'NO_MATCH', 'NOT_PROCESSED']),
    username: faker.internet.userName(),
    nationality: faker.location.country(),
    email: faker.internet.email(),
    phone_number: faker.phone.number(),
    birth_date: faker.date.past().toISOString().split('T')[0],
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    middle_name: faker.person.middleName(),
    device_id: faker.string.uuid(),
    ip_address: faker.internet.ip(),
    browser_hash: faker.string.alphanumeric(32),
    password_hash: faker.string.alphanumeric(64),
    device_type: faker.helpers.arrayElement(['MOBILE', 'DESKTOP', 'TABLET']),
    device_hash: faker.string.alphanumeric(32),
    device_os: faker.helpers.arrayElement(['iOS', 'Android', 'Windows', 'macOS', 'Linux']),
    browser_name: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
    brand_id: faker.string.uuid(),
    cookie_hash: faker.string.alphanumeric(32),
    transaction_amount: amount,
    transaction_or_session_id: faker.string.uuid(),
    transaction_type: transactionType,
    transaction_currency: currency,
    transaction_description: faker.lorem.sentence(),
    payment_method: paymentMethod,
    receiver_location: `${faker.location.city()}, ${faker.location.country()}`,
    sender_location: `${faker.location.city()}, ${faker.location.country()}`,
    destination_sortcode: faker.string.numeric(6),
    sortcode_bank_location: faker.location.city(),
    transfer_type: faker.helpers.arrayElement(TRANSFER_TYPES),
    transfer_session_id: faker.string.uuid(),
    receiver_bank_account: faker.finance.accountNumber(),
    receiver_bank_name: faker.company.name(),
    receiver_name: faker.person.fullName(),
    transaction_time_stamp: faker.date.recent().toISOString(),
    wallet_id: faker.string.uuid(),
    wallet_balance_before: faker.number.float({ min: 1000, max: 10000000, precision: 0.01 }),
    wallet_balance_after: faker.number.float({ min: 1000, max: 10000000, precision: 0.01 }),
    wallet_currency: currency,
    wallet_transaction_id: faker.string.uuid(),
    gift_card_id: paymentMethod === 'GIFT_CARD' ? faker.string.uuid() : null,
    gift_card_provider: paymentMethod === 'GIFT_CARD' ? faker.company.name() : null,
    gift_card_currency: paymentMethod === 'GIFT_CARD' ? currency : null,
    gift_card_transaction_id: paymentMethod === 'GIFT_CARD' ? faker.string.uuid() : null,
  };
};

// Generate an array of mock transactions
export const generateMockTransactions = (count: number = 10) => {
  return Array.from({ length: count }, generateMockTransaction);
};