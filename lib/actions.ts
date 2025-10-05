// in /app/lib/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { formSchema } from "@/lib/validation"; // Make sure path is correct
import { revalidatePath } from "next/cache";
import { client } from "@/sanity/lib/client";

// Define the shape of the state our action will return
export type FormState = {
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

  const { title, description, category, link, imageAssetId, uploadedImageUrl, pitch } = validationResult.data;
  const slug = slugify(title, { lower: true, strict: true });

  // 3. Try to create the document in Sanity
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startup: any = {
      _type: "startup",
      title,
      description,
      category,
      slug: { _type: "slug", current: slug },
      author: { _type: "reference", _ref: user.id },
      pitch,
    };

    // Handle image - either URL or uploaded asset
    if (imageAssetId && uploadedImageUrl) {
      // Use uploaded image
      startup.imageAsset = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAssetId,
        },
      };
      startup.image = uploadedImageUrl; // Also store the URL for easy access
    } else if (link) {
      // Use URL image
      startup.image = link;
    }

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

export const updateStartup = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  try {
    // Get the current user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "ERROR",
        message: "You must be logged in to update a startup.",
      };
    }

    // Get form data
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const pitch = formData.get("pitch") as string;
    const imageUrl = formData.get("link") as string;
    const imageAssetId = formData.get("imageAssetId") as string;



    if (!id) {
      return {
        status: "ERROR",
        message: "Startup ID is required.",
      };
    }

    // Verify ownership
    const existingStartup = await client.fetch(
      `*[_type == "startup" && _id == $id][0]{
        _id,
        author -> {
          _id
        }
      }`,
      { id }
    );

    if (!existingStartup) {
      return {
        status: "ERROR",
        message: "Startup not found.",
      };
    }

    if (existingStartup.author?._id !== user.id) {
      return {
        status: "ERROR",
        message: "You can only edit your own startups.",
      };
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      title,
      description,
      category,
      pitch,
    };

    // Handle image updates
    if (imageAssetId && imageAssetId.trim() !== "") {
      // User uploaded a new image
      updateData.imageAsset = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAssetId.trim(),
        },
      };
      // Clear the old image URL if it exists
      updateData.image = null;
    } else if (imageUrl && imageUrl.trim() !== "") {
      // User provided an image URL
      updateData.image = imageUrl.trim();
      // Clear the old image asset if it exists
      updateData.imageAsset = null;
    }

    // Update the startup
    await writeClient
      .patch(id)
      .set(updateData)
      .commit();

    // Revalidate paths
    revalidatePath("/");
    revalidatePath(`/startup/${id}`);
    revalidatePath(`/user/${user.id}`);

    return {
      status: "SUCCESS",
      message: "Your startup has been updated successfully!",
      id,
    };
  } catch (error) {
    console.error("Error updating startup:", error);
    return {
      status: "ERROR",
      message: "A server error occurred. Please try again later.",
    };
  }
};