import '../scss/app.scss'; // Import SCSS
console.log(specialtyRebrandData);
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import ManagePanel from './panels/ManagePanel';
import AssignPanel from './panels/AssignPanel';
import ImportExportPanel from './panels/ImportExportPanel';



const App = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const {siteUrl, nonce,restUrl } = specialtyRebrandData;
  const renderPanel = () => {

    switch (activeTab) {
      case 'manage':
        return <ManagePanel />;
      case 'assign':
        return <AssignPanel />;
      case 'import':
        return <ImportExportPanel />;
      default:
        return <ManagePanel />;
    }
  };

  return (
    <div className="koc-layout">
      <aside className="koc-sidebar">
        <button
          onClick={() => setActiveTab('manage')}
          className={`koc-sidebar__link ${activeTab === 'manage' ? 'koc-sidebar__link--active' : ''}`}
        >
          Manage Specialties
        </button>
        <button
          onClick={() => setActiveTab('assign')}
          className={`koc-sidebar__link ${activeTab === 'assign' ? 'koc-sidebar__link--active' : ''}`}
        >
          Assign Specialties
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`koc-sidebar__link ${activeTab === 'import' ? 'koc-sidebar__link--active' : ''}`}
        >
          Import / Export
        </button>
        <a href={siteUrl} className="koc-sidebar__link">
          Back to Front End
        </a>
      </aside>
      <main className="koc-main">
        {renderPanel()}
      </main>
    </div>
  );
};




// Mount the React App
const container = document.getElementById('specialties-admin-app');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('❌ specialties-admin-app container not found in DOM.');
}

// DOM cleanup for admin view
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded for Specialty Admin');

  const xSiteElement = document.querySelector('.x-site');
  if (xSiteElement) {
    xSiteElement.className = '';
    xSiteElement.style.width = '100%';

    console.log(xSiteElement);
    
  }

  const xMastheadElement = document.querySelector('.x-masthead');
  if (xMastheadElement) {
    xMastheadElement.remove();
  }

  const footerElement = document.querySelector('footer');
  if (footerElement) {
    footerElement.remove();
  }
});
