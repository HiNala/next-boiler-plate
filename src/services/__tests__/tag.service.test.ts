import { TagService } from '../tag.service';
import { TagRepository } from '@/repositories/tag.repository';
import { Tag } from '@prisma/client';

// Mock the tag repository
jest.mock('@/repositories/tag.repository');

describe('TagService', () => {
  let tagService: TagService;
  let mockTagRepository: jest.Mocked<TagRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockTagRepository = new TagRepository() as jest.Mocked<TagRepository>;
    tagService = new TagService(mockTagRepository);
  });

  describe('createTag', () => {
    it('should create a tag successfully', async () => {
      const mockTag: Tag = {
        id: '1',
        name: 'Test Tag',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTagRepository.create.mockResolvedValue(mockTag);

      const result = await tagService.createTag({ name: 'Test Tag' });

      expect(result).toEqual(mockTag);
      expect(mockTagRepository.create).toHaveBeenCalledWith({ name: 'Test Tag' });
    });

    it('should throw an error if tag name is invalid', async () => {
      await expect(tagService.createTag({ name: '' }))
        .rejects
        .toThrow('Tag name must be between 1 and 50 characters');
    });
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const mockTags: Tag[] = [
        {
          id: '1',
          name: 'Tag 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Tag 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTagRepository.findAll.mockResolvedValue(mockTags);

      const result = await tagService.getAllTags();

      expect(result).toEqual(mockTags);
      expect(mockTagRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getTagById', () => {
    it('should return a tag by id', async () => {
      const mockTag: Tag = {
        id: '1',
        name: 'Test Tag',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTagRepository.findById.mockResolvedValue(mockTag);

      const result = await tagService.getTagById('1');

      expect(result).toEqual(mockTag);
      expect(mockTagRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if tag is not found', async () => {
      mockTagRepository.findById.mockResolvedValue(null);

      await expect(tagService.getTagById('1'))
        .rejects
        .toThrow('Tag not found');
    });
  });
}); 