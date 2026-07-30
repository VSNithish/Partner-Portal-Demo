import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const isSameDay = (left: Date | null, right: Date | null) =>
  Boolean(left && right) &&
  left!.getFullYear() === right!.getFullYear() &&
  left!.getMonth() === right!.getMonth() &&
  left!.getDate() === right!.getDate();

const isBetween = (date: Date, startDate: Date | null, endDate: Date | null) => {
  if (!startDate || !endDate) return false;
  const value = date.getTime();
  return value > startDate.getTime() && value < endDate.getTime();
};

const getMonthDays = (monthDate: Date) => {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const days: Array<Date | null> = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) days.push(null);
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }
  while (days.length % 7 !== 0) days.push(null);

  return days;
};

type DateRangePickerPanelProps = {
  anchorDate: Date;
  endDate: Date | null;
  onApply: () => void;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  startDate: Date | null;
};

export const DateRangePickerPanel = ({
  anchorDate,
  endDate,
  onApply,
  onChange,
  startDate,
}: DateRangePickerPanelProps) => {
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(anchorDate));
  const hasCompletedRange = Boolean(startDate && endDate && !isSameDay(startDate, endDate));

  useEffect(() => {
    setVisibleMonth(startOfMonth(anchorDate));
  }, [anchorDate]);

  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(visibleMonth);
  const monthDays = getMonthDays(visibleMonth);

  return (
    <div className="customers-date-picker-panel customers-date-picker-panel-single">
      <div className="customers-single-calendar">
        <div className="customers-single-calendar-header">
          <button
            className="customers-single-calendar-arrow"
            onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            type="button"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <span>{monthLabel}</span>
          <button
            className="customers-single-calendar-arrow"
            onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            type="button"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="customers-mini-calendar-grid is-weekdays">
          {weekdayLabels.map((label) => (
            <span key={label} className="customers-mini-calendar-weekday">
              {label}
            </span>
          ))}
        </div>

        <div className="customers-mini-calendar-grid">
          {monthDays.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} className="customers-mini-calendar-cell is-empty" />;
            }

            const isStartDate = isSameDay(date, startDate);
            const isEndDate = hasCompletedRange && isSameDay(date, endDate);
            const isInRange = hasCompletedRange ? isBetween(date, startDate, endDate) : false;

            return (
              <button
                key={date.toISOString()}
                className={[
                  "customers-mini-calendar-cell",
                  isStartDate || isEndDate ? "is-selected" : "",
                  isInRange ? "is-in-range" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  if (!startDate || hasCompletedRange) {
                    onChange(date, null);
                    return;
                  }

                  if (date.getTime() < startDate.getTime()) {
                    onChange(date, null);
                    return;
                  }

                  onChange(startDate, date);
                }}
                type="button"
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <button className="customers-date-picker-apply" disabled={!hasCompletedRange} onClick={onApply} type="button">
        Apply
      </button>
    </div>
  );
};
