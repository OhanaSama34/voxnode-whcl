import { cn } from '@/lib/utils';
import { IconBubbleTextFilled } from '@tabler/icons-react';
import React from 'react';
import { Link } from 'react-router';

export const AppLogo = ({ className }: { className?: string | null }) => {
  return (
    <div className={cn('w-fit', className)}>
      <Link to="/">
        <div className="flex gap-1 py-1 px-2 items-center group">
          <img src="/VOXNODE.svg" alt="Voxnode Logo" width={100} />
        </div>
      </Link>
    </div>
  );
};
