import { cn } from '@/lib/utils';
import { IconBubbleTextFilled } from '@tabler/icons-react';
import React from 'react';
import { Link } from 'react-router';

export const AppLogo = ({ className }: { className?: string | null }) => {
  return (
    <div className={cn('w-fit', className)}>
      <Link to="/">
        <div className="flex gap-1 py-1 px-2 items-center group">
          <IconBubbleTextFilled
            size={24}
            className="transform group-hover:rotate-12 group-hover:scale-120 origin-center transition"
          />
          <span className="-mr-1 transform group-hover:translate-y-0.5 transition">
            vox
          </span>
          <span className="font-bold transform group-hover:-translate-y-0.5 transition">
            node
            <span className="opacity-0 group-hover:opacity-100 transition">
              .
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
};
