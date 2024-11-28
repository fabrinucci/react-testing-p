import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('<Button />', () => {
  it('Should render the button', () => {
    render(<Button label='Click' />);

    const button = screen.getByText('Click');
    expect(button).toBeInTheDocument();
  });

  it('Should call the onClick function', async () => {
    const handleClick = vi.fn();
    render(<Button label='Click' onClick={handleClick} />);

    const button = screen.getByRole('button');
    await act(() => fireEvent.click(button));

    expect(handleClick).toBeCalled();
    expect(handleClick).toBeCalledTimes(1);
  });
});
