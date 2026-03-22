import React from 'react';

interface PriceFormatterProps {
  price: number;
  className?: string;
}

export const PriceFormatter: React.FC<PriceFormatterProps> = React.memo(({
  price,
  className = '',
}) => {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return <span className={className}>{formattedPrice}</span>;
});

PriceFormatter.displayName = 'PriceFormatter';
