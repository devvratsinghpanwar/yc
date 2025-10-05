// lib/upvote-actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { writeClient } from '@/sanity/lib/write-client'
import { client } from '@/sanity/lib/client'
import { revalidatePath } from 'next/cache'

type UpvoteActionState = {
  status: 'SUCCESS' | 'ERROR' | 'INITIAL';
  message: string;
  upvotes?: number;
  hasUpvoted?: boolean;
}

export async function toggleUpvote(
  prevState: UpvoteActionState,
  formData: FormData,
): Promise<UpvoteActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'ERROR', message: 'You must be logged in to upvote.' }
  }

  const startupId = formData.get('startupId') as string

  if (!startupId) {
    return { status: 'ERROR', message: 'Startup ID is required.' }
  }

  try {
    // First, get the current startup data
    const startup = await client.fetch(
      `*[_type == "startup" && _id == $id][0]{
        _id,
        upvotes,
        "upvotedBy": upvotedBy[]->_id
      }`,
      { id: startupId }
    )

    if (!startup) {
      return { status: 'ERROR', message: 'Startup not found.' }
    }

    const currentUpvotes = startup.upvotes || 0
    const upvotedByUsers = startup.upvotedBy || []
    const hasUserUpvoted = upvotedByUsers.includes(user.id)

    let newUpvotes: number
    let newUpvotedBy: string[]

    if (hasUserUpvoted) {
      // User is removing their upvote
      newUpvotes = Math.max(0, currentUpvotes - 1)
      newUpvotedBy = upvotedByUsers.filter((userId: string) => userId !== user.id)
    } else {
      // User is adding their upvote
      newUpvotes = currentUpvotes + 1
      newUpvotedBy = [...upvotedByUsers, user.id]
    }

    // Update the startup document
    await writeClient
      .patch(startupId)
      .set({
        upvotes: newUpvotes,
        upvotedBy: newUpvotedBy.map(userId => ({
          _type: 'reference',
          _ref: userId,
        })),
      })
      .commit()

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath(`/startup/${startupId}`)

    return {
      status: 'SUCCESS',
      message: hasUserUpvoted ? 'Upvote removed!' : 'Startup upvoted!',
      upvotes: newUpvotes,
      hasUpvoted: !hasUserUpvoted,
    }
  } catch (error) {
    console.error('Failed to toggle upvote:', error)
    return { status: 'ERROR', message: 'Failed to update upvote. Please try again.' }
  }
}

// Helper function to get upvote status for a user
export async function getUpvoteStatus(startupId: string, userId?: string) {
  if (!userId) return { upvotes: 0, hasUpvoted: false }

  try {
    const result = await client.fetch(
      `*[_type == "startup" && _id == $id][0]{
        upvotes,
        "hasUpvoted": $userId in upvotedBy[]->_id
      }`,
      { id: startupId, userId }
    )

    return {
      upvotes: result?.upvotes || 0,
      hasUpvoted: result?.hasUpvoted || false,
    }
  } catch (error) {
    console.error('Failed to get upvote status:', error)
    return { upvotes: 0, hasUpvoted: false }
  }
}
