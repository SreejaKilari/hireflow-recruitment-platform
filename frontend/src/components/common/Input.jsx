import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  icon = null,
  required = false,
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: style?.marginBottom !== undefined ? style.marginBottom : undefined }}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="form-control"
          style={{
            ...style,
            paddingLeft: icon ? '2.75rem' : (style.paddingLeft || '1rem'),
            borderColor: error ? 'var(--color-danger)' : style.borderColor,
            width: '100%',
          }}
          {...props}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && (
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
