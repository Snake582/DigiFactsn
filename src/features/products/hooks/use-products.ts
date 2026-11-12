"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type { Product } from "@/types/product.types";
import { productService } from "../services/product.service";

export function useProducts() {
  const [products, , ready] = useLocalStorage<Product[]>(STORAGE_KEYS.products, []);
  return { products, ready, service: productService };
}
