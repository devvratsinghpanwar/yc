// lib/startup-actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { writeClient } from '@/sanity/lib/write-client'
import { revalidatePath } from 'next/cache'

type ActionState = {
  status: 'SUCCESS' | 'ERROR' | 'INITIAL';
  message: string;
}

export async function deleteStartup(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'ERROR', message: 'You must be logged in to delete a startup.' }
  }

  const startupId = formData.get('startupId') as string
  const authorId = formData.get('authorId') as string

  // Security check: ensure the logged-in user is the author of the startup
  if (user.id !== authorId) {
    return { status: 'ERROR', message: 'You can only delete your own startups.' }
  }

  try {
    // Delete the startup from Sanity
    await writeClient.delete(startupId)

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath(`/user/${user.id}`)

    return { status: 'SUCCESS', message: 'Startup deleted successfully!' }
  } catch (error) {
    console.error('Failed to delete startup:', error)
    return { status: 'ERROR', message: 'Failed to delete startup. Please try again.' }
  }
}
