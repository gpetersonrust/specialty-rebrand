// ManagePanel.jsx
import React, { useEffect, useState } from 'react';
import CreateTopLevelButton from './components/Manage Panel/ CreateTopLevelButton';
import SpecialtyFormModal from './components/Manage Panel/SpecialtyFormModal';

const ManagePanel = ({ setActivePanel, selectedSpecialty, setSelectedSpecialty }) => {
  const [flatTree, setFlatTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeForm, setActiveForm] = useState(null); // { mode: 'add' | 'edit', node: {} | null }

  useEffect(() => {
    fetchTree();
  }, []);

  const flattenSpecialties = (nodes, parentName = null) => {
    return nodes.flatMap(node => {
      const current = { ...node, parentName };
      const children = flattenSpecialties(node.children || [], node.name);
      return [current, ...children];
    });
  };

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await fetch('/wp-json/specialty-rebrand/v1/specialties', {
        headers: {
          'X-WP-Nonce': specialtyRebrandData.nonce,
        },
      });
      const data = await res.json();
      const flattened = flattenSpecialties(data);
      setFlatTree(flattened);
    } catch (err) {
      console.error('Failed to load specialties', err);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (mode, node = null) => {
    setActiveForm({ mode, node });
  };

  const closeForm = () => {
    setActiveForm(null);
  };

  const handleSubmit = async (name, targetId, parentId, isEdit = false) => {
    const url = isEdit
      ? `/wp-json/specialty-rebrand/v1/specialties/${targetId}`
      : '/wp-json/specialty-rebrand/v1/specialties';
  
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit ? { name } : { name, adult_name: parentId };
  
    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': specialtyRebrandData.nonce,
        },
        body: JSON.stringify(body),
      });
      closeForm();
      fetchTree();
    } catch (err) {
      console.error('Failed to submit specialty', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/wp-json/specialty-rebrand/v1/specialties/${id}`, {
        method: 'DELETE',
        headers: {
          'X-WP-Nonce': specialtyRebrandData.nonce,
        },
      });
      fetchTree();
    } catch (err) {
      console.error('Failed to delete specialty', err);
    }
  };

  const filteredTree = flatTree.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="koc-panel">
      <h2>Manage Specialties</h2>
      <section className="koc-controls">
        <CreateTopLevelButton onAdd={() => openForm('add', null)} />

        <div className="koc-filter">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search specialties..."
          />
        </div>
      </section>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="specialty-grid">
          {filteredTree.map((node) => (
            <div
              data-term_id={node.id}
              key={node.id}
              className="specialty-card"
            >
              {node.parentName && (
                <div className="specialty-parent">Parent: {node.parentName}</div>
              )}
              <div className="specialty-label">
                <h3>{node.name}</h3>
              </div>
              <div className="specialty-actions">
                <button className="btn btn-add" onClick={() => openForm('add', node)} title="Add child specialty">➕ Add</button>
                <button className="btn btn-edit" onClick={() => openForm('edit', node)} title="Edit specialty">✏️ Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(node.id)} title="Delete specialty">🗑️ Delete</button>
                <button className="btn btn-assign" onClick={() => { setSelectedSpecialty(node); setActivePanel('assign'); }} title="Assign physicians to this specialty">🧬 Assign</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeForm && (
        <SpecialtyFormModal
          mode={activeForm.mode}
          target={activeForm.node}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default ManagePanel;
