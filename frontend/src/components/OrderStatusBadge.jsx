import React from 'react';

const statusColors = {
  PENDING: 'badge-warning',
  PREPARING: 'badge-info',
  READY_FOR_PICKUP: 'badge-success',
  OUT_FOR_DELIVERY: 'badge-info',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-error',
  RETURN_REQUESTED: 'badge-warning',
  RETURN_APPROVED: 'badge-info',
  RETURNED: 'badge-success'
};

const OrderStatusBadge = ({ status }) => {
  const badgeClass = statusColors[status] || 'badge-default';
  
  return (
    <span className={`badge ${badgeClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default OrderStatusBadge;
