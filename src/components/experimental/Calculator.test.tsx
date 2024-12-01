import { render, screen } from '@testing-library/react';
import { Calculator } from './Calculator';

describe('add function', () => {
  const useCasesTest = [
    { a: 2, b: 3, operation: 'add', expected: 5 },
    { a: 5, b: 3, operation: 'subtract', expected: 2 },
    { a: 2, b: 3, operation: 'multiply', expected: 6 },
    { a: 6, b: 3, operation: 'divide', expected: 2 },
    { a: 6, b: 0, operation: 'divide', expected: 'Error' },
  ];

  it.each(useCasesTest)(
    `should return $expected for the $operation between $a and $b`,
    ({ a, b, expected, operation }) => {
      render(<Calculator a={a} b={b} operation={operation} />);
      const section = screen.getByTestId('calculate-section');
      expect(section).toHaveTextContent(`Result: ${expected}`);
    }
  );
});
