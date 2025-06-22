import React, { useState } from 'react';

function EntryForm({ onAdd }) {
  const [date, setDate] = useState('');
  const [km, setKm] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !km) return;
    onAdd({
      date,
      km: Number(km),
      ...(fuelLiters && { fuelLiters: Number(fuelLiters) })
    });
    setDate('');
    setKm('');
    setFuelLiters('');
  };

  const liters =
    fuelLiters !== null
      ? parseFloat(fuelLiters.replace(',', '.'))
      : null;

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="number" placeholder="KM" value={km} onChange={e => setKm(e.target.value)} required />
      <input type="number" placeholder="Litri benzina (opzionale)" value={fuelLiters} onChange={e => setFuelLiters(e.target.value)} />
      <button type="submit">Aggiungi</button>
    </form>
  );
}

export default EntryForm;