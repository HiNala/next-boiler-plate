import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPosts } from '@/lib/services/blog'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest blog posts and articles',
}

export const revalidate = 3600 // Revalidate every hour

interface BlogPageProps {
  searchParams: {
    page?: string
    tag?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1
  const tag = searchParams.tag
  const postsPerPage = 10
  const skip = (page - 1) * postsPerPage

  const posts = await getPosts({
    take: postsPerPage,
    skip,
    published: true,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            {post.thumbnail && (
              <div className="relative h-48">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block mt-2"
                >
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {post.title}
                  </h2>
                </Link>
                {post.description && (
                  <p className="mt-3 text-base text-gray-500">
                    {post.description}
                  </p>
                )}
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  {post.author.avatar ? (
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={post.author.avatar}
                      alt={post.author.name || 'Author'}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {post.author.name || 'Anonymous'}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination - we'll implement this later */}
      <div className="mt-8 flex justify-center">
        {/* Pagination controls will go here */}
      </div>
    </div>
  )
} 