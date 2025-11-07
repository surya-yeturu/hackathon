import { useEffect, useState } from 'react';
import { DashboardData } from '../types';
import { mockDashboardData } from '../services/mockData';
import { wsService } from '../services/websocket';
import KPICard from '../components/KPICard';
import DonutChart from '../components/charts/DonutChart';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';

export default function Overview() {
  const [data, setData] = useState<DashboardData>(mockDashboardData);

  useEffect(() => {
    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'metrics_update') {
        setData((prev) => ({ ...prev, ...message.data }));
      }
    });

    return unsubscribe;
  }, []);

  const taskDistributionData = data.taskDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    color: item.color,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">Overview</h2>
        <p className="text-dark-muted">Real-time view of your team's productivity metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard metric={data.kpis.openTasks} />
        <KPICard metric={data.kpis.inProgress} />
        <KPICard metric={data.kpis.closedToday} />
        <KPICard metric={data.kpis.closedThisHour} />
        <KPICard metric={data.kpis.completionRate} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart
          data={taskDistributionData}
          title="Task Distribution (100)"
          total={data.taskDistribution.reduce((sum, item) => sum + item.count, 0)}
        />
        <LineChart data={data.trendData} title="7-Day Trend Analysis" />
      </div>

      {/* Team Performance */}
      <BarChart data={data.teamPerformance} title="Team Performance" />
    </div>
  );
}

