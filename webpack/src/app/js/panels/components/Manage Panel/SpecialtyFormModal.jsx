// SpecialtyFormModal.jsx
import React, { useState, useEffect } from 'react';

const SpecialtyFormModal = ({ mode, target, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [targetId, setTargetId] = useState(null);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && target) {
      setName(target.name);
      setTargetId(target.id);
    } else if (mode === 'add' && target) {
      setName('');
      setParentId(target.id);
    } else {
      setName('');
      setParentId(null);
    }
  }, [mode, target]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEdit = mode === 'edit';
    onSubmit(name, targetId, parentId, isEdit);
  };

  return (
    <div className="specialty-modal-overlay">
      <div className="specialty-modal">
        <h3>{mode === 'edit' ? 'Edit Specialty' : 'Add New Specialty'}</h3>
        <form onSubmit={handleSubmit}>
          {mode === 'add' && target && (
            <div className="parent-preview">
              <label>Parent Specialty</label>
              <div className="parent-name">{target.name}</div>
            </div>
          )}

          {mode === 'edit' && target && (
            <div className="edit-preview">
              <label>Editing Term ID:</label>
              <div className="term-id">{target.id}</div>
            </div>
          )}

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Specialty name"
            required
          />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialtyFormModal;
