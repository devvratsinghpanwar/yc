// components/DeleteStartupButton.tsx
"use client";

import { useState, useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteStartup } from '@/lib/startup-actions';
import { Button } from './ui/button';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteStartupButtonProps {
  startupId: string;
  authorId: string;
  startupTitle: string;
}

const initialState = {
  status: 'INITIAL' as const,
  message: '',
};

export default function DeleteStartupButton({ 
  startupId, 
  authorId, 
  startupTitle 
}: DeleteStartupButtonProps) {
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteStartup, initialState);

  useEffect(() => {
    if (state.status === 'SUCCESS') {
      toast({ 
        title: 'Success', 
        description: state.message,
        className: 'bg-green-50 border-green-200 text-green-800'
      });
      setShowConfirm(false);
    } else if (state.status === 'ERROR') {
      toast({ 
        title: 'Error', 
        description: state.message, 
        variant: 'destructive' 
      });
    }
  }, [state, toast]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
      >
        <Trash2 size={16} />
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border-4 border-black">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-bold text-black mb-2">
                Delete Startup
              </h3>
              
              <p className="text-sm text-black-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">&quot;{startupTitle}&quot;</span>?
                This action cannot be undone.
              </p>

              <form action={formAction} className="flex gap-3 justify-center">
                <input type="hidden" name="startupId" value={startupId} />
                <input type="hidden" name="authorId" value={authorId} />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="border-2 border-black hover:bg-gray-50"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700 text-white border-2 border-black font-semibold"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
