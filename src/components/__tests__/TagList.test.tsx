import { render, screen } from '@/utils/test-utils';
import { TagList } from '../TagList';
import { Tag } from '@prisma/client';

describe('TagList', () => {
  const mockTags: Tag[] = [
    {
      id: '1',
      name: 'React',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'TypeScript',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('renders a list of tags', () => {
    render(<TagList tags={mockTags} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders "No tags" when tags array is empty', () => {
    render(<TagList tags={[]} />);

    expect(screen.getByText('No tags')).toBeInTheDocument();
  });

  it('renders loading state when loading prop is true', () => {
    render(<TagList tags={[]} loading={true} />);

    expect(screen.getByText('Loading tags...')).toBeInTheDocument();
  });
}); 