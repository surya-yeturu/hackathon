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
    if (!openai) {
      return generateFallbackResponse(question);
    }

    const metrics = await calculateMetrics();
    const tasks = await Task.find().limit(50).lean();
    const taskStats = {
      total: tasks.length,
      open: tasks.filter(t => t.status === 'open').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };

    const prompt = `You are a team productivity assistant. Answer the following question based on the current team metrics:

Question: ${question}

Current Metrics:
- Total Tasks: ${taskStats.total}
- Open: ${taskStats.open}
- In Progress: ${taskStats.inProgress}
- Completed: ${taskStats.completed}
- Blocked: ${taskStats.blocked}
- Completion Rate: ${metrics.kpis?.completionRate?.value || 0}%
- Closed Today: ${metrics.kpis?.closedToday?.value || 0}

Provide a helpful, concise answer. If the question asks about specific data not available, say so politely.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful team productivity assistant. Answer questions concisely and accurately based on the provided metrics.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return generateFallbackResponse(question);
  }
};

const generateFallbackResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('bug') || lowerQuestion.includes('close')) {
    return 'Currently tracking tasks across all projects. Check the Tasks page for detailed information about closed items.';
  } else if (lowerQuestion.includes('task') && lowerQuestion.includes('complete')) {
    return 'You can view completed tasks and completion rates on the Overview dashboard.';
  } else if (lowerQuestion.includes('progress') || lowerQuestion.includes('velocity')) {
    return 'Team progress metrics are available on the Overview and AI Insights pages.';
  } else {
    return "I can help you understand your team's productivity metrics. Try asking about tasks, completion rates, or team performance. For detailed data, check the Overview and Tasks pages.";
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

