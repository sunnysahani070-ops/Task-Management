import React from 'react';

const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  wrapperClassName = '',
  as = 'input',
  ...props
}, ref) => {
  const Component = as;
  
  const baseInputStyles = "block w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:disabled:bg-slate-900";
  
  const inputStateStyles = error 
    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-400 dark:placeholder-red-500/50" 
    : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400";
    
  const paddingStyles = Icon ? "pl-10 pr-3 py-2" : "px-3 py-2";
  
  const classes = `${baseInputStyles} ${inputStateStyles} ${paddingStyles} ${className}`;

  return (
    <div className={`space-y-1 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <Component
          id={id}
          type={as === 'input' ? type : undefined}
          className={classes}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
