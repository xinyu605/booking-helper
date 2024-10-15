'use client';

import {
  type ChangeEvent,
  type FocusEvent,
  type FC,
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import MinusIcon from '@/public/icons/minus.svg';
import PlusIcon from '@/public/icons/plus.svg';

import IconButton from '@/components/IconButton';

const iconSize = 32;

interface CustomInputNumberProps
  extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'disabled' | 'name' | 'onChange'
  > {
  max?: number | undefined;
  min?: number | undefined;
  step?: number | undefined;
  value?: number | undefined;
  onBlur?: (event: FocusEvent<HTMLButtonElement | HTMLInputElement>) => void;
}

const CustomInputNumber: FC<CustomInputNumberProps> = ({
  disabled,
  max,
  min = 0,
  name,
  step = 1,
  value = 0,
  onBlur,
  onChange,
}) => {
  const iconColor = disabled ? 'text-slate-400' : 'text-sky-600';

  const [inputValue, setInputValue] = useState(value);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = +event.target.value;
      if (Number.isNaN(newValue)) return;
      setInputValue(newValue);
      onChange?.(event);
    },
    [onChange]
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseDown = (type: 'plus' | 'minus') => () => {
    if (
      (type === 'plus' && inputValue === max) ||
      (type === 'minus' && inputValue === min)
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      setInputValue((prev) => {
        if (type === 'plus') {
          const newValue = prev + step;
          if (max === undefined) return newValue;
          return newValue >= max ? max : newValue;
        }
        const newValue = prev - step;
        return newValue <= min ? min : newValue;
      });
    }, 100);
  };

  const clearInterval = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;

    const event = {
      target: {
        name,
        value: inputValue.toString(),
      },
    } as ChangeEvent<HTMLInputElement>; // `Event` or `InputEvent` cannot be assignable to parameter of type 'ChangeEvent<HTMLInputElement>'

    handleChange(event); // To force the input's onChange triggered
  }, [handleChange, name, inputValue]);

  useEffect(() => {
    if (value === undefined) return;
    setInputValue(value);
  }, [value]);

  return (
    <div className="p-2 flex gap-2">
      <IconButton
        aria-label="minus"
        disabled={disabled}
        onBlur={onBlur}
        onMouseDown={handleMouseDown('minus')}
        onMouseLeave={clearInterval}
        onMouseUp={clearInterval}
      >
        <MinusIcon width={iconSize} height={iconSize} className={iconColor} />
      </IconButton>
      <input
        className="w-12 h-12 rounded-md border border-slate-300 text-center text-slate-700 disabled:text-slate-300"
        disabled={disabled}
        max={max}
        min={min}
        name={name}
        step={step}
        type="number"
        value={inputValue}
        onBlur={onBlur}
        onChange={handleChange}
      />
      <IconButton
        aria-label="plus"
        disabled={disabled}
        onBlur={onBlur}
        onMouseDown={handleMouseDown('plus')}
        onMouseLeave={clearInterval}
        onMouseUp={clearInterval}
      >
        <PlusIcon width={iconSize} height={iconSize} className={iconColor} />
      </IconButton>
    </div>
  );
};

export default CustomInputNumber;
