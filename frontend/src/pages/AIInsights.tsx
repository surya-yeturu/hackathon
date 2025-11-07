import { useEffect, useState } from 'react';
import { Bot, TrendingUp, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { DashboardData } from '../types';
import { mockDashboardData } from '../services/mockData';
import { wsService } from '../services/websocket';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AIInsights() {
  const [data, setData] = useState<DashboardData>(mockDashboardData);

  useEffect(() => {
    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'ai_insight') {
        setData((prev) => ({ ...prev, ...message.data }));
      }
    });

    return unsubscribe;
  }, []);

  const benchmarkTrendData = [
    { date: 'Week 1', 'Alpha Team': 45, 'Beta Team': 35, 'Gamma Team': 38, 'Your Team': 42 },
    { date: 'Week 2', 'Alpha Team': 50, 'Beta Team': 38, 'Gamma Team': 40, 'Your Team': 45 },
    { date: 'Week 3', 'Alpha Team': 55, 'Beta Team': 39, 'Gamma Team': 42, 'Your Team': 48 },
    { date: 'Week 4', 'Alpha Team': 58, 'Beta Team': 42, 'Gamma Team': 45, 'Your Team': 49 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">AI Insights</h2>
        <p className="text-dark-muted">AI-powered analytics and predictive insights</p>
      </div>

      {/* AI-Powered Summary */}
      {data.aiSummary && (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text">AI-Powered Summary</h3>
          </div>
          <p className="text-dark-text mb-4">{data.aiSummary.summary}</p>
          {data.aiSummary.alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-400">{alert}</p>
            </div>
          ))}
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h4 className="text-sm font-semibold text-dark-muted">Task Closure Performance</h4>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-dark-muted">Current Avg</span>
              <p className="text-xl font-bold text-dark-text">30.1h</p>
            </div>
            <div>
              <span className="text-xs text-dark-muted">Previous Avg</span>
              <p className="text-lg text-dark-text">25.6h</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h4 className="text-sm font-semibold text-dark-muted">Blocked Tasks Alert</h4>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-dark-muted">Blocked Tasks</span>
              <p className="text-xl font-bold text-dark-text">15</p>
            </div>
            <div>
              <span className="text-xs text-dark-muted">% of Total</span>
              <p className="text-lg text-dark-text">30.0%</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <h4 className="text-sm font-semibold text-dark-muted">Due Date Compliance</h4>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-dark-muted">Overdue</span>
              <p className="text-xl font-bold text-red-500">14</p>
            </div>
            <div>
              <span className="text-xs text-dark-muted">On Time</span>
              <p className="text-lg text-green-500">23</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h4 className="text-sm font-semibold text-dark-muted">In Progress Status</h4>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-dark-muted">Active Tasks</span>
              <p className="text-xl font-bold text-dark-text">13</p>
            </div>
            <div>
              <span className="text-xs text-dark-muted">Avg Active Time</span>
              <p className="text-lg text-dark-text">159.2h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Performance Analysis */}
      {data.predictiveMetrics && (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-dark-text">Predictive Performance Analysis</h3>
              <p className="text-sm text-dark-muted">Based on historical data patterns and current velocity</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-muted">Projected Sprint Completion</span>
                <span className="text-lg font-bold text-dark-text">{data.predictiveMetrics.sprintCompletion}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${data.predictiveMetrics.sprintCompletion}%` }}
                />
              </div>
            </div>
            <div>
              <span className="text-sm text-dark-muted block mb-2">Next Week Workload</span>
              <p className="text-2xl font-bold text-dark-text mb-1">{data.predictiveMetrics.nextWeekWorkload}</p>
              <p className="text-sm text-dark-muted">~{data.predictiveMetrics.workloadTasks} tasks expected</p>
            </div>
            <div>
              <span className="text-sm text-dark-muted block mb-2">Risk Level</span>
              <p className="text-2xl font-bold text-green-500 mb-1">{data.predictiveMetrics.riskLevel}</p>
              <p className="text-sm text-dark-muted">{data.predictiveMetrics.riskMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Team Benchmarking */}
      {data.benchmarking && (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-dark-text mb-2">Team Benchmarking</h3>
            <p className="text-sm text-dark-muted">AI-powered comparison across teams</p>
          </div>
          <div className="mb-6 bg-dark-bg rounded-lg p-6 border border-dark-border">
            <h3 className="text-lg font-semibold text-dark-text mb-4">4-Week Productivity Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={benchmarkTrendData}>
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
                  dataKey="Your Team"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Alpha Team"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: '#a855f7', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Beta Team"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Gamma Team"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.benchmarking.map((team, index) => (
              <div key={index} className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                <h4 className="font-semibold text-dark-text mb-4">{team.team}</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-dark-muted">Total Tasks</span>
                    <p className="text-lg font-bold text-dark-text">{team.totalTasks}</p>
                  </div>
                  <div>
                    <span className="text-xs text-dark-muted">Velocity</span>
                    <p className="text-lg font-bold text-dark-text">{team.velocity}</p>
                  </div>
                  <div>
                    <span className="text-xs text-dark-muted">Efficiency</span>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-dark-text">{team.efficiency}%</p>
                      {team.efficiencyTrend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-dark-muted">Rank</span>
                    <p className="text-lg font-bold text-dark-text">#{team.rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmarking Insights */}
      {data.benchmarking && (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-dark-text">Benchmarking Insights</h3>
          </div>
          <p className="text-dark-text">
            Your team ranks #{data.benchmarking[0].rank} with 8 tasks behind Alpha Team. Velocity increased 22% over 4
            weeks, outpacing Beta (+16%) and Gamma (+29%).
          </p>
          <p className="text-dark-text mt-2">Focus on efficiency improvements to reach #1 position.</p>
        </div>
      )}

      {/* Team Communication Sentiment */}
      {data.sentiment && (
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-dark-text mb-2">Team Communication Sentiment</h3>
            <p className="text-sm text-dark-muted">Analyzed from commit messages and task comments</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-muted">Positive</span>
                <span className="text-sm font-semibold text-dark-text">{data.sentiment.positive}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ width: `${data.sentiment.positive}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-muted">Neutral</span>
                <span className="text-sm font-semibold text-dark-text">{data.sentiment.neutral}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${data.sentiment.neutral}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-muted">Negative</span>
                <span className="text-sm font-semibold text-dark-text">{data.sentiment.negative}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all"
                  style={{ width: `${data.sentiment.negative}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">
              Team morale appears positive. Keep up the good work and maintain open communication.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

