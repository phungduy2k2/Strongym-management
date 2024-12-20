import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EventCard({ event, onClick }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="cursor-pointer border-0 hover:border-2 hover:border-blue-500 hover:shadow-lg transition-shadow duration-200 ease-in-out"
            onClick={onClick}
          >
            <CardContent className="p-1">
              <img
                src={event.banner}
                alt={event.title}
                className="w-full h-52 object-cover rounded-md"
              />
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{event.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
