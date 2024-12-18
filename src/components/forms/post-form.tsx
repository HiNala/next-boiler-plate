import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
  initialData?: PostFormValues
  postId?: string
}

interface ApiError {
  path: string[]
  message: string
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      description: '',
      thumbnail: '',
      tags: [],
      published: false,
    },
  })

  async function onSubmit(data: PostFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/posts${postId ? `/${postId}` : ''}`, {
        method: postId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.errors) {
          error.errors.forEach((err: ApiError) => {
            form.setError(err.path[0] as keyof PostFormValues, {
              message: err.message,
            })
          })
          return
        }
        throw new Error(error.message || 'Failed to save post')
      }

      const post = await response.json()
      toast({
        title: postId ? 'Post updated' : 'Post created',
        description: postId ? 'Your post has been updated.' : 'Your post has been created.',
      })
      router.push(`/admin/blog/${post.id}/edit`)
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save post',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of your post"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be displayed in post previews and search results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here using Markdown"
                      className="min-h-[300px] font-mono"
                      {...field}
                    />
                  </FormControl>
                </TabsContent>
                <TabsContent value="preview">
                  <div className={cn(
                    "rounded-md border border-input bg-background px-3 py-2 min-h-[300px]",
                    "prose prose-sm md:prose-base lg:prose-lg dark:prose-invert"
                  )}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {field.value || '*No content yet*'}
                    </ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
              <FormDescription>
                Write your post content using Markdown. You can preview how it will look using the Preview tab.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                URL of the image to display as post thumbnail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this post visible to the public.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </Button>
      </form>
    </Form>
  )
} 