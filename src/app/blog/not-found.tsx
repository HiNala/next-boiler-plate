import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p className="text-gray-600 mb-8">
        Sorry, the blog post you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/blog"
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  )
} 