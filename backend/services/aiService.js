import OpenAI from 'openai';
import Task from '../models/Task.js';
import { calculateMetrics } from './metricsService.js';

let openai = null;

// Initialize OpenAI client
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export const generateAISummary = async () => {
  try {
    if (!openai) {
      return generateFallbackSummary();
    }

    const metrics = await calculateMetrics();
    const recentTasks = await Task.find()
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    const prompt = `Analyze the following team productivity metrics and generate a concise summary with key insights and alerts:

Metrics:
- Open Tasks: ${metrics.kpis?.openTasks?.value || 0}
- In Progress: ${metrics.kpis?.inProgress?.value || 0}
- Closed Today: ${metrics.kpis?.closedToday?.value || 0}
- Completion Rate: ${metrics.kpis?.completionRate?.value || 0}%

Recent Activity:
${recentTasks.slice(0, 5).map(t => `- ${t.title} (${t.status})`).join('\n')}

Generate:
1. A brief summary of team activity (1-2 sentences)
2. Key alerts or concerns (if any)
3. Positive trends (if any)

Format as JSON with keys: summary, alerts (array), positiveTrends (array)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a team productivity analyst. Provide concise, actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);

    return {
      summary: parsed.summary || generateFallbackSummary().summary,
      alerts: parsed.alerts || [],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return generateFallbackSummary();
  }
};

const generateFallbackSummary = async () => {
  const metrics = await calculateMetrics();
  const closedToday = metrics.kpis?.closedToday?.value || 0;
  const openTasks = metrics.kpis?.openTasks?.value || 0;
  const inProgress = metrics.kpis?.inProgress?.value || 0;

  const summary = `Over the last 24 hours, your team completed ${closedToday} tasks. There are currently ${openTasks} open tasks and ${inProgress} tasks in progress.`;

  const alerts = [];
  if (openTasks > 50) {
    alerts.push('High number of open tasks may indicate workload imbalance.');
  }
  if (inProgress > 20) {
    alerts.push('Many tasks in progress - consider focusing on completion.');
  }

  return {
    summary,
    alerts,
    timestamp: new Date().toISOString(),
  };
};

export const generateAIResponse = async (question) => {
  try {
    const metrics = await calculateMetrics();
    const tasks = await Task.find().sort({ updatedAt: -1 }).limit(100).lean();
    
    const taskStats = {
      total: tasks.length,
      open: tasks.filter(t => t.status === 'open').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };

    // Get project distribution
    const projectMap = new Map();
    tasks.forEach(task => {
      const project = task.project || 'Unassigned';
      if (!projectMap.has(project)) {
        projectMap.set(project, { total: 0, open: 0, completed: 0, inProgress: 0, blocked: 0 });
      }
      const proj = projectMap.get(project);
      proj.total++;
      if (task.status === 'open') proj.open++;
      else if (task.status === 'completed') proj.completed++;
      else if (task.status === 'in_progress') proj.inProgress++;
      else if (task.status === 'blocked') proj.blocked++;
    });

    // Get team member distribution
    const memberMap = new Map();
    tasks.forEach(task => {
      const member = task.assignedTo || 'Unassigned';
      if (!memberMap.has(member)) {
        memberMap.set(member, { total: 0, open: 0, completed: 0, inProgress: 0 });
      }
      const mem = memberMap.get(member);
      mem.total++;
      if (task.status === 'open') mem.open++;
      else if (task.status === 'completed') mem.completed++;
      else if (task.status === 'in_progress') mem.inProgress++;
    });

    // Get recent completed tasks
    const recentCompleted = tasks
      .filter(t => t.status === 'completed' && t.closedAt)
      .slice(0, 10)
      .map(t => ({
        title: t.title,
        project: t.project || 'Unassigned',
        assignedTo: t.assignedTo || 'Unassigned',
        closedAt: t.closedAt,
      }));

    // Calculate average completion time
    const completedWithDates = tasks.filter(t => 
      t.status === 'completed' && t.closedAt && t.createdAt
    );
    const avgCompletionTime = completedWithDates.length > 0
      ? completedWithDates.reduce((sum, t) => {
          const hours = (new Date(t.closedAt) - new Date(t.createdAt)) / (1000 * 60 * 60);
          return sum + hours;
        }, 0) / completedWithDates.length
      : 0;

    const projectList = Array.from(projectMap.entries())
      .map(([name, stats]) => `${name}: ${stats.total} tasks (${stats.open} open, ${stats.completed} completed, ${stats.inProgress} in progress, ${stats.blocked} blocked)`)
      .join('\n');

    const memberList = Array.from(memberMap.entries())
      .slice(0, 10)
      .map(([name, stats]) => `${name}: ${stats.total} tasks (${stats.open} open, ${stats.completed} completed, ${stats.inProgress} in progress)`)
      .join('\n');

    const prompt = `You are a team productivity assistant. Answer the following question based on REAL data from the MongoDB database:

Question: ${question}

CURRENT TEAM METRICS (from MongoDB):
- Total Tasks: ${taskStats.total}
- Open Tasks: ${taskStats.open}
- In Progress: ${taskStats.inProgress}
- Completed Tasks: ${taskStats.completed}
- Blocked Tasks: ${taskStats.blocked}
- Completion Rate: ${metrics.kpis?.completionRate?.value || 0}%
- Closed Today: ${metrics.kpis?.closedToday?.value || 0}
- Closed This Hour: ${metrics.kpis?.closedThisHour?.value || 0}
- Average Completion Time: ${Math.round(avgCompletionTime * 10) / 10} hours

PROJECT BREAKDOWN:
${projectList || 'No projects found'}

TEAM MEMBER BREAKDOWN (top 10):
${memberList || 'No team members found'}

RECENT COMPLETED TASKS (last 10):
${recentCompleted.length > 0 
  ? recentCompleted.map(t => `- ${t.title} (${t.project}, assigned to ${t.assignedTo})`).join('\n')
  : 'No recently completed tasks'}

Provide a helpful, accurate, and concise answer based on this REAL data. If the question asks about specific information not in the data, politely say so. Use actual numbers from the metrics above.`;

    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful team productivity assistant. Answer questions concisely and accurately based on the REAL data provided from MongoDB. Always use the actual numbers and facts from the data.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return completion.choices[0].message.content;
    } else {
      // Fallback response using real data
      return generateFallbackResponse(question, taskStats, metrics, projectMap, memberMap, avgCompletionTime);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    // Try to get at least basic metrics for fallback
    try {
      const metrics = await calculateMetrics();
      const tasks = await Task.find().limit(50).lean();
      const taskStats = {
        total: tasks.length,
        open: tasks.filter(t => t.status === 'open').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        blocked: tasks.filter(t => t.status === 'blocked').length,
      };
      return generateFallbackResponse(question, taskStats, metrics, new Map(), new Map(), 0);
    } catch (fallbackError) {
      return "I'm sorry, I couldn't access the database right now. Please try again later.";
    }
  }
};

const generateFallbackResponse = (question, taskStats, metrics, projectMap, memberMap, avgCompletionTime) => {
  const lowerQuestion = question.toLowerCase();
  
  // Use real data from MongoDB
  const totalTasks = taskStats?.total || 0;
  const openTasks = taskStats?.open || 0;
  const inProgress = taskStats?.inProgress || 0;
  const completed = taskStats?.completed || 0;
  const blocked = taskStats?.blocked || 0;
  const completionRate = metrics?.kpis?.completionRate?.value || 0;
  const closedToday = metrics?.kpis?.closedToday?.value || 0;
  
  if (lowerQuestion.includes('total') && (lowerQuestion.includes('task') || lowerQuestion.includes('how many'))) {
    return `Based on the data in MongoDB, you currently have ${totalTasks} total tasks. Of these, ${openTasks} are open, ${inProgress} are in progress, ${completed} are completed, and ${blocked} are blocked.`;
  } else if (lowerQuestion.includes('open') || lowerQuestion.includes('pending')) {
    return `You have ${openTasks} open tasks in your database. There are also ${inProgress} tasks currently in progress.`;
  } else if (lowerQuestion.includes('complete') || lowerQuestion.includes('finished') || lowerQuestion.includes('done')) {
    return `Your team has completed ${completed} tasks. The completion rate is ${completionRate}%. ${closedToday > 0 ? `${closedToday} tasks were closed today.` : 'No tasks were closed today.'}${avgCompletionTime > 0 ? ` The average completion time is ${Math.round(avgCompletionTime * 10) / 10} hours.` : ''}`;
  } else if (lowerQuestion.includes('blocked')) {
    return `There are ${blocked} blocked tasks in your database that require attention.`;
  } else if (lowerQuestion.includes('progress') || lowerQuestion.includes('velocity')) {
    return `Currently, ${inProgress} tasks are in progress. Your completion rate is ${completionRate}%.${closedToday > 0 ? ` ${closedToday} tasks were completed today.` : ''}`;
  } else if (lowerQuestion.includes('project')) {
    if (projectMap.size > 0) {
      const projectList = Array.from(projectMap.entries())
        .slice(0, 5)
        .map(([name, stats]) => `${name} (${stats.total} tasks)`)
        .join(', ');
      return `Your projects include: ${projectList}.${projectMap.size > 5 ? ` And ${projectMap.size - 5} more projects.` : ''}`;
    } else {
      return 'No project data available in the database.';
    }
  } else if (lowerQuestion.includes('team') || lowerQuestion.includes('member') || lowerQuestion.includes('who')) {
    if (memberMap.size > 0) {
      const memberList = Array.from(memberMap.entries())
        .slice(0, 5)
        .map(([name, stats]) => `${name} (${stats.total} tasks)`)
        .join(', ');
      return `Team members with tasks: ${memberList}.${memberMap.size > 5 ? ` And ${memberMap.size - 5} more members.` : ''}`;
    } else {
      return 'No team member data available in the database.';
    }
  } else if (lowerQuestion.includes('today') || lowerQuestion.includes('recent')) {
    return `${closedToday > 0 ? `${closedToday} tasks were closed today.` : 'No tasks were closed today.'} You have ${inProgress} tasks currently in progress.`;
  } else {
    return `Based on your MongoDB data: You have ${totalTasks} total tasks (${openTasks} open, ${inProgress} in progress, ${completed} completed, ${blocked} blocked). Your completion rate is ${completionRate}%. ${closedToday > 0 ? `${closedToday} tasks were closed today.` : ''} What specific information would you like to know?`;
  }
};

export const generatePredictiveMetrics = async () => {
  try {
    const tasks = await Task.find().lean();
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.closedAt);
    
    // Calculate average closure time
    const closureTimes = completedTasks
      .filter(t => t.closedAt && t.createdAt)
      .map(t => (new Date(t.closedAt) - new Date(t.createdAt)) / (1000 * 60 * 60)); // hours
    
    const avgClosureTime = closureTimes.length > 0
      ? closureTimes.reduce((a, b) => a + b, 0) / closureTimes.length
      : 0;

    // Calculate sprint completion (mock calculation)
    const totalTasks = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const sprintCompletion = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    // Predict next week workload
    const weeklyVelocity = completedTasks.filter(t => {
      const closedDate = new Date(t.closedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return closedDate > weekAgo;
    }).length;

    const nextWeekWorkload = weeklyVelocity * 1.2; // 20% increase estimate
    const workloadLevel = nextWeekWorkload > 50 ? 'High' : nextWeekWorkload > 30 ? 'Medium' : 'Low';

    // Risk assessment
    const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
    const riskLevel = blockedTasks > 15 ? 'High' : blockedTasks > 10 ? 'Medium' : 'Low';
    const riskMessage = blockedTasks > 15
      ? 'Multiple blocked tasks require attention'
      : blockedTasks > 10
      ? 'Some bottlenecks detected'
      : 'No major bottlenecks';

    return {
      sprintCompletion: Math.min(sprintCompletion, 100),
      nextWeekWorkload: workloadLevel,
      workloadTasks: Math.round(nextWeekWorkload),
      riskLevel,
      riskMessage,
      avgClosureTime: Math.round(avgClosureTime * 10) / 10,
    };
  } catch (error) {
    console.error('Error generating predictive metrics:', error);
    return {
      sprintCompletion: 0,
      nextWeekWorkload: 'Low',
      workloadTasks: 0,
      riskLevel: 'Low',
      riskMessage: 'Unable to calculate',
    };
  }
};

export const analyzeSentiment = async () => {
  try {
    // In a real implementation, this would analyze commit messages, comments, etc.
    // For now, we'll return mock sentiment data
    // You could integrate with sentiment analysis APIs or use NLP libraries
    
    return {
      positive: 75,
      neutral: 20,
      negative: 5,
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      positive: 70,
      neutral: 25,
      negative: 5,
    };
  }
};

