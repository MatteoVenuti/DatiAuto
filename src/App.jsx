import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EntryTable from './components/EntryTable';
import DailyKmForm from './components/DailyKmForm';
import RefuelForm from './components/RefuelForm';
import ChartsPage from './components/ChartsPage';
import pandaImg from './assets/panda.png'; // <-- aggiungi questa riga
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/entries')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  // Ordina per data decrescente (dal più recente)
  const sortedEntries = [...entries].sort((a, b) => {
    // Data formato gg/mm/aaaa
    const [da, ma, ya] = a.date.split('/');
    const [db, mb, yb] = b.date.split('/');
    const dateA = new Date(`${ya}-${ma}-${da}`);
    const dateB = new Date(`${yb}-${mb}-${db}`);
    return dateB - dateA;
  });

  // Aggiungi km al giorno corrente
  const handleAddKm = async (km) => {
    const today = new Date().toLocaleDateString('it-IT');
    // Cerca se esiste già una entry per oggi
    const existing = entries.find(e => e.date === today);
    if (existing) {
      // Aggiorna la entry esistente
      await fetch(`http://localhost:3001/entries/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ km })
      });
      setEntries(entries.map(e => e.date === today ? { ...e, km } : e));
    } else {
      // Crea una nuova entry
      const res = await fetch('http://localhost:3001/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          km,
          fuelLiters: '',
          refuel: false
        })
      });
      const data = await res.json();
      setEntries([...entries, data]);
    }
  };

  // Aggiungi rifornimento
  const handleRefuel = async (date, liters, refuelOdometer) => {
    const existing = entries.find(e => e.date === date);
    if (existing) {
      await fetch(`http://localhost:3001/entries/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fuelLiters: liters, refuelOdometer })
      });
      setEntries(entries.map(e => e.date === date ? { ...e, fuelLiters: liters, refuelOdometer } : e));
    } else {
      const res = await fetch('http://localhost:3001/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          km: 0,
          odometer: null,
          fuelLiters: liters,
          refuelOdometer
        })
      });
      const data = await res.json();
      setEntries([...entries, data]);
    }
  };

  // Inserisci questa funzione PRIMA del return
  const handleAddOdometer = async (odometer) => {
    const today = new Date().toLocaleDateString('it-IT');
    // Trova la entry più recente prima di oggi
    const previousEntry = [...entries]
      .filter(e => e.date !== today && e.odometer)
      .sort((a, b) => {
        const [da, ma, ya] = a.date.split('/');
        const [db, mb, yb] = b.date.split('/');
        const dateA = new Date(`${ya}-${ma}-${da}`);
        const dateB = new Date(`${yb}-${mb}-${db}`);
        return dateB - dateA;
      })[0];

    const km = previousEntry ? odometer - previousEntry.odometer : 0;

    const existing = entries.find(e => e.date === today);
    if (existing) {
      // Aggiorna la entry esistente
      await fetch(`http://localhost:3001/entries/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odometer, km })
      });
      setEntries(entries.map(e => e.date === today ? { ...e, odometer, km } : e));
    } else {
      // Crea una nuova entry
      const res = await fetch('http://localhost:3001/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          odometer,
          km,
          fuelLiters: ''
        })
      });
      const data = await res.json();
      setEntries([...entries, data]);
    }
  };

  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <img
            src={pandaImg}
            alt="Panda"
            style={{ width: 150}}
          />
          <nav>
            <ul>
              <li>
                <Link to="/">Tabella</Link>
              </li>
              <li>
                <Link to="/grafici">Grafici</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="forms-row">
                    <DailyKmForm onAddOdometer={handleAddOdometer} />
                    <RefuelForm onRefuel={handleRefuel} />
                  </div>
                  <EntryTable entries={sortedEntries} />
                </>
              }
            />
            <Route path="/grafici" element={<ChartsPage entries={sortedEntries} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
