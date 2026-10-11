
import { useEffect, useState } from "react";
import {
  Printer,
  FileDown,
  CalendarDays,
  CalendarCheck2,
  UsersRound,
  ClipboardList,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import "./DailyReport.css";

const API_URL = "http://localhost:5000";

function getToday() {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().slice(0, 10);
}

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

function escapeCSV(value) {
  let text = String(value ?? "");

  // Prevent spreadsheet formula injection
  if (/^\s*[=+\-@\t\r\n]/.test(text)) {
    text = "'" + text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export default function DailyReport() {
  const [date, setDate] = useState(getToday);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadReport() {
      setLoading(true);
      setError("");
      setReport(null);

      try {
        const response = await fetch(
          `${API_URL}/api/reports/daily?date=${encodeURIComponent(date)}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session has expired. Please log in again."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "You do not have permission to view this report."
            );
          }

          throw new Error(
            data.error || "Unable to load the reservation report."
          );
        }

        setReport(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err instanceof TypeError
              ? "Cannot connect to the Flask server."
              : err.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (date) {
      loadReport();
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [date]);

  const handlePrint = () => {
    if (!report || loading) return;
    window.print();
  };

  const handleExportCSV = () => {
    if (!report || loading) return;

    const rows = [
      ["Cafe Fausse - Daily Reservation Report"],
      ["Date", report.date],
      ["Total Reservations", report.total_reservations],
      ["Expected Customers", report.total_customers],
      [],
      ["Time", "Customer", "Table", "Guests"],
      ...report.reservations.map((reservation) => [
        reservation.time,
        reservation.customer_name,
        reservation.table_number,
        reservation.guest_count,
      ]),
    ];

    const csv = rows
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
        <div className="report-heading">
          <span className="report-eyebrow">
            CAFÉ FAUSSE / MANAGEMENT
          </span>

          <h1>Daily Reservation Report</h1>

          <p className="report-subtitle">
            Review reservations and expected guests for any day.
          </p>
        </div>

        <div className="report-actions">
          <button
            type="button"
            className="report-btn print-btn"
            onClick={handlePrint}
            disabled={!report || loading}
            title="Print or save as PDF"
          >
            <Printer size={18} strokeWidth={1.9} />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            className="report-btn csv-btn"
            onClick={handleExportCSV}
            disabled={!report || loading}
            title="Download the report as CSV"
          >
            <FileDown size={18} strokeWidth={1.9} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <section className="report-filter" aria-label="Report filters">
        <div className="report-filter-heading">
          <div className="report-filter-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <label htmlFor="report-date">
              Select Report Date
            </label>
            <p>Choose a day to view its reservations</p>
          </div>
        </div>

        <input
          id="report-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </section>

      {loading && (
        <div className="report-status" role="status">
          <LoaderCircle className="report-spinner" size={22} />
          <span>Loading reservations...</span>
        </div>
      )}

      {error && (
        <div className="report-status report-error" role="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {report && !loading && (
        <>
          <div className="report-print-heading">
            <h2>Café Fausse — Daily Reservation Report</h2>
            <p>Report Date: {formatDate(report.date)}</p>
          </div>

          <div className="report-date-caption">
            <CalendarDays size={16} />
            <span>{formatDate(report.date)}</span>
          </div>

          <section
            className="report-summary"
            aria-label="Daily reservation summary"
          >
            <div className="report-stat-card">
              <div className="report-stat-top">
                <span>Total Reservations</span>
                <div className="report-stat-icon">
                  <CalendarCheck2 size={22} />
                </div>
              </div>

              <strong>{report.total_reservations}</strong>

              <p>Bookings for the selected day</p>
            </div>

            <div className="report-stat-card">
              <div className="report-stat-top">
                <span>Expected Customers</span>
                <div className="report-stat-icon">
                  <UsersRound size={22} />
                </div>
              </div>

              <strong>{report.total_customers}</strong>

              <p>Total guests expected for service</p>
            </div>
          </section>

          <section className="report-details">
            <div className="report-details-header">
              <div className="report-details-title">
                <ClipboardList size={21} />
                <h2>Reservation Details</h2>
              </div>

              <span className="report-count">
                {report.total_reservations} bookings
              </span>
            </div>

            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Table</th>
                    <th scope="col">Guests</th>
                  </tr>
                </thead>

                <tbody>
                  {report.reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="report-time">
                        {reservation.time}
                      </td>

                      <td>
                        {reservation.customer_name}
                      </td>

                      <td>
                        <span className="report-table-number">
                          {reservation.table_number}
                        </span>
                      </td>

                      <td>
                        {reservation.guest_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {report.reservations.length === 0 && (
                <div className="report-empty">
                  <CalendarDays size={34} strokeWidth={1.5} />
                  <h3>No reservations found</h3>
                  <p>
                    There are no reservations for the selected date.
                    Try choosing another day.
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
