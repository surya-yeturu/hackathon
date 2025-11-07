interface BubbleChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
}

export default function BubbleChart({ data, title }: BubbleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>
      <div className="flex items-center justify-center gap-8 h-64">
        {data.map((item, index) => {
          const size = (item.value / maxValue) * 120 + 60;
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <div
                className="rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: item.color,
                }}
              >
                {item.value}
              </div>
              <span className="text-sm text-dark-muted">{item.name}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center gap-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-dark-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

