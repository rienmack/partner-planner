import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventForm } from '@/components/event-form'

describe('EventForm', () => {
  it('renders form fields', () => {
    const mockOnSubmit = jest.fn()
    render(<EventForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument()
  })

  it('submits form with correct data', () => {
    const mockOnSubmit = jest.fn()
    render(<EventForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Event' },
    })
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-03-01' },
    })
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: '14:00' },
    })

    fireEvent.click(screen.getByText(/create event/i))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Event',
      date: '2024-03-01T14:00',
    })
  })
}) 