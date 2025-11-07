import { useEffect, useState } from 'react';
import { DashboardData } from '../types';
import { wsService } from '../services/websocket';
import KPICard from '../components/KPICard';
import DonutChart from '../components/charts/DonutChart';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';

const API_URL = 'http://localhost:8080/api';

// Default empty data structure
const defaultData: DashboardData = {
  kpis: {
    openTasks: { label: 'Open Tasks', value: 0, trend: 0, trendDirection: 'up' },
    inProgress: { label: 'In Progress', value: 0, trend: 0, trendDirection: 'up' },
    closedToday: { label: 'Closed Today', value: 0, trend: 0, trendDirection: 'up' },
    closedThisHour: { label: 'Closed This Hour', value: 0, trend: 0, trendDirection: 'up' },
    completionRate: { label: 'Completion Rate', value: 0, trend: 0, trendDirection: 'up' },
  },
  taskDistribution: [],
  trendData: [],
  teamPerformance: [],
  projects: [],
};

export default function Overview() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/metrics`);
      if (response.ok) {
        const metrics = await response.json();
        setData(metrics);
      } else {
        console.error('Failed to fetch metrics');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchMetrics();

    // Listen for WebSocket updates
    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'metrics_update') {
        setData(message.data);
      }
    });

    return unsubscribe;
  }, []);

  const taskDistributionData = data.taskDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    color: item.color,
  }));

  const totalTasks = data.taskDistribution.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">Overview</h2>
          <p className="text-dark-muted">Real-time view of your team's productivity metrics</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-dark-muted">Loading metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (totalTasks === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">Overview</h2>
          <p className="text-dark-muted">Real-time view of your team's productivity metrics</p>
        </div>
        <div className="bg-dark-card rounded-lg p-12 border border-dark-border text-center">
          <p className="text-dark-muted mb-4">No data available yet.</p>
          <p className="text-sm text-dark-muted">
            Upload a CSV file to import tasks and see metrics here.
          </p>
        </div>
      </div>
    );
  }

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
          title={`Task Distribution (${totalTasks})`}
          total={totalTasks}
        />
        {data.trendData && data.trendData.length > 0 ? (
          <LineChart data={data.trendData} title="7-Day Trend Analysis" />
        ) : (
          <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
            <h3 className="text-lg font-semibold text-dark-text mb-4">7-Day Trend Analysis</h3>
            <p className="text-dark-muted text-center py-8">Not enough data for trend analysis</p>
          </div>
        )}
      </div>

      {/* Team Performance */}
      {data.teamPerformance && data.teamPerformance.length > 0 ? (
        <BarChart data={data.teamPerformance} title="Team Performance" />
      ) : (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Team Performance</h3>
          <p className="text-dark-muted text-center py-8">No team performance data available</p>
        </div>
      )}
    </div>
  );
}

