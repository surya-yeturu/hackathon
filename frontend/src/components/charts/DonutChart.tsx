import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  total?: number;
}

export default function DonutChart({ data, title, total }: DonutChartProps) {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: '#94a3b8' }}>
                {value}: {entry.payload.value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {total && (
        <div className="text-center mt-4">
          <span className="text-2xl font-bold text-dark-text">{total}</span>
          <span className="text-dark-muted ml-2">total tasks</span>
        </div>
      )}
    </div>
  );
}

