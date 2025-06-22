import React, { useState } from 'react';

function RefuelForm({ onRefuel }) {
  const [date, setDate] = useState('');
  const [liters, setLiters] = useState('');
  const [refuelOdometer, setRefuelOdometer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !liters || !refuelOdometer) return;
    // Convert date to gg/mm/aaaa
    const [yyyy, mm, dd] = date.split('-');
    const formattedDate = `${dd}/${mm}/${yyyy}`;
    onRefuel(formattedDate, liters, Number(refuelOdometer));
    setDate('');
    setLiters('');
    setRefuelOdometer('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Litri"
        value={liters}
        onChange={e => setLiters(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Chilometraggio"
        value={refuelOdometer}
        onChange={e => setRefuelOdometer(e.target.value)}
        required
      />
      <button type="submit">Aggiungi Rifornimento</button>
    </form>
  );
}

export default RefuelForm;