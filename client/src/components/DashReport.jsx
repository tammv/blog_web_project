import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial set of reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report/getall");
      const data = await res.json();
      if (res.ok) {
        setReports(data.reports);
        setHasMore(data.reports.length >= 10);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching reports:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch more reports when "Xem thêm" button is clicked
  const handleShowMore = async () => {
    setLoading(true);
    try {
      const startIndex = reports.length;
      const res = await fetch(`/api/report/getReports?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setReports([...reports, ...data.reports]);
        setHasMore(data.reports.length >= 10);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching more reports:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a report
  const handleDeleteReport = async (reportIdToDelete) => {
    try {
      const res = await fetch(`/api/report/delete-report/${reportIdToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReports(reports.filter((report) => report._id !== reportIdToDelete));
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <p>Loading...</p>
      ) : reports.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Post / Video</Table.HeadCell>
              <Table.HeadCell>Content report</Table.HeadCell>
              <Table.HeadCell>User report</Table.HeadCell>
              <Table.HeadCell>Remove</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reports.map((report) => (
                <Table.Row key={report._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {report.referenceId && (
                      <Link
                        to={`/${report.referenceType && report.referenceType.toLowerCase()}/${report.referenceId.slug}`}
                      >
                        {report.referenceId.title} {/* Hiển thị tiêu đề của bài viết hoặc video */}
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>{report.content}</Table.Cell>
                  <Table.Cell>{report.userId?.username}</Table.Cell>
                  <Table.Cell>{report.referenceType}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDeleteReport(report._id)}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {hasMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You don&#x27;t have any reports yet!</p>
      )}
    </div>
  );
}
