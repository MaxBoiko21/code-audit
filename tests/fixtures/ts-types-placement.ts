// good — flat local types in runtime file
type Cursor = {
  id: string;
  createdAt: Date;
  limit: number;
};

type Status = 'active' | 'paused';

type UserSummary = {
  id: string;
  email: string;
  roles: string[];
};

// bad — nested object in local type
type Invoice = {
  customer: { id: string; email: string };
  amount: number;
};

// bad — local type ref creates a hop
type Address = { street: string; city: string };
type Customer = {
  name: string;
  address: Address;
};

// bad — array of object
type OrderItem = {
  items: { sku: string; qty: number }[];
};

// good — inline 2 props, both scalar
export function getRange(_r: { start: number; end: number }): number {
  return 1;
}

// bad — inline > 3 props
export function createUser(_data: { email: string; name: string; age: number; role: string }): void {}

// bad — nested inline
export function createInvoice(_data: {
  customer: { id: string; email: string };
  amount: number;
}): void {}

// bad — duplicate inline literal
export function a(_x: { foo: string; bar: number }): void {}
export function b(_y: { foo: string; bar: number }): void {}
