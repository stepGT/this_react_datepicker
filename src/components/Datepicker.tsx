import { useMemo, useState } from 'react';

interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

interface DateCellItem {
  date: number;
  month: number;
  year: number;
  isToday?: boolean;
  isSelected?: boolean;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1);
  nextMonthDate.setMinutes(-1);
  return nextMonthDate.getDate();
};

const getPreviousMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfWeek = currentMonthFirstDay.getDay();
  const prevMonthCellsAmount = dayOfWeek - 1;
  //
  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month - 1);
  //
  const dateCells: DateCellItem[] = [];
  const [cellYear, cellMonth] = month === 0 ? [year - 1, 11] : [year, month - 1];
  for (let i = prevMonthCellsAmount - 1; i >= 0; i--) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: daysAmountInPrevMonth - i,
    });
  }
  return dateCells;
};

const VISIBLE_CELLS_AMOUNT = 6 * 7;

const getNextMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfWeek = currentMonthFirstDay.getDay();
  const prevMonthCellsAmount = dayOfWeek - 1;
  const daysAmount = getDaysAmountInAMonth(year, month);
  const nextMonthDays = VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthCellsAmount;
  //
  const dateCells: DateCellItem[] = [];
  const [cellYear, cellMonth] = month === 11 ? [year + 1, 0] : [year, month + 1];
  for (let i = 1; i <= nextMonthDays; i++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: i,
    });
  }
  return dateCells;
};

const getCurrentMonthDays = (year: number, month: number, numberOfDays: number) => {
  const dateCells: DateCellItem[] = [];
  for (let i = 1; i <= numberOfDays; i++) {
    dateCells.push({
      year,
      month,
      date: i,
    });
  }
  return dateCells;
};

const Datepicker = ({ value, onChange, min, max }: DatepickerProps) => {
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

  const onDateSelect = () => {};

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
              }>
              {cell.date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Datepicker;
