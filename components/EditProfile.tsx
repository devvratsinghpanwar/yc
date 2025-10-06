"use client";

import { useState, useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/app/(root)/user/[id]/actions';
import ImageUploader from './ImageUploader';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';

interface EditProfileProps {
  user: {
    _id: string;
    bio: string;
  };
}

const initialState = {
    status: 'INITIAL' as const,
    message: '',
};

export default function EditProfile({ user }: EditProfileProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [imageAssetId, setImageAssetId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  // Listen for custom event to open the modal
  useEffect(() => {
    const handleOpenEditProfile = () => {
      setIsOpen(true);
    };

    window.addEventListener('openEditProfile', handleOpenEditProfile);

    return () => {
      window.removeEventListener('openEditProfile', handleOpenEditProfile);
    };
  }, []);

  useEffect(() => {
    if (state.status === 'SUCCESS') {
      toast({ title: 'Success', description: state.message });
      setIsOpen(false);
    } else if (state.status === 'ERROR') {
      toast({ title: 'Error', description: state.message, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Your Profile</h2>
            
            <form action={formAction}>
              <input type="hidden" name="userId" value={user._id} />
              
              <div className="flex flex-col items-center gap-6">
                <ImageUploader onUploadSuccess={setImageAssetId} />
                <input type="hidden" name="imageAssetId" value={imageAssetId || ''} />

                <div className="w-full">
                  <label htmlFor="bio" className="text-sm font-medium text-gray-700">Your Bio</label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={user.bio}
                    className="mt-1 h-28 text-black"
                    placeholder="Tell everyone a little about yourself..."
                  />
                </div>

                <div className="flex items-center justify-end gap-4 w-full mt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}