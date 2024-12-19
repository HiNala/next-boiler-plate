export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          published: boolean
          authorId: string
          createdAt: string
          updatedAt: string
          slug: string
          excerpt: string | null
          coverImage: string | null
          tags: string[]
        }
        Insert: {
          id?: string
          title: string
          content: string
          published?: boolean
          authorId: string
          createdAt?: string
          updatedAt?: string
          slug: string
          excerpt?: string | null
          coverImage?: string | null
          tags?: string[]
        }
        Update: {
          id?: string
          title?: string
          content?: string
          published?: boolean
          authorId?: string
          updatedAt?: string
          slug?: string
          excerpt?: string | null
          coverImage?: string | null
          tags?: string[]
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          authorId: string
          postId: string
          createdAt: string
          updatedAt: string
          parentId: string | null
        }
        Insert: {
          id?: string
          content: string
          authorId: string
          postId: string
          createdAt?: string
          updatedAt?: string
          parentId?: string | null
        }
        Update: {
          id?: string
          content?: string
          authorId?: string
          postId?: string
          updatedAt?: string
          parentId?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          updatedAt?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 