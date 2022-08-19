import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getDaysAmountInAMonth,
  getCurrentMonthDays,
  getPreviousMonthDays,
  getNextMonthDays,
  DateCellItem,
  dayOfWeek,
  months,
} from './utils';

interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

const Datepicker = ({ value, onChange, min, max }: DatepickerProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onFocus = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    //
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (element.contains(target)) {
        return;
      }
      setShowPopup(false);
    };

    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  return (
    <div ref={ref} className="wrapper">
      <input type="text" onFocus={onFocus} />
      {showPopup && (
        <div className="content">
          <DatepickerPopupContent value={value} onChange={onChange} min={min} max={max} />
        </div>
      )}
    </div>
  );
};

const DatepickerPopupContent = ({ value, onChange, min, max }: DatepickerProps) => {
  const [panelYear, setPanelYear] = useState(() => value.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => value.getMonth());

  const [year, day, month] = useMemo(() => {
    const currentYear = value.getFullYear();
    const currentDay = value.getDate();
    const currentMonth = value.getMonth();
    return [currentYear, currentDay, currentMonth];
  }, [value]);

  const dateCells = useMemo(() => {
    const daysInAMonth = getDaysAmountInAMonth(panelYear, panelMonth);
    const currentMonthDays = getCurrentMonthDays(panelYear, panelMonth, daysInAMonth);
    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth);
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth);
    //
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [panelYear, panelMonth]);

  const onDateSelect = (cell: DateCellItem) => onChange(new Date(cell.year, cell.month, cell.date));

  const nextYear = () => {
    setPanelYear(panelYear + 1);
  };
  const prevYear = () => {
    setPanelYear(panelYear - 1);
  };
  const nextMonth = () => {
    if (panelMonth === 11) {
      setPanelMonth(0);
      setPanelYear(panelYear + 1);
    } else {
      setPanelMonth(panelMonth + 1);
    }
  };
  const prevMonth = () => {
    if (panelMonth === 0) {
      setPanelMonth(11);
      setPanelYear(panelYear - 1);
    } else {
      setPanelMonth(panelMonth - 1);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <div>{months[panelMonth]} {panelYear}</div>
      <div className="calendarButtons">
        <button onClick={prevYear}>Prev Year</button>
        <button onClick={prevMonth}>Prev Month</button>
        <button onClick={nextMonth}>Next Month</button>
        <button onClick={nextYear}>Next Year</button>
      </div>
      <div className="calendarPanel">
        {dayOfWeek.map((week, i) => {
          return (
            <div key={i} className="calendarPanelItem">
              {week}
            </div>
          );
        })}
        {dateCells.map((cell, i) => {
          const isCurrentDate = cell.year === year && cell.month === month && cell.date === day;
          return (
            <div
              key={i}
              className={
                isCurrentDate ? 'calendarPanelItem calendarPanelItem--current' : 'calendarPanelItem'
              }
              onClick={() => onDateSelect(cell)}>
              {cell.date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Datepicker;
