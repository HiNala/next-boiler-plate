import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/services/blog'
import { PostForm } from '@/components/forms/post-form'

export const metadata: Metadata = {
  title: 'Edit Blog Post',
  description: 'Edit an existing blog post',
}

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  const initialData = {
    title: post.title,
    content: post.content,
    description: post.description || '',
    thumbnail: post.thumbnail || '',
    tags: post.tags || [],
    published: post.published,
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm initialData={initialData} postId={params.id} />
    </div>
  )
} 