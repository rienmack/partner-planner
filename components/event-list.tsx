import { Event } from '../types/event'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {
  return (
    <ScrollArea className="h-[300px] md:h-[400px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">
                  {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

