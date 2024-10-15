import { getDefaultRoomAllocation } from '@/lib/getDefaultRoomAllocation';

test('allocate rooms to get the lowest price', () => {
  const allocation1 = getDefaultRoomAllocation({ adult: 4, child: 2 }, [
    {
      roomPrice: 1000,
      adultPrice: 200,
      childPrice: 100,
      capacity: 4,
    },
    {
      roomPrice: 0,
      adultPrice: 500,
      childPrice: 500,
      capacity: 4,
    },
    {
      roomPrice: 500,
      adultPrice: 300,
      childPrice: 200,
      capacity: 4,
    },
  ]);

  const allocation2 = getDefaultRoomAllocation({ adult: 16, child: 0 }, [
    { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
    { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
    { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
    { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 },
  ]);

  expect(allocation1).toEqual([
    { adult: 2, child: 0, price: 1000 },
    { adult: 2, child: 2, price: 1500 },
  ]);
  expect(allocation2).toEqual([
    {
      adult: 4,
      child: 0,
      price: 2500,
    },
    {
      adult: 4,
      child: 0,
      price: 2500,
    },
    {
      adult: 8,
      child: 0,
      price: 4000,
    },
  ]);
});

test('get empty array when the allocation failed.', () => {
  const allocation = getDefaultRoomAllocation({ adult: 0, child: 1 }, [
    { roomPrice: 1000, adultPrice: 500, childPrice: 300, capacity: 2 },
    { roomPrice: 500, adultPrice: 400, childPrice: 300, capacity: 4 },
    { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
  ]);

  expect(allocation).toEqual([]);
});
