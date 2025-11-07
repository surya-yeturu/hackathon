import { DashboardData, TeamMember, Task } from '../types';

export const mockDashboardData: DashboardData = {
  kpis: {
    openTasks: { label: 'Open Tasks', value: 37, trend: -5, trendDirection: 'down' },
    inProgress: { label: 'In Progress', value: 12, trend: 7, trendDirection: 'up' },
    closedToday: { label: 'Closed Today', value: 5, trend: 12, trendDirection: 'up' },
    closedThisHour: { label: 'Closed This Hour', value: 0, trend: -3, trendDirection: 'down' },
    completionRate: { label: 'Completion Rate', value: 26, trend: 3, trendDirection: 'up' },
  },
  taskDistribution: [
    { status: 'In Progress', count: 24, color: '#3b82f6' },
    { status: 'Completed', count: 26, color: '#f59e0b' },
    { status: 'Open', count: 38, color: '#a855f7' },
    { status: 'Blocked', count: 12, color: '#ec4899' },
  ],
  trendData: [
    { date: 'Oct 22', completed: 2, created: 4, inProgress: 8 },
    { date: 'Oct 23', completed: 3, created: 5, inProgress: 7 },
    { date: 'Oct 24', completed: 1, created: 3, inProgress: 9 },
    { date: 'Oct 25', completed: 4, created: 6, inProgress: 6 },
    { date: 'Oct 26', completed: 2, created: 4, inProgress: 8 },
    { date: 'Oct 27', completed: 3, created: 5, inProgress: 7 },
    { date: 'Oct 28', completed: 2, created: 4, inProgress: 8 },
  ],
  teamPerformance: [
    { name: 'Alice', completed: 3, inProgress: 2, open: 5 },
    { name: 'Bob', completed: 2, inProgress: 3, open: 4 },
    { name: 'Carol', completed: 4, inProgress: 1, open: 6 },
    { name: 'David', completed: 2, inProgress: 5, open: 8 },
    { name: 'Emma', completed: 5, inProgress: 2, open: 3 },
  ],
  projects: [
    { name: 'API Services', tasks: 40, openIssues: 40, color: '#ec4899' },
    { name: 'Mobile App', tasks: 32, openIssues: 10, color: '#3b82f6' },
    { name: 'Web Platform', tasks: 28, openIssues: 3, color: '#f59e0b' },
  ],
  aiSummary: {
    summary: 'Over the last 24 hours, your team completed 5 tasks with an average closure time of 58.1 hours.',
    alerts: [
      'Task completion velocity has decreased by 17.6%, indicating potential bottlenecks.',
      'There are 11 blocked tasks requiring attention.',
    ],
    timestamp: new Date().toISOString(),
  },
  predictiveMetrics: {
    sprintCompletion: 94,
    nextWeekWorkload: 'Medium',
    workloadTasks: 48,
    riskLevel: 'Low',
    riskMessage: 'No major bottlenecks.',
  },
  benchmarking: [
    { team: 'Your Team', totalTasks: 100, velocity: '49/wk', efficiency: 92, efficiencyTrend: 'up', rank: 2 },
    { team: 'Alpha Team', totalTasks: 108, velocity: '55/wk', efficiency: 95, efficiencyTrend: 'up', rank: 1 },
    { team: 'Beta Team', totalTasks: 95, velocity: '42/wk', efficiency: 88, efficiencyTrend: 'up', rank: 3 },
    { team: 'Gamma Team', totalTasks: 98, velocity: '45/wk', efficiency: 90, efficiencyTrend: 'up', rank: 4 },
  ],
  sentiment: {
    positive: 75,
    neutral: 20,
    negative: 5,
  },
};

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alice Johnson', initials: 'AJ', assigned: 2, completed: 1, ongoing: 1, trend: -50.0 },
  { id: '2', name: 'Bob Smith', initials: 'BS', assigned: 1, completed: 0, ongoing: 1, trend: 0 },
  { id: '3', name: 'Carol Davis', initials: 'CD', assigned: 3, completed: 2, ongoing: 1, trend: 33.3 },
  { id: '4', name: 'David Wilson', initials: 'DW', assigned: 5, completed: 2, ongoing: 3, trend: -20.0 },
  { id: '5', name: 'Emma Martinez', initials: 'EM', assigned: 4, completed: 4, ongoing: 0, trend: 100.0 },
  { id: '6', name: 'Frank Taylor', initials: 'FT', assigned: 5, completed: 2, ongoing: 3, trend: -40.0 },
  { id: '7', name: 'Grace Chen', initials: 'GC', assigned: 4, completed: 4, ongoing: 0, trend: 100.0 },
  { id: '8', name: 'Henry Anderson', initials: 'HA', assigned: 6, completed: 5, ongoing: 1, trend: 83.3 },
  { id: '9', name: 'Iris Brown', initials: 'IB', assigned: 6, completed: 4, ongoing: 2, trend: 66.7 },
];

export const mockTasks: Task[] = [
  { id: '1', name: 'Fix authentication bug', status: 'in_progress', assignedTo: 'Alice Johnson', project: 'API Services', createdAt: '2024-01-15' },
  { id: '2', name: 'Implement user dashboard', status: 'open', assignedTo: 'Bob Smith', project: 'Web Platform', createdAt: '2024-01-16' },
  { id: '3', name: 'Add push notifications', status: 'completed', assignedTo: 'Carol Davis', project: 'Mobile App', createdAt: '2024-01-14', closedAt: '2024-01-17' },
  { id: '4', name: 'Optimize database queries', status: 'blocked', assignedTo: 'David Wilson', project: 'API Services', createdAt: '2024-01-13' },
];

