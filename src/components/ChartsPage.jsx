import React, { useState } from "react";

// Raggruppa per mese
function groupByMonth(entries) {
  const grouped = {};
  entries.forEach((entry) => {
    // Assumendo formato data "dd/mm/yyyy"
    const [day, month, year] = entry.date.split("/");
    const key = `${year}-${month}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  });
  return grouped;
}

// Raggruppa per anno
function groupByYear(entries) {
  const grouped = {};
  entries.forEach((entry) => {
    // Assumendo formato data "dd/mm/yyyy"
    const [day, month, year] = entry.date.split("/");
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  });
  return grouped;
}

function getMonthName(month, year) {
  return `${month}/${year}`;
}

function ChartsPage({ entries = [] }) {
  const grouped = groupByMonth(entries);
  const groupedYears = groupByYear(entries);

  // Stato per ordinamento
  const [sortBy, setSortBy] = useState("month");
  const [sortDir, setSortDir] = useState("desc");

  // Prepara dati mensili
  const monthsData = Object.keys(grouped).map((key) => {
    const [year, month] = key.split("-");
    const monthEntries = grouped[key];
    const totalKm = monthEntries.reduce(
      (sum, e) => sum + (parseFloat(e.km) || 0),
      0
    );
    const avgKm =
      monthEntries.length > 0
        ? (totalKm / monthEntries.length).toFixed(1)
        : "-";
    return {
      key,
      year,
      month,
      totalKm,
      avgKm,
      isCurrentMonth:
        key ===
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
    };
  });

  // Prepara dati annuali
  const yearsData = Object.keys(groupedYears).map((year) => {
    const yearEntries = groupedYears[year];
    const totalKm = yearEntries.reduce(
      (sum, e) => sum + (parseFloat(e.km) || 0),
      0
    );
    const avgKm =
      yearEntries.length > 0
        ? (totalKm / yearEntries.length).toFixed(1)
        : "-";
    return {
      year,
      totalKm,
      avgKm,
      isCurrentYear: year === String(new Date().getFullYear()),
    };
  });

  // Funzione di ordinamento
  const sortedMonths = [...monthsData].sort((a, b) => {
    let res = 0;
    if (sortBy === "month") {
      res = b.key.localeCompare(a.key);
    } else if (sortBy === "totalKm") {
      res = b.totalKm - a.totalKm;
    } else if (sortBy === "avgKm") {
      res = b.avgKm - a.avgKm;
    }
    return sortDir === "asc" ? -res : res;
  });

  // Ordinamento per anno
  const sortedYears = [...yearsData].sort((a, b) => {
    let res = 0;
    if (sortBy === "year") {
      res = b.year.localeCompare(a.year);
    } else if (sortBy === "totalKmYear") {
      res = b.totalKm - a.totalKm;
    } else if (sortBy === "avgKmYear") {
      res = b.avgKm - a.avgKm;
    }
    return sortDir === "asc" ? -res : res;
  });

  // Gestione click sulle intestazioni
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  return (
    <div style={{ padding: "32px", color: "#fff" }}>
      <h3>Dati mensili</h3>
      <table
        className="dashboard-table"
        style={{
          fontSize: "0.8rem",
          width: "auto",
          minWidth: "unset",
          maxWidth: "400px",
          margin: "0",
          borderSpacing: "0.25rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{ minWidth: "140px", cursor: "pointer" }}
              onClick={() => handleSort("month")}
            >
              Mese {sortBy === "month" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              style={{ minWidth: "80px", cursor: "pointer" }}
              onClick={() => handleSort("totalKm")}
            >
              KM {sortBy === "totalKm" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              style={{ minWidth: "80px", cursor: "pointer" }}
              onClick={() => handleSort("avgKm")}
            >
              Media {sortBy === "avgKm" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMonths.map((row) => (
            <tr
              key={row.key}
              style={
                row.isCurrentMonth
                  ? { background: "#2e7d32", color: "#fff", fontWeight: "bold" }
                  : {}
              }
            >
              <td>{getMonthName(row.month, row.year)}</td>
              <td>{row.totalKm.toFixed(1)}</td>
              <td>{row.avgKm}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Dati annuali</h3>
      <table
        className="dashboard-table"
        style={{
          fontSize: "0.8rem",
          width: "auto",
          minWidth: "unset",
          maxWidth: "400px",
          margin: "0",
          borderSpacing: "0.25rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{ minWidth: "140px", cursor: "pointer" }}
              onClick={() => {
                setSortBy("year");
                setSortDir(sortBy === "year" && sortDir === "desc" ? "asc" : "desc");
              }}
            >
              Anno {sortBy === "year" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              style={{ minWidth: "80px", cursor: "pointer" }}
              onClick={() => {
                setSortBy("totalKmYear");
                setSortDir(sortBy === "totalKmYear" && sortDir === "desc" ? "asc" : "desc");
              }}
            >
              KM {sortBy === "totalKmYear" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              style={{ minWidth: "80px", cursor: "pointer" }}
              onClick={() => {
                setSortBy("avgKmYear");
                setSortDir(sortBy === "avgKmYear" && sortDir === "desc" ? "asc" : "desc");
              }}
            >
              Media {sortBy === "avgKmYear" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedYears.map((row) => (
            <tr
              key={row.year}
              style={
                row.isCurrentYear
                  ? { background: "#2e7d32", color: "#fff", fontWeight: "bold" }
                  : {}
              }
            >
              <td>{row.year}</td>
              <td>{row.totalKm.toFixed(1)}</td>
              <td>{row.avgKm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChartsPage;