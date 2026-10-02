import { useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const parts = [
  { name: 'GPU', cost: 52000 },
  { name: 'CPU', cost: 28000 },
  { name: 'Motherboard', cost: 14000 },
  { name: 'RAM', cost: 9000 },
  { name: 'SSD', cost: 7000 },
  { name: 'PSU', cost: 6500 },
  { name: 'Case', cost: 5500 },
  { name: 'Cooler', cost: 3500 },
];
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#64748b'];
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function PcBuildChart() {
  const [view, setView] = useState<'bar' | 'pie'>('bar');
  const total = parts.reduce((s, p) => s + p.cost, 0);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16, margin: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong>Build cost breakdown · {inr(total)}</strong>
        <span>
          {(['bar', 'pie'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                marginLeft: 6, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                border: '1px solid var(--border)',
                background: view === v ? 'var(--accent)' : 'transparent',
                color: view === v ? 'var(--accent-fg)' : 'var(--fg)',
              }}
            >
              {v}
            </button>
          ))}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {view === 'bar' ? (
          <BarChart data={parts} margin={{ left: 8, right: 8 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={55} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} width={40} />
            <Tooltip formatter={(v) => inr(Number(v))} />
            <Bar dataKey="cost" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {parts.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie data={parts} dataKey="cost" nameKey="name" outerRadius={100} label={(p) => p.name} isAnimationActive={false}>
              {parts.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v) => inr(Number(v))} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
