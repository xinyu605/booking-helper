import { type FC } from 'react';

import RoomAllocation, {
  type RoomAllocationProps,
} from '@/components/RoomAllocation/RoomAllocation.index';

// TODO: remove mockData
const mockData: Pick<RoomAllocationProps, 'guest' | 'rooms'> = {
  guest: {
    adult: 4,
    child: 2,
  },
  rooms: [
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
  ],
};

const Accommodation: FC = () => {
  return (
    <div>
      <RoomAllocation {...mockData} />
    </div>
  );
};

export default Accommodation;
