import { useEffect, useState } from 'react';
import { Bot, TrendingUp, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { wsService } from '../services/websocket';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:8080/api';

interface AIInsightsData {
  aiSummary?: {
    summary: string;
    alerts: string[];
    timestamp: string;
  };
  predictiveMetrics?: {
    sprintCompletion: number;
    nextWeekWorkload: string;
    workloadTasks: number;
    riskLevel: string;
    riskMessage: string;
    avgClosureTime: number;
  };
  sentiment?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  performanceMetrics?: {
    taskClosure: {
      currentAvg: number;
      previousAvg: number;
    };
    blockedTasks: {
      count: number;
      percentage: number;
    };
    dueDateCompliance: {
      overdue: number;
      onTime: number;
    };
    inProgress: {
      activeTasks: number;
      avgActiveTime: number;
    };
  };
}

export default function AIInsights() {
  const [data, setData] = useState<AIInsightsData>({});
  const [loading, setLoading] = useState(true);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ai/insights`);
      if (response.ok) {
        const insights = await response.json();
        setData(insights);
      } else {
        console.error('Failed to fetch AI insights');
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchAIInsights();

    // Listen for WebSocket updates
    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'ai_insight') {
        setData((prev) => ({ ...prev, ...message.data }));
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">AI Insights</h2>
          <p className="text-dark-muted">AI-powered analytics and predictive insights</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-dark-muted">Loading AI insights...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any data
  const hasData = data.aiSummary || data.predictiveMetrics || data.sentiment || data.performanceMetrics;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">AI Insights</h2>
          <p className="text-dark-muted">AI-powered analytics and predictive insights</p>
        </div>
        <div className="bg-dark-card rounded-lg p-12 border border-dark-border text-center">
          <p className="text-dark-muted mb-4">No AI insights available yet.</p>
          <p className="text-sm text-dark-muted">
            Upload tasks via CSV or sync from GitHub to generate AI-powered insights.
          </p>
        </div>
      </div>
    );
  }

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
      {data.performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="text-sm font-semibold text-dark-muted">Task Closure Performance</h4>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-dark-muted">Current Avg</span>
                <p className="text-xl font-bold text-dark-text">{data.performanceMetrics.taskClosure.currentAvg}h</p>
              </div>
              <div>
                <span className="text-xs text-dark-muted">Previous Avg</span>
                <p className="text-lg text-dark-text">{data.performanceMetrics.taskClosure.previousAvg}h</p>
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
                <p className="text-xl font-bold text-dark-text">{data.performanceMetrics.blockedTasks.count}</p>
              </div>
              <div>
                <span className="text-xs text-dark-muted">% of Total</span>
                <p className="text-lg text-dark-text">{data.performanceMetrics.blockedTasks.percentage}%</p>
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
                <p className="text-xl font-bold text-red-500">{data.performanceMetrics.dueDateCompliance.overdue}</p>
              </div>
              <div>
                <span className="text-xs text-dark-muted">On Time</span>
                <p className="text-lg text-green-500">{data.performanceMetrics.dueDateCompliance.onTime}</p>
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
                <p className="text-xl font-bold text-dark-text">{data.performanceMetrics.inProgress.activeTasks}</p>
              </div>
              <div>
                <span className="text-xs text-dark-muted">Avg Active Time</span>
                <p className="text-lg text-dark-text">{data.performanceMetrics.inProgress.avgActiveTime}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {data.sentiment.positive >= 70 
                ? 'Team morale appears positive. Keep up the good work and maintain open communication.'
                : data.sentiment.positive >= 50
                ? 'Team sentiment is generally neutral. Consider encouraging more positive communication.'
                : 'Team sentiment analysis suggests areas for improvement. Focus on positive reinforcement and clear communication.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

