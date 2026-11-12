const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** Espaces insécables remplacés par des espaces simples (compatibles avec les PDF). */
export function formatNumber(value: number) {
  return formatter.format(value).replace(/[\u202f\u00a0]/g, " ");
}

export function formatCurrency(value: number, currency = "FCFA") {
  return `${formatNumber(value)} ${currency}`;
}
