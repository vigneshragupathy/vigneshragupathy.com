import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';

export interface ScoreItem { name: string; value: number; detail?: string; highlight?: boolean }
interface Props { items: ScoreItem[]; title: string; note?: string; max?: number; decimals?: number }

/** Horizontal bars for a handful of scores on the same scale (0–1 by default). Keeps the given order; one hue, highlights dimmed out. */
export default function ScoreBars({ items, title, note, max = 1, decimals = 2 }: Props) {
  const fmt = (n: number) => n.toFixed(decimals);
  const rowH = 30;
  return (
    <figure className="chart">
      <figcaption>
        <strong>{title}</strong>
        {note && <span className="chart-sub">{note}</span>}
      </figcaption>
      <div style={{ width: '100%', height: items.length * rowH + 16 }}>
        <ResponsiveContainer>
          <BarChart data={items} layout="vertical" margin={{ top: 4, right: 56, bottom: 4, left: 4 }} barCategoryGap={6}>
            <XAxis type="number" hide domain={[0, max]} />
            <YAxis type="category" dataKey="name" width={118} tickLine={false} axisLine={false}
              tick={{ fill: 'var(--fg)', fontSize: 13, fontFamily: 'inherit' }} />
            <Tooltip cursor={{ fill: 'var(--code-bg)' }} content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as ScoreItem;
              return (
                <div className="chart-tip">
                  <strong>{d.name}</strong>
                  {d.detail && <div className="chart-tip-detail">{d.detail}</div>}
                  <div>{fmt(d.value)}</div>
                </div>
              );
            }} />
            <Bar dataKey="value" maxBarSize={22} radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {items.map((d) => <Cell key={d.name} fill="var(--accent)" fillOpacity={d.highlight === false ? 0.45 : 1} />)}
              <LabelList dataKey="value" position="right" offset={8} formatter={(v: number) => fmt(v)}
                style={{ fill: 'var(--fg)', fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead><tr><th>Mode</th><th>Score</th></tr></thead>
        <tbody>{items.map((d) => <tr key={d.name}><td>{d.name}</td><td>{fmt(d.value)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
