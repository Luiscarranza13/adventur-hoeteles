import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, success, icon, ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full py-3 border-0 border-b-2 bg-gray-50 rounded-t-lg transition-all duration-200',
              'focus:outline-none focus:bg-white focus:ring-0',
              'placeholder:text-gray-300 text-sm text-gray-800',
              icon ? 'pl-10 pr-4' : 'px-4',
              hasError
                ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                : hasSuccess
                ? 'border-green-400 focus:border-green-500'
                : 'border-gray-200 focus:border-[#ffd600]',
              props.disabled && 'opacity-50 cursor-not-allowed bg-gray-100',
              className
            )}
            {...props}
          />
          {(hasError || hasSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError
                ? <AlertCircle size={15} className="text-red-400" />
                : <CheckCircle2 size={15} className="text-green-500" />}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={clsx('mt-1.5 text-xs flex items-center gap-1', hasError ? 'text-red-500' : 'text-gray-400')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
