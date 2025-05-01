import React, { useEffect, useState } from 'react';
 
import DoctorColumn from './components/doctors/DoctorColumn';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import DoctorCard from './components/doctors/DoctorCard';
 

 

const AssignPanel = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [draggingDoctor, setDraggingDoctor] = useState(null);
  const [doctorFilter, setDoctorFilter] = useState('');




  const nonce = specialtyRebrandData?.nonce;

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) fetchDoctorAssignments(selectedSpecialty); // Fetch assignments when a specialty is selected
  }, [selectedSpecialty]); // when selectedSpecialty changes run this effect

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('/wp-json/specialty-rebrand/v1/specialties', {
        headers: { 'X-WP-Nonce':specialtyRebrandData.nonce },
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

  const fetchDoctorAssignments = async (termId) => {
    setLoadingAssignments(true); // Start loading state

    try {
      const res = await fetch(`/wp-json/specialty-rebrand/v1/assignments/by-specialty/${termId}`, {
        headers: { 'X-WP-Nonce': specialtyRebrandData.nonce },
      });
      const data = await res.json();
      setAssigned(data.assigned);
      setUnassigned(data.unassigned);
     
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    } finally {
      setLoadingAssignments(false); // End loading state
    }
  };

  const handleSelection = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDrop = async ({ active, over }) => {
    // Early return: if no item dragged, or dropped into same list, skip processing
    if (!active || !over || over.id === active.data.current.origin) return;
  
    // Determine which doctor(s) are being moved:
    // - Use selected IDs if multi-select is active
    // - Otherwise use the one that was dragged
    const ids = selectedIds.size ? Array.from(selectedIds) : [parseInt(active.id)];
  
    // Decide the action based on the drop target
    // - If dropped into "assigned" → we are adding the specialty
    // - If dropped into "unassigned" → we are removing the specialty
    const action = over.id === 'assigned' ? 'add' : 'remove';
  
    try {
      // Call backend API to apply the change
      await fetch('/wp-json/specialty-rebrand/v1/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
        body: JSON.stringify({
          physician_ids: ids,
          term_id: Number(selectedSpecialty),
          action,
        }),
      });
  
      // Helper to move doctors between lists after successful API call
      const move = (from, to, ids) => {
        const moving = from.filter(d => ids.includes(d.id)); // Doctors being moved
        return [
          from.filter(d => !ids.includes(d.id)), // Remove from "from" list
          [...to, ...moving],                    // Add to "to" list
        ];
      };
  
      // Update UI state based on the action type
      if (action === 'add') {
        const [newUnassigned, newAssigned] = move(unassigned, assigned, ids);
        setUnassigned(newUnassigned);
        setAssigned(newAssigned);
      } else {
        const [newAssigned, newUnassigned] = move(assigned, unassigned, ids);
        setAssigned(newAssigned);
        setUnassigned(newUnassigned);
      }
  
      // Clear selection after drop
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Drop update failed', err);
    }
  };
  

  const handleDragStart = (event) => {
    const draggedId = parseInt(event.active.id);
    const allDoctors = [...assigned, ...unassigned];
    const doctor = allDoctors.find(d => d.id === draggedId);
    setDraggingDoctor(doctor);
  };
  const normalizedFilter = doctorFilter.trim().toLowerCase();

const filteredAssigned = assigned.filter(d =>
  d.name.toLowerCase().includes(normalizedFilter)
);
const filteredUnassigned = unassigned.filter(d =>
  d.name.toLowerCase().includes(normalizedFilter)
);
  return (
    
    <div className="koc-panel">
      <h2>Assign Specialties</h2>
      <div className="koc-controls">
        <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}>
          <option value="">-- Select Specialty --</option>
          {specialties.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {selectedSpecialty && (
  <div className="koc-filter mt-3">
    <input
      type="text"
      value={doctorFilter}
      onChange={e => setDoctorFilter(e.target.value)}
      placeholder="Filter doctors by name..."
      className="doctor-search-input"
    />
  </div>
)}
      </div>
      {loadingAssignments && (
        <div className="koc-loading-message">Loading new options…</div>
      )}

      <DndContext
        
        onDragStart={handleDragStart}
        onDragEnd={handleDrop}>
        <div className="assign-columns">
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
              origin="" // Doesn't matter here
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AssignPanel;
