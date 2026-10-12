import { useEffect, useState } from "react";
import {
  getCertificates,
  downloadCertificate,
} from "../services/certificateService";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await getCertificates();
        setCertificates(data);
      } catch (err) {
        setError("Unable to load certificates.");
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const handleDownload = async (certificateId) => {
    try {
      setDownloadingId(certificateId);
      setError("");

      await downloadCertificate(certificateId);
    } catch (err) {
      setError("Failed to download certificate.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            🎓 My Certificates
          </h1>

          <p className="mt-2 text-slate-600">
            View and download certificates earned from completed courses.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading your certificates...
            </p>
          </div>
        ) : certificates.length === 0 ? (

          /* Empty State */
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🎓</div>

            <h2 className="text-xl font-semibold text-slate-800">
              No Certificates Yet
            </h2>

            <p className="mt-3 text-slate-500">
              Complete your courses and request certificates
              to see them here.
            </p>
          </div>

        ) : (

          /* Certificate Cards */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                  🎓
                </div>

                {/* Course Title */}
                <h2 className="text-xl font-semibold text-slate-900">
                  {certificate.course_title}
                </h2>

                {/* Student Name */}
                <p className="mt-3 text-sm text-slate-600">
                  Awarded to
                </p>

                <p className="font-medium text-slate-800">
                  {certificate.student_name}
                </p>

                {/* Issue Date */}
                <p className="mt-4 text-sm text-slate-500">
                  Issued:{" "}
                  {new Date(
                    certificate.issued_at
                  ).toLocaleDateString()}
                </p>

                {/* Certificate ID */}
                <p className="mt-3 break-all text-xs text-slate-400">
                  Certificate ID:
                  <br />
                  {certificate.certificate_id}
                </p>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={() =>
                    handleDownload(certificate.id)
                  }
                  disabled={
                    downloadingId === certificate.id
                  }
                  className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {downloadingId === certificate.id
                    ? "Downloading..."
                    : "⬇ Download Certificate"}
                </button>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}