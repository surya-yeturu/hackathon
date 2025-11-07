import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { KPIMetric } from '../types';

interface KPICardProps {
  metric: KPIMetric;
}

export default function KPICard({ metric }: KPICardProps) {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-dark-muted mb-1">{metric.label}</p>
          <p className="text-3xl font-bold text-dark-text">{metric.value}</p>
        </div>
        <button className="text-dark-muted hover:text-dark-text transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {metric.trendDirection === 'up' ? (
          <ArrowUp className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500" />
        )}
        <span
          className={`text-sm font-medium ${
            metric.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {Math.abs(metric.trend)}% vs last week
        </span>
      </div>
    </div>
  );
}

