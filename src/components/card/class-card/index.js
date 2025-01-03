"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ClassCard({ classItem, onClick }) {
  function getNextSession() {
    const currentDate = new Date();

    const upcomingSessions = classItem.schedule.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= currentDate;
    });

    if (upcomingSessions.length === 0) return null;
    return upcomingSessions[0];
  }

  const nextSession = getNextSession();

  return (
    <Card
      className="bg-gradient-to-b from-muted/50 to-muted/20 overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-primary-foreground group"
      onClick={() => onClick(classItem)}
    >
      <CardContent className="p-1">
        <div className="flex">
          <div className="relative overflow-hidden rounded-md flex-shrink-0">
            <img
              src={classItem?.imageUrl}
              alt={classItem?.name}
              className="h-32 w-32 object-cover rounded-md transition-trransform duration-300 group-hover:scale-110 group-hover:rounded-md"
            />
            <div className="absolute inset-0 rounded-md bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          </div>
          <div className="p-2 flex flex-col justify-between flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors duration-300">
                        {classItem.name}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{classItem.name}</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm text-gray-600 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                {classItem.trainerId?.name}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 mr-3 text-xs font-medium border ${
                  classItem.status === "ACTIVE"
                    ? "bg-green-100 text-green-800 border-green-800"
                    : classItem.status === "UPCOMING"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                    : "bg-red-100 text-red-800 border-red-800"
                }`}
              >
                {classItem.status}
              </span>
              <span className="text-sm text-gray-700 italic group-hover:text-gray-900 transition-colors duration-300">
                {new Date(classItem.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(classItem.endDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="text-sm text-gray-700 italic group-hover:text-gray-900 transition-colors duration-300">
              Buổi học tới: { nextSession ? (
                <>
                  {new Date(nextSession.date).toLocaleDateString("vi-VN")}{"  "}
                  {nextSession.startTime} - {nextSession.endTime}
                </>
              ) : "___" }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
