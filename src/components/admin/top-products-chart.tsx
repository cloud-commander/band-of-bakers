"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Sourdough", sales: 145 },
  { name: "Croissants", sales: 98 },
  { name: "Baguette", sales: 87 },
  { name: "Focaccia", sales: 72 },
  { name: "Ciabatta", sales: 65 },
];

export function TopProductsChart() {
  return (
    <Card className="col-span-1 md:col-span-2 border border-stone-200">
      <CardHeader>
        <Heading level={3} className="mb-0">
          Top Products
        </Heading>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#78716c"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#78716c" }}
            />
            <YAxis
              stroke="#78716c"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
              formatter={(value: number) => [`${value} units`, "Sales"]}
              labelStyle={{ color: "#a8a29e" }}
              cursor={{ fill: "rgba(251, 191, 36, 0.1)" }}
            />
            <Bar dataKey="sales" fill="#fbbf24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
