// tests/SummaryCards.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryCards from '@/components/timesheets/SummaryCards';

describe('SummaryCards (basic)', () => {
  const totals = {
    totalHours: 12,
    vacationDays: 3,
    sickDays: 2,
    publicHolidays: 1,
    weekends: 8,
  };

  it('renders all labels', () => {
    render(<SummaryCards totals={totals} />);

    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText('Sick')).toBeInTheDocument();
    expect(screen.getByText('Public Holidays')).toBeInTheDocument();
    expect(screen.getByText('Weekends')).toBeInTheDocument();
  });

  it('renders values and hints', () => {
    render(<SummaryCards totals={totals} />);

    expect(screen.getByText('12')).toBeInTheDocument(); // Total Hours
    expect(screen.getByText('3')).toBeInTheDocument();  // Vacation
    expect(screen.getByText('2')).toBeInTheDocument();  // Sick
    expect(screen.getByText('1')).toBeInTheDocument();  // Public Holidays
    expect(screen.getByText('8')).toBeInTheDocument();  // Weekends

    expect(screen.getByText('Urlaub')).toBeInTheDocument();
    expect(screen.getByText('Krank')).toBeInTheDocument();
  });
});
