import { Metadata } from 'next'
import { PostForm } from '@/components/forms/post-form'

export const metadata: Metadata = {
  title: 'New Blog Post',
  description: 'Create a new blog post',
}

export default function NewPostPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostForm />
    </div>
  )
} 