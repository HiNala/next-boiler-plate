'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TagFilterProps {
  tags: string[];
  onTagSelect?: (tag: string) => void;
}

export function TagFilter({ tags, onTagSelect }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get('tag')
  );

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      onTagSelect?.(null);
      router.push('/blog');
    } else {
      setSelectedTag(tag);
      onTagSelect?.(tag);
      router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTag === tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
} 