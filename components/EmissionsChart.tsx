"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function EmissionsChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
        <YAxis className="text-xs fill-muted-foreground" />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          itemStyle={{ color: 'var(--card-foreground)' }}
        />
        <Line type="monotone" dataKey="co2" className="stroke-primary" strokeWidth={3} dot={{ fill: 'var(--primary)' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
