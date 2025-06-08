import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ className, children }) => {
  return (
    <div className={cn('rounded-lg bg-white p-6 shadow-md dark:bg-slate-900', className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

export const CardTitle = ({ className, children }) => {
  return (
    <h3 className={cn('text-xl font-semibold text-slate-900 dark:text-white', className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-slate-400', className)}>
      {children}
    </p>
  );
};

export const CardContent = ({ className, children }) => {
  return <div className={cn('', className)}>{children}</div>;
};

export const CardFooter = ({ className, children }) => {
  return <div className={cn('mt-4 flex items-center', className)}>{children}</div>;
};

export default Card;
