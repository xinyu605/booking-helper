'use client';

import { type ChangeEvent, type FC } from 'react';

import type { Guest } from '@/lib/type';

import CustomInputNumber, {
  type CustomInputNumberProps,
} from '@/components/CustomInputNumber';

interface RoomCardRowProps
  extends Pick<CustomInputNumberProps, 'max' | 'name' | 'value' | 'onChange'> {
  description?: string;
  title: string;
}

const RoomCardRow: FC<RoomCardRowProps> = ({
  description,
  title,
  ...inputProps
}) => {
  return (
    <div className="flex justify-between">
      <div className="pt-2">
        <p>{title}</p>
        {description && <p className="text-slate-400">{description}</p>}
      </div>
      <CustomInputNumber {...inputProps} />
    </div>
  );
};

interface RoomCardProps extends Guest {
  availableGuest: Guest;
  onChange: (guest: Guest) => void;
}

const RoomCard: FC<RoomCardProps> = ({
  adult,
  availableGuest,
  child,
  onChange,
}) => {
  const handleChangeGuest =
    (type: 'adult' | 'child') => (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = +event.target.value;
      const newGuest =
        type === 'adult'
          ? { adult: newValue, child }
          : { adult, child: newValue };
      onChange(newGuest);
    };

  return (
    <div className="pt-2 pb-2 flex flex-col gap-2">
      <h3>{`房間：${adult + child} 人`}</h3>
      <RoomCardRow
        description="年齡 20+"
        max={availableGuest.adult + adult}
        title="大人"
        value={adult}
        onChange={handleChangeGuest('adult')}
      />
      <RoomCardRow
        max={availableGuest.child + child}
        title="小孩"
        value={child}
        onChange={handleChangeGuest('child')}
      />
    </div>
  );
};

export default RoomCard;
