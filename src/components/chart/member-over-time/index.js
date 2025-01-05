"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Label } from "@/components/ui/label";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function MemberOverTimeChart({ data }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Biểu đồ Thành viên theo thời gian</CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription>Số lượng thành viên mới theo ngày</CardDescription>
          <Label className="mr-6 text-md">Tổng hiện tại: {data.totalActiveMembers}</Label>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Số thành viên",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-30}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
