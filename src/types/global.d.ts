// Global type definitions
import { User } from '@supabase/supabase-js';
import { Database } from './database.types';

declare global {
  // Supabase
  type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
  type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
  type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
  type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
  type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

  // Auth
  interface UserSession {
    user: User | null;
    isLoading: boolean;
  }

  // Error Handling
  interface ApiError {
    message: string;
    code?: string;
    status?: number;
  }

  interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
  }

  // Environment Variables
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
  }
}

export {}; 