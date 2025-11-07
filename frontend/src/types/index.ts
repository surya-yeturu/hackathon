export interface Task {
  id: string;
  name: string;
  status: 'open' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  project: string;
  createdAt: string;
  closedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  assigned: number;
  completed: number;
  ongoing: number;
  trend: number;
}

export interface KPIMetric {
  label: string;
  value: number;
  trend: number;
  trendDirection: 'up' | 'down';
}

export interface TaskDistribution {
  status: string;
  count: number;
  color: string;
}

export interface TrendData {
  date: string;
  completed: number;
  created: number;
  inProgress: number;
}

export interface TeamPerformance {
  name: string;
  completed: number;
  inProgress: number;
  open: number;
}

export interface ProjectData {
  name: string;
  tasks: number;
  openIssues: number;
  color: string;
}

export interface AISummary {
  summary: string;
  alerts: string[];
  timestamp: string;
}

export interface PredictiveMetrics {
  sprintCompletion: number;
  nextWeekWorkload: string;
  workloadTasks: number;
  riskLevel: string;
  riskMessage: string;
}

export interface BenchmarkData {
  team: string;
  totalTasks: number;
  velocity: string;
  efficiency: number;
  efficiencyTrend: 'up' | 'down';
  rank: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface DashboardData {
  kpis: {
    openTasks: KPIMetric;
    inProgress: KPIMetric;
    closedToday: KPIMetric;
    closedThisHour: KPIMetric;
    completionRate: KPIMetric;
  };
  taskDistribution: TaskDistribution[];
  trendData: TrendData[];
  teamPerformance: TeamPerformance[];
  projects: ProjectData[];
  aiSummary?: AISummary;
  predictiveMetrics?: PredictiveMetrics;
  benchmarking?: BenchmarkData[];
  sentiment?: SentimentData;
}

export interface WebSocketMessage {
  type: 'metrics_update' | 'task_update' | 'ai_insight' | 'error';
  data: any;
  timestamp: string;
}

