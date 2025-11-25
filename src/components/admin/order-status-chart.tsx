"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { mockNextBakeSale } from "@/lib/mocks/bake-sales";

const data = [
  { name: "Pending", value: 12, color: "#fbbf24" },
  { name: "Processing", value: 8, color: "#60a5fa" },
  { name: "Ready", value: 15, color: "#a78bfa" },
  { name: "Fulfilled", value: 30, color: "#34d399" },
  { name: "Cancelled", value: 3, color: "#f87171" },
];

export function OrderStatusChart() {
  // Format the next bake sale date
  const nextBakeSaleDate = new Date(mockNextBakeSale.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="col-span-1 md:col-span-2 border border-stone-200">
      <CardHeader>
        <Heading level={3} className="mb-0">
          Order Status
        </Heading>
        <p className="text-sm text-muted-foreground mt-1">Next Bake Sale: {nextBakeSaleDate}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
              height={36}
              iconType="circle"
              formatter={(value: string, entry: { payload?: { value?: number } }) => (
                <span className="text-sm text-stone-700">
                  {value} ({entry.payload?.value || 0})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
