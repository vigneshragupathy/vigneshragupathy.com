import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';

export interface CostItem { name: string; cost: number; detail?: string }
interface Props { items: CostItem[]; title: string; note?: string; currency?: string }

const fmt = (n: number, c = '₹') => `${c}${n.toLocaleString('en-IN')}`;

/** Horizontal bar chart for a cost breakdown. One hue, sorted high to low, values labelled at the bar end. */
export default function CostChart({ items, title, note, currency = '₹' }: Props) {
  const data = [...items].sort((a, b) => b.cost - a.cost);
  const total = data.reduce((s, d) => s + d.cost, 0);
  const rowH = 30;
  return (
    <figure className="chart">
      <figcaption>
        <strong>{title}</strong>
        <span className="chart-sub">Total {fmt(total, currency)}{note ? ` · ${note}` : ''}</span>
      </figcaption>
      <div style={{ width: '100%', height: data.length * rowH + 16 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 72, bottom: 4, left: 4 }} barCategoryGap={6}>
            <XAxis type="number" hide domain={[0, (m: number) => m * 1.02]} />
            <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false}
              tick={{ fill: 'var(--fg)', fontSize: 13, fontFamily: 'inherit' }} />
            <Tooltip cursor={{ fill: 'var(--code-bg)' }} content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as CostItem;
              return (
                <div className="chart-tip">
                  <strong>{d.name}</strong>
                  {d.detail && <div className="chart-tip-detail">{d.detail}</div>}
                  <div>{fmt(d.cost, currency)} · {Math.round((d.cost / total) * 100)}%</div>
                </div>
              );
            }} />
            <Bar dataKey="cost" maxBarSize={22} radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {data.map((d) => <Cell key={d.name} fill="var(--accent)" />)}
              <LabelList dataKey="cost" position="right" offset={8}
                formatter={(v: number) => fmt(v, currency)}
                style={{ fill: 'var(--fg)', fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead><tr><th>Part</th><th>Cost</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.name}><td>{d.name}</td><td>{fmt(d.cost, currency)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
