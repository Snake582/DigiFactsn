import type { BaseEntity } from "./common.types";

export interface Client extends BaseEntity {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export type ClientInput = Omit<Client, keyof BaseEntity>;
