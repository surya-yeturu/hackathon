interface BubbleChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
}

export default function BubbleChart({ data, title }: BubbleChartProps) {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>
      <div className="max-h-64 overflow-y-auto pr-2">
        <div className="flex flex-col gap-4">
          {data.map((item, index) => {
            const normalized = maxValue > 0 ? item.value / maxValue : 0;
            const size = 36 + normalized * 36;

            return (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: item.color,
                  }}
                >
                  {item.value}
                </div>
                <div className="flex-1">
                  <p className="text-dark-text font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-dark-muted">Open issues: {item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

