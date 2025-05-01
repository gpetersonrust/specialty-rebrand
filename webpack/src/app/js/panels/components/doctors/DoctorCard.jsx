import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DoctorCard = ({ id, name, selected, onClick, origin, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id.toString(),
    data: { origin },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`doctor-card ${selected ? 'selected' : ''} ${isOverlay ? 'drag-overlay' : ''}`}
    >
      {name} <span className="doctor-id">#{id}</span>
    </div>
  );
};


export default DoctorCard;
