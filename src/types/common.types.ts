export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type FieldErrors = Record<string, string>;
