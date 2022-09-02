import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Datepicker from '../components/Datepicker';

const initialDate = new Date(2022, 7, 1);
const today = new Date(2022, 7, 2);

describe('Datepicker', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(today);
  });

  it('should show correct date in input', () => {
    render(<Datepicker value={initialDate} onChange={() => {}} />);
    expect(screen.getByTestId('date-picker-input')).toHaveValue('01-08-2022');
  });

  it('should open popup when we click on input', () => {
    render(<Datepicker value={initialDate} onChange={() => {}} />);
    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));
    // close popup
    userEvent.click(document.documentElement);

    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();
  });

  it('should close popup when we click outside', () => {
    render(<Datepicker value={initialDate} onChange={() => {}} />);
    userEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();
  });

  it('should highlight today', () => {
    render(<Datepicker value={initialDate} onChange={() => {}} />);
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
    render(<Datepicker value={selectedDate} onChange={() => {}} />);
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

  it.todo('should select date');

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
