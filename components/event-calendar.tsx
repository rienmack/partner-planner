import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EventCalendarProps {
  events: Event[] 
}

export function EventCalendar({ events }: EventCalendarProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <h3 className="text-lg font-medium">November 2024</h3>
        <Button variant="outline" size="sm">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
    </div>
  )
} 