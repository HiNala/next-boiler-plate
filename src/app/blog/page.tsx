import { Suspense } from 'react';
import { getPosts } from '@/lib/services/blog';
import { TagFilter } from '@/components/blog/TagFilter';

export const revalidate = 3600; // Revalidate every hour

async function getAllTags() {
  const posts = await getPosts();
  const tags = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const [posts, tags] = await Promise.all([getPosts(), getAllTags()]);

  const filteredPosts = searchParams.tag
    ? posts.filter(post => post.tags.includes(searchParams.tag!))
    : posts;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <Suspense fallback={<div>Loading tags...</div>}>
        <TagFilter tags={tags} />
      </Suspense>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-card rounded-lg shadow-md overflow-hidden"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">
                {post.excerpt || post.content.slice(0, 150) + '...'}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-secondary rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
} 