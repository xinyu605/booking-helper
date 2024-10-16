'use client';

import type { Guest, Room, RoomAllocation } from '@/lib/type';
import { useMemo, useState, type FC } from 'react';
import { getDefaultRoomAllocation } from '@/lib/getDefaultRoomAllocation';

import RoomCard from '@/components/RoomAllocation/RoomCard';

export interface RoomAllocationProps {
  guest: Guest;
  rooms: Room[];
  onChange?: (result: RoomAllocation[]) => void;
}

const RoomAllocation: FC<RoomAllocationProps> = ({
  guest: initialGuest,
  rooms,
  onChange,
}) => {
  const { adult, child } = initialGuest;

  const [allocation, setAllocation] = useState<RoomAllocation[]>(() =>
    getDefaultRoomAllocation(initialGuest, rooms)
  );

  const availableGuest = useMemo(
    () =>
      allocation.reduce<Guest>(
        (prev, curr) => ({
          adult: prev.adult - curr.adult,
          child: prev.child - curr.child,
        }),
        { adult, child }
      ),
    [adult, allocation, child]
  );

  const handleChange = (index: number) => (newGuest: Guest) => {
    setAllocation((prev) => {
      const newAllocation = prev.toSpliced(index, 1, {
        ...newGuest,
        price: prev[index].price,
      });
      onChange?.(newAllocation);
      return newAllocation;
    });
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl text-slate-700 font-bold">{`住客人數：${adult} 位大人，${child} 位小孩 / ${rooms.length} 房`}</h2>
        <div className="p-4 border border-sky-500 bg-sky-50 rounded-md">
          <p className="text-slate-700">{`尚未分配人數：${availableGuest.adult} 位大人，${availableGuest.child} 位小孩`}</p>
        </div>
        <ul>
          {allocation.map(({ adult, child }, i) => (
            // TODO: If the list item may be created or deleted dynamically, add unique id in original data and regard it as key of list item
            <li
              key={`${adult}-${child}-${i}`}
              className="pt-2 [&:not(:last-child)]:border-b border-slate-200"
            >
              <RoomCard
                adult={adult}
                availableGuest={availableGuest}
                child={child}
                onChange={handleChange(i)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomAllocation;
