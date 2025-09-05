// app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { writeClient } from '@/sanity/lib/write-client' // <-- Import Sanity write client

export async function login(formData: FormData) {
  // ... login function remains the same ...
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
      throw new Error(error.message)
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // 1. Get all fields from the form
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 2. Sign up the user in Supabase, passing extra data to user_metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This data is stored in the `user_metadata` field in Supabase
      data: {
        name: name,
        username: username,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // This is crucial: a user is created in Supabase Auth but not yet logged in.
  // We need the user object to proceed.
  if (!authData.user) {
      throw new Error("User was not created in Supabase. Please try again.");
  }
  
  // 3. Create the corresponding author document in Sanity
  try {
    const userDoc = {
      _id: authData.user.id, // Use the new Supabase user ID for the Sanity document ID
      _type: 'author',
      name: name,
      username: username,
      email: email,
      // Image and bio can be populated later
      image: null,
      bio: '',
    };
    
    // Use .create() because we know this user is new.
    await writeClient.create(userDoc);

  } catch (sanityError) {
    console.error("Failed to create user in Sanity:", sanityError);
    // Here you might want to handle this more gracefully,
    // maybe by deleting the Supabase user or flagging the account for sync.
    // For now, we'll throw an error.
    throw new Error("A database error occurred during sign up.");
  }

  revalidatePath('/', 'layout');
  // Supabase sends a confirmation email by default. 
  // You might want to redirect to a "please check your email" page instead of the homepage.
  redirect(`/auth/confirm?email=${encodeURIComponent(email)}`); 
}

export async function signOut() {
  // ... signOut function remains the same ...
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}