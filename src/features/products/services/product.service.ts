import type { Product } from "@/types/product.types";
import { createRepository } from "@/lib/storage/storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";

export const productService = createRepository<Product>(STORAGE_KEYS.products);
