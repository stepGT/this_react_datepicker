import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Datepicker from '../components/Datepicker';

describe('Datepicker', () => {
  it('should show correct date in input', () => {
    render(<Datepicker value={new Date(2022, 7, 1)} onChange={() => {}} />);
    expect(screen.getByTestId('date-picker-input')).toHaveValue('01-08-2022');
  });

  it('should open popup when we click on input', () => {
    render(<Datepicker value={new Date(2022, 7, 1)} onChange={() => {}} />);
    // open popup
    userEvent.click(screen.getByTestId('date-picker-input'));
    // close popup
    userEvent.click(document.documentElement);

    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();
  });

  it('should close popup when we click outside', () => {
    render(<Datepicker value={new Date(2022, 7, 1)} onChange={() => {}} />);
    userEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.queryByTestId('date-picker-popup')).toBeInTheDocument();
  });

  it.todo('should highlight today');
  it.todo('should highlight selected date');

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
