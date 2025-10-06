"use client";

interface EditProfileButtonProps {
  onEditClick: () => void;
}

export default function EditProfileButton({ onEditClick }: EditProfileButtonProps) {
  return (
    <button 
      className="primary_btn w-full text-center"
      onClick={onEditClick}
    >
      Edit Profile
    </button>
  );
}
