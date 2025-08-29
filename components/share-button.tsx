"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function ShareButton({ 
  title, 
  text, 
  url, 
  className,
  variant = 'outline',
  size = 'sm'
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    // Check if native sharing is available (mainly mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        document.body.removeChild(textArea);
      }
    }
  }, [title, text, url]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={cn(
        "gap-2 touch-manipulation",
        copied && "bg-green-50 border-green-200 text-green-700",
        className
      )}
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {size !== 'sm' && 'Copiado'}
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          {size !== 'sm' && 'Compartir'}
        </>
      )}
    </Button>
  );
}

/**
 * Hook for sharing functionality
 */
export function useShare() {
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(async (data: { title: string; text: string; url: string }) => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        return { method: 'clipboard' };
      }
      return { method: 'native' };
    } catch (error) {
      throw error;
    } finally {
      setIsSharing(false);
    }
  }, []);

  const isNativeShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  return {
    share,
    isSharing,
    isNativeShareSupported,
  };
}