import React, { useState } from 'react';

function DailyKmForm({ onAddOdometer }) {
  const [odometer, setOdometer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!odometer) return;
    onAddOdometer(Number(odometer));
    setOdometer('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="number"
        placeholder="Chilometraggio"
        value={odometer}
        onChange={e => setOdometer(e.target.value)}
        required
      />
      <button type="submit">Aggiungi KM</button>
    </form>
  );
}

export default DailyKmForm;