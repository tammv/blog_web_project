import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashReports() {
  const { currentUser } = useSelector((state) => state.user);
  const [reports, setReports] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reportIdToDelete, setReportIdToDelete] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/report`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            setReports(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchReports();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = reports.length;
    try {
      const res = await fetch(`/api/report/getReports?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setReports((prev) => [...prev, ...data.reports]);
        if (data.reports.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteReport = async () => {
    setShowModal(false);
    console.log(reportIdToDelete);
    try {
      const res = await fetch(`/api/report/deletereport/${reportIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setReports((prev) => prev.filter((report) => report._id !== reportIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && reports.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell> 
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reports.map((report) => (
                <Table.Row
                  key={report._id} // Add a unique key to each Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Link to={`/post/${report.postId.slug}`}>
                        {report.postId.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{report.content}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setReportIdToDelete(report._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no reports yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this report?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteReport}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
