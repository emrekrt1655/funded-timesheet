// tests/MonthSwitcher.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonthSwitcher from '@/components/timesheets/MonthSwitcher';

describe('MonthSwitcher (basic)', () => {
  const baseProps: React.ComponentProps<typeof MonthSwitcher> = {
    month: 0,
    year: 2025,
    onPrev: vi.fn(),
    onNext: vi.fn(),
    onChange: vi.fn(),
    stats: { hours: 10, sick: 2, vacation: 1 },
  };

  it('renders label and stats', () => {
    render(<MonthSwitcher {...baseProps} />);

    expect(screen.getByText('January 2025')).toBeInTheDocument();

    expect(screen.getByText(/Hours:/i)).toBeInTheDocument();
    expect(screen.getByText(/Sick:/i)).toBeInTheDocument();
    expect(screen.getByText(/Vacation:/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onPrev and onNext when buttons are enabled', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(
      <MonthSwitcher
        {...baseProps}
        month={5}
        onPrev={onPrev}
        onNext={onNext}
      />,
    );

    await user.click(screen.getByRole('button', { name: /prev/i }));
    expect(onPrev).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables Prev on month 0 and Next on month 11', () => {
    const { rerender } = render(<MonthSwitcher {...baseProps} month={0} />);
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();

    rerender(<MonthSwitcher {...baseProps} month={11} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls onChange when a different month is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MonthSwitcher {...baseProps} onChange={onChange} />);

    const select = screen.getByRole('combobox', { name: /select month/i });
    await user.selectOptions(select, '1');

    expect(onChange).toHaveBeenCalledWith(1);
  });
});
