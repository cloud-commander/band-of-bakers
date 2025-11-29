"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface OrderStatusChartProps {
  data: Array<{ status: string; count: number }>;
  nextBakeSale: {
    date: string;
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#fbbf24",
  processing: "#60a5fa",
  ready: "#a78bfa",
  fulfilled: "#34d399",
  cancelled: "#f87171",
  refunded: "#9ca3af",
};

export function OrderStatusChart({ data, nextBakeSale }: OrderStatusChartProps) {
  // Format the next bake sale date
  const nextBakeSaleDate = nextBakeSale
    ? new Date(nextBakeSale.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No upcoming bake sales";

  return (
    <Card className="col-span-1 md:col-span-2 border border-stone-200">
      <CardHeader>
        <Heading level={3} className="mb-0">
          Order Status
        </Heading>
        <p className="text-sm text-muted-foreground mt-1">Next Bake Sale: {nextBakeSaleDate}</p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={data.map((item) => ({
                  name: item.status,
                  value: item.count,
                  color: STATUS_COLORS[item.status] || "#94a3b8",
                }))}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fafaf9",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [`${value} orders`, ""]}
              />
              <Legend
                verticalAlign="bottom"
                height={50}
                iconType="circle"
                formatter={(value: string, entry: { payload?: { value?: number } }) => (
                  <span className="text-sm text-stone-700">
                    {value} ({entry.payload?.value || 0})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
