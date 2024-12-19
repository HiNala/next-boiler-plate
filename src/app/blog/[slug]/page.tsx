import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/services/blog'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/lib/types/blog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug)
    
    return {
      title: post.title,
      description: post.description || `Read ${post.title} on our blog`,
      openGraph: post.thumbnail ? {
        images: [{ url: post.thumbnail }],
      } : undefined,
    }
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getPostBySlug(params.slug)

    return (
      <article className="container mx-auto py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.description && (
            <p className="text-xl text-gray-600 mb-4">{post.description}</p>
          )}
          <div className="flex items-center text-gray-600">
            <div className="flex items-center">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name || 'Author'}
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-2" />
              )}
              <span className="font-medium">{post.author.name || 'Anonymous'}</span>
            </div>
            <span className="mx-2">•</span>
            <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
              {formatDate(post.publishedAt || post.createdAt)}
            </time>
          </div>
        </header>

        {post.thumbnail && (
          <div className="relative w-full h-[400px] mb-8">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t">
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    )
  } catch (error) {
    notFound()
  }
} 