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

  it('should apply valid date from input on outside click', () => {
    const onChange = jest.fn();
    render(<TestApp onChange={onChange} />);

    const input = screen.getByTestId('date-picker-input');

    userEvent.clear(input);
    userEvent.type(input, '31-08-2022');

    // outside click
    userEvent.click(document.documentElement);

    expect(onChange).toBeCalledWith(new Date(2022, 7, 31));
  });

  it('should reset invalid date from input on outside click', () => {
    const initialDateString = '01-08-2022';

    const onChange = jest.fn();
    render(<TestApp onChange={onChange} />);

    const input = screen.getByTestId('date-picker-input');

    userEvent.clear(input);
    userEvent.type(input, '32-08-2022');

    // outside click
    userEvent.click(document.documentElement);

    expect(onChange).not.toBeCalled();
    expect(input).toHaveValue(initialDateString);
  });

  it('should show correct month in popup', () => {
    const initialDatePopupString = 'Aug 2022';

    render(<TestApp />);

    const input = screen.getByTestId('date-picker-input');

    // open popup
    userEvent.click(input);

    expect(screen.getByTestId('date-picker-popup-month')).toHaveTextContent(initialDatePopupString);
  });

  it('should move to the next month', () => {
    const initialDatePopupString = 'Aug 2022';

    render(<TestApp />);

    const input = screen.getByTestId('date-picker-input');

    // open popup
    userEvent.click(input);

    const nextMonthButton = screen.getByTestId('date-picker-popup-next-month');
    const popupMonth = screen.getByTestId('date-picker-popup-month');

    expect(popupMonth).toHaveTextContent(initialDatePopupString);

    userEvent.click(nextMonthButton);

    expect(popupMonth).toHaveTextContent('Sep 2022');

    userEvent.click(nextMonthButton);

    expect(popupMonth).toHaveTextContent('Oct 2022');
  });

  it('should move to the prev month', () => {
    const initialDatePopupString = 'Aug 2022';

    render(<TestApp />);

    const input = screen.getByTestId('date-picker-input');

    // open popup
    userEvent.click(input);

    const prevMonthButton = screen.getByTestId('date-picker-popup-prev-month');
    const popupMonth = screen.getByTestId('date-picker-popup-month');

    expect(popupMonth).toHaveTextContent(initialDatePopupString);

    userEvent.click(prevMonthButton);

    expect(popupMonth).toHaveTextContent('Jul 2022');

    userEvent.click(prevMonthButton);

    expect(popupMonth).toHaveTextContent('Jun 2022');
  });

  it.todo('should apply valid date from input on enter press');
  it.todo('should update popup calendar when we update input value');

  it.todo('should move to the next year');
  it.todo('should move to the prev year');
});

describe('min/max', () => {
  it.todo('should disable dates out of range');
  it.todo('highlight input with out of range date');
});
