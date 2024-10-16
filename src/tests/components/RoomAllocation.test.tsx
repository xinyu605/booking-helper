import React from 'react';
import { render, screen } from '@testing-library/react';

import RoomAllocation, {
  type RoomAllocationProps,
} from '@/components/RoomAllocation/RoomAllocation.index';

const mockData1: Pick<RoomAllocationProps, 'guest' | 'rooms'> = {
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

const mockOnChange = jest.fn();

describe('render RoomAllocation and display default room allocation list', () => {
  it('should render title and unallocated description', () => {
    render(<RoomAllocation {...mockData1} onChange={mockOnChange} />);

    const titleElement = screen.getByLabelText('all guests');
    const descriptionElement = screen.getByLabelText('unallocated guests');
    const liElements = screen.getAllByRole('listitem');

    expect(titleElement).toHaveTextContent(
      '住客人數：4 位大人，2 位小孩 / 3 房'
    );
    expect(descriptionElement).toHaveTextContent(
      '尚未分配人數：0 位大人，0 位小孩'
    );
    expect(liElements).toHaveLength(3);
  });
});
