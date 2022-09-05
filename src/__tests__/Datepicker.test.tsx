import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Datepicker, { DatepickerProps } from '../components/Datepicker';

const initialDate = new Date(2022, 7, 1);
const today = new Date(2022, 7, 2);

const TestApp = ({ value = initialDate, onChange, ...rest }: Partial<DatepickerProps>) => {
  const [date, setDate] = useState(value);

  const handleChange = (value: Date) => {
    onChange?.(value);
    setDate(value);
  };

  return <Datepicker value={date} onChange={handleChange} {...rest} />;
};

describe('Datepicker', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(today);
  });

  it('should show correct date in input', () => {
    render(<TestApp />);
    expect(screen.getByTestId('date-picker-input')).toHaveValue('01-08-2022');
  });

  it('should open popup when we click on input', () => {
    render(<TestApp />);
    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();
  });

  it('should close popup when we click outside', () => {
    render(<TestApp />);
    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();
    // close popup
    userEvent.click(document.documentElement);
    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();
  });

  it('should highlight today', () => {
    render(<TestApp />);
    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));

    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();

    const todayCells = screen
      .queryAllByTestId('date-picker-popup-cell')
      .filter((item) => item.classList.contains('calendarPanelItem__today'));

    expect(todayCells).toHaveLength(1);
    const todayCell = todayCells[0];
    expect(todayCell).toHaveTextContent(today.getDate().toString());
  });

  it('should highlight selected date', () => {
    const selectedDate = initialDate;
    render(<TestApp />);
    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));

    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();

    const selectedCells = screen
      .queryAllByTestId('date-picker-popup-cell')
      .filter((item) => item.classList.contains('calendarPanelItem__selected'));

    expect(selectedCells).toHaveLength(1);
    const selectedCell = selectedCells[0];
    expect(selectedCell).toHaveTextContent(selectedDate.getDate().toString());
  });

  it('should select date', () => {
    const onChange = jest.fn();
    render(<TestApp onChange={onChange} />);

    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));

    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();

    const selectCells = screen
      .getAllByTestId('date-picker-popup-cell')
      // get 15-th date
      .filter((item) => item.textContent === '15');

    expect(selectCells).toHaveLength(1);
    const cell = selectCells[0];

    userEvent.click(cell);

    // popup must be closed
    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();

    expect(onChange).toBeCalledWith(new Date(2022, 7, 15));
    expect(screen.getByTestId('date-picker-input')).toHaveValue('15-08-2022');
  });

  it.todo('should apply valid date from input on outside click');
  it.todo('should apply valid date from input on enter press');

  it.todo('should reset invalid date from input on outside click');
  it.todo('should update popup calendar when we update input value');

  it.todo('should show correct month in popup');

  it.todo('should move to the next month');
  it.todo('should move to the prev month');

  it.todo('should move to the next year');
  it.todo('should move to the prev year');
});

describe('min/max', () => {
  it.todo('should disable dates out of range');
  it.todo('highlight input with out of range date');
});
