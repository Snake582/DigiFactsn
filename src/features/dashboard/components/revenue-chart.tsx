import { formatCurrency } from "@/lib/utils/format-currency";

interface Point { label: string; value: number }

/** Courbe SVG simple (aucune dépendance de graphique). */
export function RevenueChart({ data, currency }: { data: Point[]; currency: string }) {
  const W = 600, H = 220, padX = 36, padTop = 16, padBottom = 28;
  const max = Math.max(...data.map((d) => d.value), 1);
  const niceMax = Math.pow(10, Math.floor(Math.log10(max))) * Math.ceil(max / Math.pow(10, Math.floor(Math.log10(max))));
  const x = (i: number) => padX + (i * (W - padX * 2)) / Math.max(data.length - 1, 1);
  const y = (v: number) => padTop + (1 - v / niceMax) * (H - padTop - padBottom);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - padBottom} L${x(0)},${H - padBottom} Z`;
  const ticks = [0, 0.5, 1].map((t) => t * niceMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Évolution du chiffre d'affaires sur 6 mois">
      <defs>
        <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1553f5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1553f5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray="4 4" />
          <text x={padX - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {t >= 1_000_000 ? `${+(t / 1_000_000).toFixed(1)} M` : t >= 1000 ? `${Math.round(t / 1000)} k` : t}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#rev-fill)" />
      <path d={line} fill="none" stroke="#1553f5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.label + i}>
          <circle cx={x(i)} cy={y(d.value)} r="4" fill="#fff" stroke="#1553f5" strokeWidth="2.5">
            <title>{`${d.label} : ${formatCurrency(d.value, currency)}`}</title>
          </circle>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}
