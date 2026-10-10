
import "./DailyReport.css";
import { useEffect, useState } from "react";

const today = () => {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().slice(0, 10);
};

export default function DailyReport() {
  const [date, setDate] = useState(today());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadReport() {
      setLoading(true);
      setError("");
      setReport(null);

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/reports/daily?date=${date}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not load the daily report.");
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (date) loadReport();

    return () => controller.abort();
  }, [date]);

  const handlePrint = () => {
    if (!report || loading) return;
    window.print();
  };

  const handleExportCSV = () => {
    if (!report || loading) return;

    // Protect against spreadsheet formula injection.
    const escapeCSV = (value) => {
      let text = String(value ?? "");

      if (/^[\s]*[=+\-@\t\r\n]/.test(text)) {
        text = "'" + text;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = [
      ["Time", "Customer", "Table", "Guests"],
      ...report.reservations.map((r) => [
        r.time,
        r.customer_name,
        r.table_number,
        r.guest_count,
      ]),
    ];

    const summary = [
      ["Cafe Fausse - Daily Reservation Report"],
      ["Date", report.date],
      ["Total Reservations", report.total_reservations],
      ["Expected Customers", report.total_customers],
      [],
    ];

    const csv = [...summary, ...rows]
      .map((row) => row.map(escapeCSV).join(";"))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `CafeFausse_Report_${report.date}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="daily-report">
      <div className="report-header">
        <div>
          <h1>Daily Reservation Report</h1>
          <p className="report-subtitle">
            Café Fausse — Restaurant Management Dashboard
          </p>
        </div>

        <div className="report-actions">
          <button
            type="button"
            className="report-btn print-btn"
            onClick={handlePrint}
            disabled={!report || loading}
          >
            🖨 Print / PDF
          </button>

          <button
            type="button"
            className="report-btn csv-btn"
            onClick={handleExportCSV}
            disabled={!report || loading}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      <label htmlFor="report-date">Select Date</label>
      <input
        id="report-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {loading && <p>Loading report...</p>}
      {error && <p role="alert">{error}</p>}

      {report && (
        <>
          <div className="report-summary">
            <div>
              <h2>Total Reservations</h2>
              <strong>{report.total_reservations}</strong>
            </div>
            <div>
              <h2>Expected Customers</h2>
              <strong>{report.total_customers}</strong>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Guests</th>
              </tr>
            </thead>
            <tbody>
              {report.reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.time}</td>
                  <td>{r.customer_name}</td>
                  <td>{r.table_number}</td>
                  <td>{r.guest_count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {report.reservations.length === 0 && (
            <p>No reservations for this date.</p>
          )}
        </>
      )}
    </main>
  );
}
