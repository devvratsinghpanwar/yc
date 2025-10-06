"use client";

import EditProfile from "@/components/EditProfile";
import EditProfileButton from "@/components/EditProfileButton";

interface UserProfileClientProps {
  user: {
    _id: string;
    bio: string;
  };
  isOwner: boolean;
}

export default function UserProfileClient({ user, isOwner }: UserProfileClientProps) {
  // const handleEditClick = () => {
  //   const event = new CustomEvent('openEditProfile');
  //   window.dispatchEvent(event);
  // };

  if (!isOwner) {
    return null;
  }

  return (
    <>
      {/* Edit Profile Modal - renders as overlay */}
      <EditProfile user={user} />
    </>
  );
}

// Export a separate component for the button that can be used in the profile card
export function EditProfileButtonWrapper({ isOwner }: UserProfileClientProps) {
  const handleEditClick = () => {
    const event = new CustomEvent('openEditProfile');
    window.dispatchEvent(event);
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className="mt-6 w-full px-4">
      <EditProfileButton onEditClick={handleEditClick} />
    </div>
  );
}
