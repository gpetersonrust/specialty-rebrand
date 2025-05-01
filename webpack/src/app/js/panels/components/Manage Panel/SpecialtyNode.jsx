// SpecialtyNode.jsx
import React, { useState } from 'react';

const SpecialtyNode = ({ node, onAdd, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="specialty-node"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="specialty-label">
        {node.name}
        {hovered && (
          <span className="specialty-actions">
            <button onClick={() => onAdd('add', node)}>➕</button>
            <button onClick={() => onEdit('edit', node)}>✏️</button>
            <button onClick={() => onDelete(node.id)}>🗑️</button>
          </span>
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="specialty-children">
          {node.children.map((child) => (
            <SpecialtyNode
              key={child.id}
              node={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialtyNode;
