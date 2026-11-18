import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  style = {},
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
