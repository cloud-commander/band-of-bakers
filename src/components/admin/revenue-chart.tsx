"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the last 30 days
const generateRevenueData = () => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic revenue data with some variance
    const baseRevenue = 300;
    const variance = Math.random() * 200 - 50;
    const weekendBoost = date.getDay() === 6 ? 150 : 0; // Saturday boost
    const revenue = Math.max(0, baseRevenue + variance + weekendBoost);

    data.push({
      date: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      revenue: Math.round(revenue),
    });
  }

  return data;
};

const data = generateRevenueData();

export function RevenueTrendChart() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4 border border-stone-200">
      <CardHeader>
        <Heading level={3} className="mb-0">
          Revenue Trend (Last 30 Days)
        </Heading>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="date"
              stroke="#78716c"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tick={{ fill: "#78716c" }}
            />
            <YAxis
              stroke="#78716c"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `£${value}`}
              tick={{ fill: "#78716c" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                border: "none",
                borderRadius: "8px",
                color: "#fafaf9",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`£${value}`, "Revenue"]}
              labelStyle={{ color: "#a8a29e" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#f59e0b" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
