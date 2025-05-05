import React, { useEffect, useState } from 'react';
import DoctorColumn from './components/doctors/DoctorColumn';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import DoctorCard from './components/doctors/DoctorCard';

const AssignPanel = ({ setActivePanel, selectedSpecialty, setSelectedSpecialty }) => {
  const [specialties, setSpecialties] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [draggingDoctor, setDraggingDoctor] = useState(null);
  const [doctorFilter, setDoctorFilter] = useState('');
  const [flash, setFlash] = useState(false);

  const nonce = specialtyRebrandData?.nonce;

  const currentSpecialtyName =
  typeof selectedSpecialty === 'object'
    ? selectedSpecialty.name
    : specialties.find(s => s.id === Number(selectedSpecialty))?.name || '';

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      fetchDoctorAssignments(selectedSpecialty);
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    }
  }, [selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('/wp-json/specialty-rebrand/v1/specialties', {
        headers: { 'X-WP-Nonce': nonce },
      });
      const data = await res.json();
      setSpecialties(flatten(data));
    } catch (err) {
      console.error('Error loading specialties', err);
    }
  };

  const flatten = (nodes, parentName = null) =>
    nodes.flatMap((node) => {
      const current = { ...node, parentName };
      const children = flatten(node.children || [], node.name);
      return [current, ...children];
    });

  const fetchDoctorAssignments = async (term) => {
    if (!term) {
      setAssigned([]);
      setUnassigned([]);
      return;
    }
    const termId = Number.isInteger(term) ? term : term.id;
    setLoadingAssignments(true);
    try {
      const res = await fetch(`/wp-json/specialty-rebrand/v1/assignments/by-specialty/${termId}`, {
        headers: { 'X-WP-Nonce': nonce },
      });
      const data = await res.json();
      setAssigned(data.assigned);
      setUnassigned(data.unassigned);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDrop = async ({ active, over }) => {
    if (!active || !over || over.id === active.data.current.origin) return;

    const ids = selectedIds.size ? Array.from(selectedIds) : [parseInt(active.id)];
    const action = over.id === 'assigned' ? 'add' : 'remove';

    try {
      let term_id = typeof selectedSpecialty === 'object' ? selectedSpecialty.id : Number(selectedSpecialty);
      
      await fetch('/wp-json/specialty-rebrand/v1/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
        body: JSON.stringify({
          physician_ids: ids,
          term_id: term_id,
          action,
        }),
      });

      const move = (from, to, ids) => {
        const moving = from.filter((d) => ids.includes(d.id));
        return [
          from.filter((d) => !ids.includes(d.id)),
          [...to, ...moving],
        ];
      };

      if (action === 'add') {
        const [newUnassigned, newAssigned] = move(unassigned, assigned, ids);
        setUnassigned(newUnassigned);
        setAssigned(newAssigned);
      } else {
        const [newAssigned, newUnassigned] = move(assigned, unassigned, ids);
        setAssigned(newAssigned);
        setUnassigned(newUnassigned);
      }

      setSelectedIds(new Set());
    } catch (err) {
      console.error('Drop update failed', err);
    }
  };

  const handleDragStart = (event) => {
    const draggedId = parseInt(event.active.id);
    const allDoctors = [...assigned, ...unassigned];
    const doctor = allDoctors.find((d) => d.id === draggedId);
    setDraggingDoctor(doctor);
  };

  const normalizedFilter = doctorFilter.trim().toLowerCase();

  const last_name_sort = (a, b) => {
    const removeSuffix = (name) => {
      const suffixes = ['jr.', 'sr.', 'ii', 'iii', 'iv'];
      const parts = name.toLowerCase().split(' ');
      return parts.filter((part) => !suffixes.includes(part)).join(' ');
    };

    const cleanNameA = removeSuffix(a.name);
    const cleanNameB = removeSuffix(b.name);

    const lastNameA = cleanNameA.split(' ').slice(-1)[0];
    const lastNameB = cleanNameB.split(' ').slice(-1)[0];

    if (lastNameA === lastNameB) {
      const firstNameA = cleanNameA.split(' ')[0];
      const firstNameB = cleanNameB.split(' ')[0];
      return firstNameA.localeCompare(firstNameB);
    }

    return lastNameA.localeCompare(lastNameB);
  };

  const filteredAssigned = assigned
    .filter((d) => d.name.toLowerCase().includes(normalizedFilter))
    .sort(last_name_sort);

  const filteredUnassigned = unassigned
    .filter((d) => d.name.toLowerCase().includes(normalizedFilter))
    .sort(last_name_sort);

  return (
    <div className="koc-panel">
      {currentSpecialtyName && (
  <h1 className="koc-heading">
    Assigning: <span className="highlight-specialty">{currentSpecialtyName}</span>
  </h1>
)}
 
      <div className="koc-controls">
        <select
          value={selectedSpecialty || ''}
          onChange={(e) => setSelectedSpecialty(Number(e.target.value))}
        >
          <option value="">-- Select Specialty --</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {selectedSpecialty && (
         <div className="koc-filter-row">
            <input
               style={{ width: '300px', marginBottom: "0 " }}
               
           type="text"
           value={doctorFilter}
           onChange={(e) => setDoctorFilter(e.target.value)}
           placeholder="Filter doctors by name..."
           className="doctor-search-input"
         />
         <button
           type="button"
           onClick={() => setActivePanel('manage')}
           className="koc-control-button"
           title="Return to Manage Specialties"
         >
           ↩ Back
         </button>
       </div>
        )}
      </div>

      {loadingAssignments && (
        <div className="koc-loading-message">Loading new options…</div>
      )}

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDrop}>
        <div className={`assign-columns ${flash ? 'flash-highlight' : ''}`}>
          <DoctorColumn
            id="unassigned"
            title="Unassigned"
            doctors={filteredUnassigned}
            selectedIds={selectedIds}
            onToggle={handleSelection}
          />
          <DoctorColumn
            id="assigned"
            title="Assigned"
            doctors={filteredAssigned}
            selectedIds={selectedIds}
            onToggle={handleSelection}
          />
        </div>

        <DragOverlay>
          {draggingDoctor ? (
            <DoctorCard
              id={draggingDoctor.id}
              name={draggingDoctor.name}
              selected={true}
              origin=""
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AssignPanel;
