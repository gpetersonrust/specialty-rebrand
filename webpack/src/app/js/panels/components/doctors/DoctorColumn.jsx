import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import DoctorCard from './DoctorCard';
 

const DoctorColumn = ({ id, title, doctors, selectedIds, onToggle }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="doctor-column">
      <h3>{title}</h3>
      {doctors.map(doc => (
        <DoctorCard
          key={doc.id}
          id={doc.id}
          name={doc.name}
          selected={selectedIds.has(doc.id)}
          onClick={() => onToggle(doc.id)}
          origin={id}
        />
      ))}
    </div>
  );
};

export default DoctorColumn;
