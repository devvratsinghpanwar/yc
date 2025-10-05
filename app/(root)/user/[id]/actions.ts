// app/(root)/user/[id]/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { writeClient } from '@/sanity/lib/write-client'
import { revalidatePath } from 'next/cache'

type ActionState = {
  status: 'SUCCESS' | 'ERROR' | 'INITIAL';
  message: string;
}

export async function updateProfile(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'ERROR', message: 'You must be logged in to update a profile.' }
  }

  const userId = formData.get('userId') as string
  const bio = formData.get('bio') as string | null
  const imageAssetId = formData.get('imageAssetId') as string | null

  console.log('Server Action received - Bio:', bio);
  console.log('Server Action received - Image Asset ID:', imageAssetId);

  // Security check: ensure the logged-in user is the one they're trying to edit
  if (user.id !== userId) {
    return { status: 'ERROR', message: 'Authorization failed.' }
  }

  try {
    const patch = writeClient.patch(userId); // Start a patch for the document with the user's ID

    if (bio !== null) {
      patch.set({ bio: bio });
    }

    if (imageAssetId) {
      patch.set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          }
        }
      });
    }

    await patch.commit(); // Commit the changes to Sanity

    // Revalidate the user's profile page to show the new data instantly
    revalidatePath(`/user/${userId}`);

    return { status: 'SUCCESS', message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Failed to update profile in Sanity:', error);
    return { status: 'ERROR', message: 'A database error occurred.' };
  }
}