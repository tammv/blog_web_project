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
        const res = await fetch("/api/report/getall", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          // Lấy thông tin người dùng từ userId trong reports
          const reportsWithUser = await Promise.all(
            data.map(async (report) => {
              const userRes = await fetch(`/api/user/${report.userId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              const userData = await userRes.json();
              return { ...report, userName: userData.username };
            })
          );

          setReports(reportsWithUser);
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
      const res = await fetch(`/api/report/getReports?userId=${currentUser._id}&startIndex=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Lấy thông tin người dùng từ userId trong reports
        const newReports = await Promise.all(
          data.reports.map(async (report) => {
            const userRes = await fetch(`/api/user/${report.userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            const userData = await userRes.json();
            return { ...report, userName: userData.username };
          })
        );

        setReports((prev) => [...prev, ...newReports]);
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
    try {
      const res = await fetch(`/api/report/delete-report/${reportIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
              <Table.HeadCell>Bài viết</Table.HeadCell>
              <Table.HeadCell>Nội dung báo cáo</Table.HeadCell>
              <Table.HeadCell>Người báo cáo</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reports.map((report) => (
                <Table.Row key={report._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <Link to={`/post/${report.postId.slug}`}>{report.postId.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{report.content}</Table.Cell>
                  <Table.Cell>{report.userName}</Table.Cell> {/* Hiển thị tên người báo cáo */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setReportIdToDelete(report._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Xóa
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Xem thêm
            </button>
          )}
        </>
      ) : (
        <p>Bạn chưa có báo cáo nào!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn xóa báo cáo này?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteReport}>
                Có, Tôi chắc chắn
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, hủy bỏ
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
