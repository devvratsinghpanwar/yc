// in /app/lib/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { formSchema } from "@/lib/validation"; // Make sure path is correct
import { revalidatePath } from "next/cache";

// Define the shape of the state our action will return
type FormState = {
  status: "INITIAL" | "SUCCESS" | "ERROR";
  message: string;
  fieldErrors?: Record<string, string | undefined>;
  id?: string; // We'll return the new document ID on success
};

export const createPitch = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  // 1. Authenticate User
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { status: "ERROR", message: "You must be logged in to create a pitch." };
  }
   // 2. Ensure a corresponding author document exists in Sanity
  // This document will have the same ID as the Supabase user
  const userDoc = {
    _id: user.id, // Use the Supabase user ID as the Sanity document ID
    _type: 'author', // The type of your author schema in Sanity
    name: user.user_metadata?.name || user.email, // Use name from metadata or fallback to email
    email: user.email,
    image: user.user_metadata?.avatar_url, // Use avatar from metadata
  };

  try {
    // createIfNotExists is an idempotent operation, safe to run every time.
    // It will only create the document if one with that _id doesn't already exist.
    await writeClient.createIfNotExists(userDoc);
  } catch (error) {
     console.error("Sanity user creation error:", error);
     return { status: "ERROR", message: "Could not create user profile in database." };
  }
  // --- END OF FIX ---

  // 2. Validate the form data with Zod
  const formValues = Object.fromEntries(formData.entries());
  const validationResult = await formSchema.safeParseAsync(formValues);

  if (!validationResult.success) {
    return {
      status: "ERROR",
      message: "Validation failed. Please check your inputs.",
      fieldErrors: Object.fromEntries(
        Object.entries(validationResult.error.flatten().fieldErrors).map(
          ([key, value]) => [key, value?.join(" ") ?? undefined]
        )
      ),
    };
  }

  const { title, description, category, link, pitch } = validationResult.data;
  const slug = slugify(title, { lower: true, strict: true });

  // 3. Try to create the document in Sanity
  try {
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image: link,
      slug: { _type: "slug", current: slug },
      author: { _type: "reference", _ref: user.id },
      pitch,
    };

    const result = await writeClient.create(startup);

    // Revalidate the homepage or relevant paths
    revalidatePath("/");

    return {
      status: "SUCCESS",
      message: "Pitch created successfully!",
      id: result._id, // Return the new ID
    };
  } catch (error) {
    console.error("Sanity write error:", error);
    return {
      status: "ERROR",
      message: "A server error occurred. Please try again later.",
    };
  }
};