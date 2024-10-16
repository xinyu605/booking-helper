import type { Guest, Room, RoomAllocation } from '@/lib/type';

interface RoomCost {
  cost: number;
  allocation: RoomAllocation[];
}

const initialRoomAllocation: RoomAllocation = {
  adult: 0,
  child: 0,
  price: 0,
};

export const getDefaultRoomAllocation = (
  guest: Guest,
  rooms: Room[]
): RoomAllocation[] => {
  const record: Record<string, RoomCost> = {};

  const getMinCost = (
    adult: number,
    child: number,
    roomIdx: number
  ): RoomCost => {
    if (adult === 0 && child === 0) {
      return {
        cost: 0,
        allocation: [],
      };
    }

    if (roomIdx >= rooms.length) {
      return { cost: Infinity, allocation: [] };
    }

    const key = `${adult}-${child}-${roomIdx}`;
    if (record[key] !== undefined) return record[key];

    const { capacity, roomPrice, adultPrice, childPrice } = rooms[roomIdx];
    let minCost: RoomCost = { cost: Infinity, allocation: [] };

    /** Condition1: Skip current room and allocate next room directly. */
    const nextRoomCost = getMinCost(adult, child, roomIdx + 1);
    if (nextRoomCost.cost !== Infinity) {
      minCost = {
        cost: nextRoomCost.cost,
        allocation: [initialRoomAllocation].concat(nextRoomCost.allocation),
      };
    }

    /** Condition2: Iterate all the allocation of each room. */
    for (let a = 1; a <= Math.min(adult, capacity); a += 1) {
      for (let c = 0; c <= Math.min(child, capacity - a); c += 1) {
        /** If the room has children, there must be at least one adult in the room. */
        if (c > 0 && a === 0) continue;

        const cost = roomPrice + adultPrice * a + childPrice * c;
        const remainingCost = getMinCost(adult - a, child - c, roomIdx + 1);

        if (remainingCost.cost !== Infinity) {
          const totalCost = cost + remainingCost.cost;

          if (totalCost < minCost.cost) {
            minCost = {
              cost: totalCost,
              allocation: [
                { adult: a, child: c, price: cost },
                ...remainingCost.allocation,
              ],
            };
          }
        }
      }
    }
    record[key] = minCost;
    return minCost;
  };

  const { adult, child } = guest;
  const minCost = getMinCost(adult, child, 0);

  if (minCost.cost === Infinity) return [];

  const remainingEmptyRooms = Array.from(
    { length: rooms.length - minCost.allocation.length },
    () => initialRoomAllocation
  );
  const defaultRooms = minCost.allocation.concat(remainingEmptyRooms);

  return defaultRooms;
};
