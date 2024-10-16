import React, { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import CustomInputNumber, {
  CustomInputNumberProps,
} from '@/components/CustomInputNumber';

const mockOnChange = jest.fn();

const renderCustomInputNumber = (
  props?: Omit<CustomInputNumberProps, 'name' | 'onChange'>
) => {
  const value = props?.value || 0;
  const { rerender } = render(
    <CustomInputNumber
      {...props}
      name="counter"
      value={value}
      onChange={mockOnChange}
    />
  );

  const inputElement = screen.getByDisplayValue(`${value}`);
  const minusButtonElement = screen.getByLabelText('minus');
  const plusButtonElement = screen.getByLabelText('plus');

  return { inputElement, minusButtonElement, plusButtonElement, rerender };
};

describe('basic behaviors of CustomInputNumber component', () => {
  it('should render with initial value', () => {
    expect.assertions(1);

    const { inputElement } = renderCustomInputNumber();
    expect(inputElement).toBeInTheDocument();
  });

  it('should update value when value prop change', () => {
    expect.assertions(2);

    const { inputElement, rerender } = renderCustomInputNumber();
    expect(inputElement).toHaveValue(0);

    rerender(<CustomInputNumber value={2} onChange={mockOnChange} />);
    expect(inputElement).toHaveValue(2);
  });

  it('should call onChange when input value changes', () => {
    expect.assertions(2);

    const { inputElement } = renderCustomInputNumber();

    fireEvent.change(inputElement, { target: { name: 'counter', value: 2 } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: 'counter', value: '2' }),
      })
    );
  });
});

describe('interaction between buttons and input value', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('click plus button to increase value by step', () => {
    expect.assertions(2);

    const { inputElement, plusButtonElement } = renderCustomInputNumber();

    fireEvent.mouseDown(plusButtonElement);
    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(inputElement).toHaveValue(1);
  });

  it('keep pressing plus button should not call onChange if the value is max', () => {
    expect.assertions(3);

    const { inputElement, plusButtonElement } = renderCustomInputNumber({
      max: 2,
    });

    fireEvent.mouseDown(plusButtonElement);

    expect(mockOnChange).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(400);
    });
    fireEvent.mouseUp(plusButtonElement);

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(inputElement).toHaveValue(2);
  });

  it('keep pressing minus button should not call onChange if the value is min', () => {
    expect.assertions(2);

    const { inputElement, minusButtonElement } = renderCustomInputNumber({
      value: 3,
    });

    fireEvent.mouseDown(minusButtonElement);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    fireEvent.mouseUp(minusButtonElement);

    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(inputElement).toHaveValue(0);
  });

  it('buttons and input should be disabled when the disabled prop is true', () => {
    expect.assertions(4);

    const { inputElement, minusButtonElement, plusButtonElement } =
      renderCustomInputNumber({
        disabled: true,
      });

    expect(inputElement).toBeDisabled();
    expect(minusButtonElement).toBeDisabled();
    expect(plusButtonElement).toBeDisabled();
    expect(plusButtonElement).toHaveStyle({
      backgroundColor: 'rgb(203 213 225 / var(--tw-text-opacity))',
      borderColor: 'rgb(148 163 184 / var(--tw-border-opacity))',
    });
  });

  it('adjust step prop to increase or decrease value as need', () => {
    expect.assertions(2);

    const { inputElement, plusButtonElement } = renderCustomInputNumber({
      step: 3,
    });

    fireEvent.mouseDown(plusButtonElement);
    expect(inputElement).toHaveValue(3);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    fireEvent.mouseUp(plusButtonElement);
    expect(inputElement).toHaveValue(9);
  });
});
