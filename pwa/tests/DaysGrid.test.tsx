// tests/DaysGrid.basic.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DaysGrid from '@/components/timesheets/DaysGrid';
import type { Day } from '@/types/Day';

const makeDay = (iso: string): Day =>
  ({ '@id': `/days/${iso}`, date: iso } as any);

describe('DaysGrid (basic)', () => {
  const baseProps = {
    month: 8,
    year: 2025,
    selectable: true,
    selectedIds: new Set<string>(),
    publicHolidays: [] as any[],
  };

  it('renders weekday headers', () => {
    render(<DaysGrid {...baseProps} days={[makeDay('2025-09-01T00:00:00.000Z')]} />);
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((w) =>
      expect(screen.getByText(w)).toBeInTheDocument()
    );
  });

  it('calls onToggleSelect when a day cell is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSelect = vi.fn();
    const d = makeDay('2025-09-02T00:00:00.000Z');

    render(
      <DaysGrid
        {...baseProps}
        days={[d]}
        onToggleSelect={onToggleSelect}
      />
    );

    await user.click(screen.getByText('2'));
    expect(onToggleSelect).toHaveBeenCalledWith(d['@id']);
  });

  it('calls onEditDay when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEditDay = vi.fn();
    const d = makeDay('2025-09-03T00:00:00.000Z');

    render(
      <DaysGrid
        {...baseProps}
        days={[d]}
        onEditDay={onEditDay}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEditDay).toHaveBeenCalledWith(d);
  });
});
