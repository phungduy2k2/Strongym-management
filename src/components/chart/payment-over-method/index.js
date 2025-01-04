"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"


export default function PaymentOverMethodChart({ data }) {
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']
  const totalAmount = data.reduce((sum, entry) => sum + entry.amount, 0)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  return (
    <Card className="w-full">
        <CardHeader>
          <CardTitle>Biểu đồ Doanh thu theo phương thức</CardTitle>
          <CardDescription>Tổng doanh thu theo từng phương thức thanh toán</CardDescription>
                
        </CardHeader>
        <CardContent>
            <ChartContainer
                config={{
                    amount: {
                      label: "Revenue",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[250px]"
            >
                <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                nameKey="method"
                label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-100 p-2 border rounded shadow">
                        <p className="label">{`Phương thức: ${data.method}`}</p>
                        <p className="amount">{`Tổng: ${formatCurrency(data.amount)}`}</p>
                        <p className="percent">{`Chiếm: ${((data.amount / totalAmount) * 100).toFixed(2)}%`}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
