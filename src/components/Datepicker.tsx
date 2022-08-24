import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import {
  getDaysAmountInAMonth,
  getCurrentMonthDays,
  getPreviousMonthDays,
  getNextMonthDays,
  DateCellItem,
  dayOfWeek,
  months,
  getInputValueFromDate,
  getDateFromInputValue,
  isToday,
} from './utils';

interface DatepickerProps {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

interface DatepickerPopupContentProps {
  selectedValue: Date;
  inputValueDate?: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
}

function useLatest<T>(value: T) {
  const valueRef = useRef(value);
  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);
  return valueRef;
}

const Datepicker = ({ value, onChange, min, max }: DatepickerProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const latestInputValue = useLatest(inputValue);
  const latestValue = useLatest(value);

  useLayoutEffect(() => {
    setInputValue(getInputValueFromDate(value));
  }, [value]);

  const onInputClick = () => {
    setShowPopup(true);
  };

  const inputValueDate = useMemo(() => {
    return getDateFromInputValue(inputValue);
  }, [inputValue]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') {
      return;
    }
    const date = getDateFromInputValue(inputValue);
    if (!date) {
      setInputValue(getInputValueFromDate(value));
    } else {
      handleChange(date);
    }
    setShowPopup(false);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim());
  };

  const handleChange = (value: Date) => {
    setShowPopup(false);
    onChange(value);
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
      const dateFromInputValue = getDateFromInputValue(latestInputValue.current);
      if (dateFromInputValue) {
        onChange(dateFromInputValue);
      } else {
        setInputValue(getInputValueFromDate(latestValue.current));
      }
      setShowPopup(false);
    };

    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [latestInputValue, latestValue]);

  return (
    <div ref={ref} className="wrapper">
      <input
        value={inputValue}
        type="text"
        onClick={onInputClick}
        onChange={onChangeInput}
        onKeyDown={onKeyDown}
      />
      {showPopup && (
        <div className="content">
          <DatepickerPopupContent selectedValue={value} onChange={handleChange} min={min} max={max} inputValueDate={inputValueDate} />
        </div>
      )}
    </div>
  );
};

const DatepickerPopupContent = ({
  selectedValue,
  inputValueDate,
  onChange,
  min,
  max,
}: DatepickerPopupContentProps) => {
  const [panelYear, setPanelYear] = useState(() => selectedValue.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => selectedValue.getMonth());
  const todayDate = useMemo(() => new Date(), []);

  useLayoutEffect(() => {
    if (!inputValueDate) return;
    setPanelMonth(inputValueDate.getMonth());
    setPanelYear(inputValueDate.getFullYear());
  }, [inputValueDate]);

  const [year, day, month] = useMemo(() => {
    const currentYear = selectedValue.getFullYear();
    const currentDay = selectedValue.getDate();
    const currentMonth = selectedValue.getMonth();
    return [currentYear, currentDay, currentMonth];
  }, [selectedValue]);

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
      <div>
        {months[panelMonth]} {panelYear}
      </div>
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
          const isSelectedDate = cell.year === year && cell.month === month && cell.date === day;
          const isTodayDate = isToday(todayDate, cell);
          const isNotCurrent = cell.type !== 'current';
          return (
            <div
              title={cell.date + ' ' + months[panelMonth] + ' ' + cell.year}
              key={i}
              className={clsx(
                'calendarPanelItem',
                isSelectedDate && 'calendarPanelItem--selected',
                isTodayDate && 'calendarPanelItem--today',
                isNotCurrent && 'calendarPanelItem--not-current',
              )}
              onClick={() => onDateSelect(cell)}>
              <div className='calendarPanelItem--date'>{cell.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Datepicker;
