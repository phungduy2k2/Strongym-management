"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

export default function ClassCard({ classItem, onClick }) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-primary-foreground group"
      onClick={() => onClick(classItem)}
    >
      <CardContent className="p-1">
        <div className="flex">
          <div className="flex-shrink-0 relative overflow-hidden">
            <img
              src={classItem.imageUrl}
              alt={classItem.name}
              className="h-32 w-32 object-cover rounded-md transition-trransform duration-300 group-hover:scale-110"
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
                {classItem.trainerId.name}
              </p>
            </div>
            <div className="text-sm text-gray-700 italic group-hover:text-gray-900 transition-colors duration-300">
              {format(new Date(classItem.startDate), "dd-MM-yyyy")} -{" "}
              {format(new Date(classItem.endDate), "dd-MM-yyyy")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
