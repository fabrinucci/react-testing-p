import { useState } from 'react';

interface CounterProps {
  defaultValue: number;
}

export const Counter = ({ defaultValue }: CounterProps) => {
  const [counter, setCounter] = useState(Math.max(defaultValue, 0));

  const handleDecrement = () => setCounter(counter > 0 ? counter - 1 : counter);
  const handleIncrement = () => setCounter(counter + 1);
  const handleReset = () => setCounter(0);

  return (
    <div>
      <h2 data-testid='Counter'>Counter: {counter}</h2>
      <button onClick={handleDecrement}>-1</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleIncrement}>+1</button>
      Counter
    </div>
  );
};
