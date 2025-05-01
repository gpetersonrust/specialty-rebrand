// CreateTopLevelButton.jsx
import React from 'react';

const CreateTopLevelButton = ({ onAdd }) => {
  return (
    <div className="create-top-level">
      <button onClick={() => onAdd('add', null)}>
        + Create New Top-Level Specialty
      </button>
    </div>
  );
};

export default CreateTopLevelButton;