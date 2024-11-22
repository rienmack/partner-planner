import { SchedulingApp } from '../components/scheduling-app'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <SchedulingApp />
      </main>
    </div>
  )
}

