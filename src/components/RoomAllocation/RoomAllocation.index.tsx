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
  guest,
  rooms,
  onChange,
}) => {
  const { adult, child } = guest;

  const [allocation, setAllocation] = useState<RoomAllocation[]>(() => {
    const defaultRoomAllocation = getDefaultRoomAllocation(guest, rooms);
    return Array.from(
      { length: rooms.length },
      (_, idx) => defaultRoomAllocation[idx] || { adult: 0, child: 0, price: 0 }
    );
  });

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

  const handleChange = (index: number) => (guest: Guest) => {
    const newAllocation = allocation.toSpliced(index, 1, {
      ...guest,
      price: allocation[0].price,
    });
    setAllocation(newAllocation);
    onChange?.(newAllocation);
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
