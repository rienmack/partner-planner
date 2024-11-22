import { Appointment } from '../types/appointment'

interface AppointmentListProps {
  appointments: Appointment[]
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Scheduled Appointments</h2>
      <ul className="space-y-2">
        {appointments.map((appointment, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            <span className="font-medium">{appointment.title}</span>
            <span className="text-sm text-gray-600 ml-2">
              {new Date(appointment.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

