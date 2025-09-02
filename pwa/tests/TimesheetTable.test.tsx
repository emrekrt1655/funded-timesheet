// tests/TimesheetTable.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimesheetTable from '@/components/timesheets/TimesheetTable';
import type { Year } from '@/types/Year';
import type { Region } from '@/types/Region';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={typeof href === 'string' ? href : ''} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/dataAccess', () => ({
  getId: (iri: string) => iri?.split('/').pop() ?? iri,
}));

const mutateSpy = vi.fn();
let hookState = { mutate: mutateSpy, isPending: false, error: null as any };
vi.mock('@/hooks/useYears', () => ({
  useDeleteYear: () => hookState,
}));

const makeYear = (id: string, yearNum: number, regionValue?: string): Year => {
  const region: Region | undefined = regionValue
    ? ({ '@id': `/regions/${regionValue}`, value: regionValue } as Region)
    : undefined;

  return {
    '@id': `/years/${id}`,
    year: yearNum,
    region,
  } as Year;
};

describe('TimesheetTable (basic)', () => {
  beforeEach(() => {
    mutateSpy.mockReset();
    hookState = { mutate: mutateSpy, isPending: false, error: null };
  });

  it('renders rows with year and region, and action links/buttons', () => {
    render(
      <TimesheetTable
        years={[makeYear('1', 2024, 'DE-BY'), makeYear('2', 2025, 'DE-BE')]}
      />,
    );

    expect(
      screen.getByRole('link', { name: /open timesheet 2024/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /open timesheet 2025/i }),
    ).toBeInTheDocument();

    expect(screen.getByText('DE-BY')).toBeInTheDocument();
    expect(screen.getByText('DE-BE')).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', { name: /open/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /delete timesheet/i }).length,
    ).toBeGreaterThan(0);
  });

  it('does not call delete when user cancels confirm', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

    render(<TimesheetTable years={[makeYear('2', 2025, 'DE-BE')]} />);

    await user.click(
      screen.getByRole('button', { name: /delete timesheet 2025/i }),
    );
    expect(mutateSpy).not.toHaveBeenCalled();
  });

  it('calls delete when user confirms', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    render(<TimesheetTable years={[makeYear('2', 2025, 'DE-BE')]} />);

    await user.click(
      screen.getByRole('button', { name: /delete timesheet 2025/i }),
    );

    expect(mutateSpy).toHaveBeenCalledTimes(1);
    const [idOrIri, options] = mutateSpy.mock.calls[0];
    expect(idOrIri).toBe('/years/2');
    expect(options).toHaveProperty('onSettled');
  });

  it('disables button and shows "Deleting…" when pending for that row', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    hookState.isPending = true;

    render(<TimesheetTable years={[makeYear('2', 2025, 'DE-BE')]} />);

    const btn = screen.getByRole('button', { name: /delete timesheet 2025/i });
    await user.click(btn);

    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/deleting…/i);
  });

  it('renders null when years is empty', () => {
    const { container } = render(<TimesheetTable years={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
