"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Label } from "@/components/ui/label";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function PaymentOverTimeChart({ data }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }
  const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => total + item.amount, 0);
  };
  const totalAmount = formatCurrency(calculateTotalAmount(data))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Biểu đồ Doanh thu theo thời gian</CardTitle>
        <div className="flex justify-between items-center">
            <CardDescription>Tổng doanh thu theo ngày</CardDescription>
            <Label className="mr-6 text-md">Tổng: {totalAmount}</Label>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Doanh thu",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-30}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                textAnchor="end"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border rounded shadow">
                        <p className="label">{`Ngày: ${payload[0].payload.date}`}</p>
                        <p className="amount">{`Tổng: ${formatCurrency(
                          payload[0].value
                        )}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--color-amount)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
