export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
   
    const authenticatedUser = await auth();

  
    if (!authenticatedUser) {
      return NextResponse.json({ message: 'You must be signed in to view flashcard collections' }, { status: 401 });
    }

   
    const userId = authenticatedUser.user?.id;

   
    if (!userId) {
      return NextResponse.json({ message: 'User ID is not available' }, { status: 400 });
    }

 
    const flashcardCollections = await db.flashcardCollection.findMany({
      where: {
        userId: userId, 
      },
      include: {
        flashcards: true,  
        categories: true,  
      },
    });

   
    return NextResponse.json(flashcardCollections);
  } catch (error) {
    console.error('Error fetching flashcard collections:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
