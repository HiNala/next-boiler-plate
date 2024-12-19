import { NextResponse } from 'next/server';
import { getPostsByTag } from '@/lib/services/blog';
import { ApiError } from '@/lib/errors';

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const { tag } = params;
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag parameter is required' },
        { status: 400 }
      );
    }

    const posts = await getPostsByTag(tag);
    return NextResponse.json({ posts });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 