// app/login/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { writeClient } from "@/sanity/lib/write-client"; // <-- Import Sanity write client

export async function login(formData: FormData) {
  // ... login function remains the same ...
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // --- HANDLE NEW FIELDS ---
  const bio = formData.get("bio") as string | null;
  const imageAssetId = formData.get("imageAssetId") as string | null;
  // --- END OF NEW FIELDS ---

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, username },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }
  if (!authData.user) {
    throw new Error("User was not created in Supabase. Please try again.");
  }

  try {
    const userDoc = {
      _id: authData.user.id,
      _type: "author",
      name: name,
      username: username,
      email: email,
      bio: bio || "", // Use bio from form or default to empty
      // Construct the Sanity image asset reference if an ID was provided
      image: imageAssetId
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAssetId,
            },
          }
        : null,
    };

    await writeClient.create(userDoc);
  } catch (sanityError) {
    console.error("Failed to create user in Sanity:", sanityError);
    throw new Error("A database error occurred during sign up.");
  }

  revalidatePath("/", "layout");
  redirect(`/auth/confirm?email=${encodeURIComponent(email)}`);
}

export async function signOut() {
  // ... signOut function remains the same ...
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
