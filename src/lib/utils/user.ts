import { User } from '@supabase/supabase-js';
import { Row } from '@/types/database.types';

export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'created_at' in value
  );
}

export function isProfile(value: unknown): value is Row<'profiles'> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value
  );
}

export function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Value is not a valid User');
  }
}

export function assertProfile(value: unknown): asserts value is Row<'profiles'> {
  if (!isProfile(value)) {
    throw new Error('Value is not a valid Profile');
  }
}

export function getUserRole(user: User | null): string {
  if (!user) return 'anonymous';
  return user.user_metadata.role || 'user';
}

export function hasPermission(user: User | null, requiredRole: string): boolean {
  const userRole = getUserRole(user);
  const roles = ['anonymous', 'user', 'admin', 'superadmin'];
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
} 