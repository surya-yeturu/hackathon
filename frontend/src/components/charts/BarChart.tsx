import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    completed: number;
    inProgress: number;
    open: number;
  }>;
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Legend
            formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
          />
          <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
          <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="In Progress" />
          <Bar dataKey="open" stackId="a" fill="#a855f7" name="Open" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

