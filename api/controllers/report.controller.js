import Report from "../models/report.model.js";

export const createReport = async (req, res) => {
  try {
    // Xác định userId từ req.user.id
    const userId = req.user.id;

    // Kiểm tra và xử lý postId từ req.body
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "postId là bắt buộc" });
    }

    // Tạo báo cáo mới từ dữ liệu trong request body và thêm userId
    const newReport = new Report({
      ...req.body, // Lấy tất cả các trường từ request body (bao gồm postId)
      userId, // Thêm userId của người dùng hiện tại
    });

    // Lưu báo cáo vào cơ sở dữ liệu
    const savedReport = await newReport.save();

    // Trả về báo cáo mới với mã trạng thái 201 (Created)
    res.status(201).json(savedReport);
  } catch (error) {
    // Nếu có lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả các báo cáo
export const getAllReports = async (req, res) => {
  try {
    // Tìm tất cả các báo cáo và điền thêm thông tin của bài viết và người dùng liên quan
    const reports = await Report.find().populate("postId").populate("userId");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy một báo cáo theo ID
export const getReportById = async (req, res) => {
  try {
    // Tìm báo cáo theo ID và điền thêm thông tin của bài viết và người dùng liên quan
    const report = await Report.findById(req.params.id).populate("postId").populate("userId");
    if (!report) {
      return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật một báo cáo theo ID
export const updateReportById = async (req, res) => {
  try {
    // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu của báo cáo không
    const userId = req.user.id;
    const report = await Report.findById(req.params.id).populate("postId");
    if (!report) {
      return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    }
    if (report.userId.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật báo cáo này" });
    }

    // Tìm báo cáo theo ID và cập nhật nó với dữ liệu từ request body
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa một báo cáo theo ID
export const deleteReportById = async (req, res) => {
  try {
    // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu của báo cáo không
    const userId = req.user.id;
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    }
    if (report.userId.toString() !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền xóa báo cáo này" });
    }

    // Xóa báo cáo theo ID
    const deletedReport = await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Báo cáo đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
