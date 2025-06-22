import React from 'react';
import '../App.css';

function EntryTable({ entries }) {
  // Ordina per data decrescente (dal più recente)
  const sortedEntries = [...entries].sort((a, b) => {
    const [da, ma, ya] = a.date.split('/');
    const [db, mb, yb] = b.date.split('/');
    return new Date(`${yb}-${mb}-${db}`) - new Date(`${ya}-${ma}-${da}`);
  });

  // Calcolo km cumulativi in ordine cronologico (dal più vecchio al più recente)
  const entriesAsc = [...sortedEntries].slice().reverse();
  const cumulativeKmAsc = [];
  let kmTotal = 0;
  for (let entry of entriesAsc) {
    const val = parseFloat(entry.km);
    if (!isNaN(val)) {
      kmTotal += val;
      cumulativeKmAsc.push(kmTotal);
    } else {
      cumulativeKmAsc.push('-');
    }
  }
  // Inverti per riallinearli all’ordine decrescente della tabella
  const cumulativeKm = cumulativeKmAsc.reverse();

  // Calcolo parziali
  let lastRefuelOdo = null;
  let lastOdo = null;
  const partials = [...sortedEntries]
    .slice()
    .reverse()
    .map((entry) => {
      if (entry.refuelOdometer) {
        lastRefuelOdo = entry.refuelOdometer;
      } else if (entry.fuelLiters && entry.fuelLiters !== "") {
        lastRefuelOdo = entry.odometer;
      }
      let partial = '-';
      if (lastRefuelOdo !== null && entry.odometer !== undefined) {
        partial = entry.odometer - lastRefuelOdo;
      } else if (lastOdo !== null && entry.odometer !== undefined) {
        partial = entry.odometer - lastOdo;
      }
      lastOdo = entry.odometer;
      return partial;
    })
    .reverse();

  // Calcolo KM tra pieni e KM/L
  let previousRefuelOdo = null;
  const kmBetweenRefuels = [];
  const kmPerLiter = [];

  for (let i = sortedEntries.length - 1; i >= 0; i--) {
    const entry = sortedEntries[i];
    const currentRefuelOdo =
      entry.refuelOdometer ||
      (entry.fuelLiters && entry.fuelLiters !== "" ? entry.odometer : null);
    const currentLiters =
      entry.fuelLiters && entry.fuelLiters !== "" ? parseFloat(entry.fuelLiters) : null;

    if (previousRefuelOdo != null && currentRefuelOdo != null) {
      const km = Math.abs(previousRefuelOdo - currentRefuelOdo);
      kmBetweenRefuels.unshift(km);
    } else {
      kmBetweenRefuels.unshift('-');
    }

    if (
      kmBetweenRefuels[0] !== '-' &&
      currentLiters &&
      !isNaN(currentLiters)
    ) {
      const kml = kmBetweenRefuels[0] / currentLiters;
      kmPerLiter.unshift(kml.toFixed(3));
    } else {
      kmPerLiter.unshift('-');
    }

    if (currentRefuelOdo != null) {
      previousRefuelOdo = currentRefuelOdo;
    }
  }

  // Trova l'ultimo indice di ogni nuova soglia delle migliaia
  const highlightKmFattiIdx = [];
  let lastThousands = null;
  cumulativeKm.forEach((val, idx) => {
    if (typeof val === 'number') {
      const currThousands = Math.floor(val / 1000);
      if (currThousands !== lastThousands) {
        // Rimuovi l'ultimo se esiste, così resta solo l'ultimo di ogni gruppo
        if (highlightKmFattiIdx.length > 0) {
          highlightKmFattiIdx.pop();
        }
      }
      highlightKmFattiIdx.push(idx);
      lastThousands = currThousands;
    }
  });

  // Trova l'indice del valore massimo dei km giornalieri
  const kmValues = sortedEntries.map(e => parseFloat(e.km));
  const maxKm = Math.max(...kmValues.filter(v => !isNaN(v)));
  const maxKmIdx = kmValues.findIndex(v => v === maxKm);

  return (
    <div className="dashboard-table-container">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>KM</th>
            <th>KM fatti</th>
            <th>KM totali</th>
            <th>Parziale</th>
            <th>Litri</th>
            <th>Rifornimento</th>
            <th>KM/L</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, idx) => {
            const km = kmBetweenRefuels[idx];
            const litersStr = entry.fuelLiters?.toString().trim() || '';
            const liters = litersStr ? parseFloat(litersStr.replace(',', '.')) : null;
            const kml = (km !== '-' && liters) ? (km / liters).toFixed(3) : '-';
            const highlightKmFatti = !highlightKmFattiIdx.includes(idx);

            // Calcolo classe colore per KM singoli
            let kmClass = "";
            const kmValue = parseFloat(entry.km);
            if (!isNaN(kmValue)) {
              if (idx === maxKmIdx) kmClass = "km-max";
              else if (kmValue === 0) kmClass = "km-zero";
              else if (kmValue > 100) kmClass = "km-cento";
            }

            return (
              <tr key={entry.id || idx}>
                <td>{entry.date}</td>
                <td className={kmClass}>{entry.km}</td>
                <td className={highlightKmFatti ? "highlight-green" : ""}>
                  {cumulativeKm[idx]}
                </td>
                <td>{entry.odometer || '-'}</td>
                <td>{partials[idx]}</td>
                <td className={litersStr ? "highlight" : ""}>
                  {litersStr || '-'}</td>
                <td>
                  {entry.refuelOdometer || (litersStr ? entry.odometer : '-')}
                  {km !== '-' ? ` (${km})` : ''}
                </td>
                <td>{kml}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EntryTable;
