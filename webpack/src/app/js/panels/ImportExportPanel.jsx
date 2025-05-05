import React, { useState } from 'react';

const ImportExportPanel = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const handleExport = async () => {
    try {
      const res = await fetch('/wp-json/specialty-rebrand/v1/export/json', {
        headers: { 'X-WP-Nonce': specialtyRebrandData.nonce },
      });
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'specialty-export.json';
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setUploadPreview(json);
      } catch (err) {
        console.error('Invalid JSON file');
        setUploadPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!uploadPreview) {
      alert('No valid JSON file selected');
      return;
    }

    try {
      const res = await fetch('/wp-json/specialty-rebrand/v1/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': specialtyRebrandData.nonce,
        },
        body: JSON.stringify(uploadPreview),
      });

      const result = await res.json();
      alert('Import completed: ' + JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Import failed', err);
    }
  };

  return (
    <div className="koc-panel">
      <h2>Import / Export Panel</h2>

      <section className="export-section">
        <button className="koc-button" onClick={handleExport}>Download Export JSON</button>
      </section>

      <section className="import-section mt-4">
        <label htmlFor="importFile">Import JSON File:</label>
        <input
          id="importFile"
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
        {uploadPreview && (
          <pre className="import-preview">
            {JSON.stringify(uploadPreview, null, 2).slice(0, 1000)}...
          </pre>
        )}
        <button
          className="koc-button mt-2"
          onClick={handleImport}
          disabled={!uploadPreview}
        >
          Submit Import
        </button>
      </section>
    </div>
  );
};

export default ImportExportPanel;
