import { fireEvent, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { Counter } from './Counter';

describe('Test Counter', () => {
  it('Should be in the document', () => {
    render(<Counter defaultValue={0} />);

    const counter = screen.getByText('Counter: 0');
    expect(counter).toBeInTheDocument();
  });

  it('Should increment counter', () => {
    render(<Counter defaultValue={10} />);

    const counter = screen.getByTestId('Counter');
    const incrementButton = screen.getByRole('button', { name: '+1' });

    expect(counter).toBeInTheDocument();
    expect(counter).toHaveTextContent('Counter: 10');

    fireEvent.click(incrementButton);

    expect(counter).toHaveTextContent('Counter: 11');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(counter).toHaveTextContent('Counter: 15');
  });

  it('Should decrement counter', async () => {
    render(<Counter defaultValue={5} />);

    const counter = screen.getByTestId('Counter');
    const decrementButton = screen.getByRole('button', { name: '-1' });

    expect(counter).toHaveTextContent('Counter: 5');

    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);

    expect(counter).toHaveTextContent('Counter: 3');
  });

  it('Should reset counter', async () => {
    render(<Counter defaultValue={15} />);

    const counter = screen.getByTestId('Counter');
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(counter).toHaveTextContent('Counter: 15');
    fireEvent.click(resetButton);

    expect(counter).toHaveTextContent('Counter: 0');
  });

  it('Should not decrement when counter value is 0', async () => {
    render(<Counter defaultValue={0} />);

    const counter = screen.getByTestId('Counter');
    const decrementButton = screen.getByRole('button', { name: '-1' });

    expect(counter).toHaveTextContent('Counter: 0');

    fireEvent.click(decrementButton);

    expect(counter).toHaveTextContent('Counter: 0');

    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);
    expect(counter).toHaveTextContent('Counter: 0');
  });

  it('Should be 0 when default value is negative', async () => {
    render(<Counter defaultValue={-5} />);

    const counter = screen.getByTestId('Counter');
    expect(counter).toHaveTextContent('Counter: 0');
  });
});
