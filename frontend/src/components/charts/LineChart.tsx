import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{
    date: string;
    completed: number;
    created: number;
    inProgress: number;
  }>;
  title: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
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
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={2}
            name="Tasks Completed"
            dot={{ fill: '#10b981', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="created"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Tasks Created"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="inProgress"
            stroke="#a855f7"
            strokeWidth={2}
            name="Tasks in Progress"
            dot={{ fill: '#a855f7', r: 4 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-dark-muted">Avg. Daily Completion: </span>
          <span className="text-dark-text font-semibold">
            {(data.reduce((sum, d) => sum + d.completed, 0) / data.length).toFixed(1)} tasks
          </span>
        </div>
        <div>
          <span className="text-dark-muted">Avg. Daily Creation: </span>
          <span className="text-dark-text font-semibold">
            {(data.reduce((sum, d) => sum + d.created, 0) / data.length).toFixed(1)} tasks
          </span>
        </div>
        <div>
          <span className="text-dark-muted">Avg. In Progress: </span>
          <span className="text-dark-text font-semibold">
            {(data.reduce((sum, d) => sum + d.inProgress, 0) / data.length).toFixed(1)} tasks
          </span>
        </div>
      </div>
    </div>
  );
}

