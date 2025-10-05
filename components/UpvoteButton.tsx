// components/UpvoteButton.tsx
"use client";

import { useState, useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toggleUpvote } from '@/lib/upvote-actions';
import { Button } from './ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpvoteButtonProps {
  startupId: string;
  initialUpvotes: number;
  initialHasUpvoted: boolean;
  isLoggedIn: boolean;
}

const initialState = {
  status: 'INITIAL' as const,
  message: '',
  upvotes: 0,
  hasUpvoted: false,
};

export default function UpvoteButton({ 
  startupId, 
  initialUpvotes, 
  initialHasUpvoted,
  isLoggedIn 
}: UpvoteButtonProps) {
  const { toast } = useToast();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [state, formAction, isPending] = useActionState(toggleUpvote, initialState);

  useEffect(() => {
    if (state.status === 'SUCCESS') {
      toast({ 
        title: 'Success', 
        description: state.message,
        className: 'bg-green-50 border-green-200 text-green-800'
      });
      
      // Update local state with the new values
      if (typeof state.upvotes === 'number') {
        setUpvotes(state.upvotes);
      }
      if (typeof state.hasUpvoted === 'boolean') {
        setHasUpvoted(state.hasUpvoted);
      }
    } else if (state.status === 'ERROR') {
      toast({ 
        title: 'Error', 
        description: state.message, 
        variant: 'destructive' 
      });
    }
  }, [state, toast]);

  const handleUpvote = () => {
    if (!isLoggedIn) {
      toast({
        title: 'Login Required',
        description: 'Please log in to upvote startups.',
        variant: 'destructive'
      });
      return;
    }

    // Optimistic update
    const newHasUpvoted = !hasUpvoted;
    const newUpvotes = newHasUpvoted ? upvotes + 1 : Math.max(0, upvotes - 1);
    
    setHasUpvoted(newHasUpvoted);
    setUpvotes(newUpvotes);
  };

  return (
    <form action={formAction} onSubmit={handleUpvote}>
      <input type="hidden" name="startupId" value={startupId} />
      
      <Button
        type="submit"
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 transition-all duration-200 border-2 border-black shadow-100 hover:shadow-none font-semibold",
          hasUpvoted 
            ? "bg-primary text-white hover:bg-primary/90" 
            : "bg-white text-black hover:bg-primary-100"
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              hasUpvoted ? "fill-current" : ""
            )} 
          />
        )}
        
        <span className="font-bold">
          {upvotes}
        </span>
        
        <span className="max-sm:hidden">
          {hasUpvoted ? 'Upvoted' : 'Upvote'}
        </span>
      </Button>
    </form>
  );
}
