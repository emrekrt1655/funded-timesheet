// tests/DayEditModal.basic.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DayEditModal from '@/components/timesheets/DayEditModal';
import { OffValues } from '@/types/Off';
import type { Day } from '@/types/Day';

// ---- mocks ----

// useUpdateDay
const updateSpy = vi.fn().mockResolvedValue(undefined);
vi.mock('@/hooks/useUpdateDay', () => ({
  useUpdateDay: () => ({ mutateAsync: updateSpy }),
}));

// useBulkUpdateDays
const bulkSpy = vi.fn().mockResolvedValue(undefined);
vi.mock('@/hooks/useBulkUpdateDays', () => ({
  useBulkUpdateDays: () => ({ mutateAsync: bulkSpy }),
}));

// useCommonDefaultValues -> blank defaults so form starts empty
vi.mock('@/hooks/useCommonDefaultValues', () => ({
  useCommonDefaults: () => ({
    hours: '',
    off: '',
    finish: '',
    publicHoliday: '',
  }),
}));

// helper
const makeDay = (id: string, dateISO: string, yearIri = '/years/2'): Day =>
  ({
    '@id': `/days/${id}`,
    date: dateISO,
    year: yearIri,
  } as any);

describe('DayEditModal (basic)', () => {
  beforeEach(() => {
    updateSpy.mockClear();
    bulkSpy.mockClear();
  });

  it('disables Hours input when Off = SICK is selected', async () => {
    const user = userEvent.setup();
    const day = makeDay('1', '2025-09-10T00:00:00.000Z');

    render(
      <DayEditModal
        open
        mode="single"
        day={day}
        onClose={() => {}}
        publicHolidays={[]}
      />
    );

    // Requires label to be associated with input (htmlFor="off" / id="off")
    const offSelect = screen.getByLabelText(/off/i) as HTMLSelectElement;
    await user.selectOptions(offSelect, OffValues.sick);

    // Requires label to be associated with input (htmlFor="hours" / id="hours")
    const hoursInput = screen.getByLabelText(/hours/i) as HTMLInputElement;
    expect(hoursInput).toBeDisabled();
  });

  it('submits single update with hours=6', async () => {
    const user = userEvent.setup();
    const day = makeDay('1', '2025-09-19T00:00:00.000Z');

    render(
      <DayEditModal
        open
        mode="single"
        day={day}
        yearId="2"
        onClose={() => {}}
        publicHolidays={[]}
      />
    );

    const hours = screen.getByLabelText(/hours/i) as HTMLInputElement;
    await user.clear(hours);
    await user.type(hours, '6');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(updateSpy).toHaveBeenCalledTimes(1);
    const arg = updateSpy.mock.calls[0][0];

    expect(arg.idOrIri).toBe('/days/1');
    expect(arg.payload.hours).toBe(6);
    expect(arg.payload.year).toBe('/years/2');
    expect(arg.payload.date).toBe('2025-09-19T00:00:00.000Z');
  });

  it('submits bulk update (2 items) with hours=5', async () => {
    const user = userEvent.setup();
    const d1 = makeDay('10', '2025-09-20T00:00:00.000Z');
    const d2 = makeDay('11', '2025-09-21T00:00:00.000Z');

    render(
      <DayEditModal
        open
        mode="bulk"
        days={[d1, d2]}
        yearId="2"
        onClose={() => {}}
        publicHolidays={[]}
      />
    );

    const hours = screen.getByLabelText(/hours/i) as HTMLInputElement;
    await user.clear(hours);
    await user.type(hours, '5');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(bulkSpy).toHaveBeenCalledTimes(1);
    const arg = bulkSpy.mock.calls[0][0];

    expect(Array.isArray(arg.items)).toBe(true);
    expect(arg.items).toHaveLength(2);

    for (const item of arg.items) {
      expect(item.payload.hours).toBe(5);
      expect(item.payload.year).toBe('/years/2');
      expect(typeof item.payload.date).toBe('string');
    }
  });
});
