import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Loader = ({ size = 24, className }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        size={size}
        className={cn('animate-spin text-primary-600 dark:text-primary-400', className)}
      />
    </div>
  );
};

export default Loader;
