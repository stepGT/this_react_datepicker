import { useMemo, useState } from 'react';

interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

interface DateCellItem {
  day: number;
  month: number;
  year: number;
  isToday: boolean;
  isSelected: boolean;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1);
  nextMonthDate.setMinutes(-1);
  return nextMonthDate.getDate();
};

const Datepicker = ({ value, onChange, min, max }: DatepickerProps) => {
  const [panelYear, setPanelYear] = useState(() => value.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => value.getMonth());

  const [year, day, month] = useMemo(() => {
    const currentYear = value.getFullYear();
    const currentDay = value.getDate();
    const currentMonth = months[value.getMonth()];
    return [currentYear, currentDay, currentMonth];
  }, [value]);

  const dateCells = useMemo(() => {
    const items: DateCellItem[] = [];
    const daysInAMonth = getDaysAmountInAMonth(panelYear, panelMonth);
    console.log(daysInAMonth);
    return items;
  }, [panelYear, panelMonth]);

  const onDateSelect = () => {};

  const nextYear = () => {};
  const prevYear = () => {};
  const nextMonth = () => {};
  const prevMonth = () => {};

  return (
    <div>
      {day} {month} {year}{' '}
    </div>
  );
};

export default Datepicker;
