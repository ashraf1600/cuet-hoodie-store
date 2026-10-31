import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs uppercase font-bold tracking-wider text-paper/90 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-brick-bright">*</span>}
        </span>
      </label>

      <input
        {...props}
        required={required}
        className={`w-full bg-ink-3 border rounded-xs px-3.5 py-2.5 font-body text-sm text-paper placeholder:text-muted-dark focus:outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-line focus:border-paper'
        } ${props.disabled ? 'opacity-60 cursor-not-allowed bg-ink' : ''} ${className}`}
      />

      {error ? (
        <span className="font-body text-xs text-red-400">{error}</span>
      ) : helperText ? (
        <span className="font-body text-[11px] text-muted-dark">{helperText}</span>
      ) : null}
    </div>
  );
};

export default FormInput;
