import type { BaseEntity } from "./common.types";

export type ProductType = "produit" | "service";

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  unit: string;
  type: ProductType;
}

export type ProductInput = Omit<Product, keyof BaseEntity>;
