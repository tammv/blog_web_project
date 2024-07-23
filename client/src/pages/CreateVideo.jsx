import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";

export default function CreateVideo() {
  const [file, setFile] = useState(null);
  // const [excelFile, setExcelFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [darkMode] = useState(false);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, img: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  // const handleUploadExcel = async () => {
  //   try {
  //     if (!excelFile) {
  //       setImageUploadError("Please select an Excel file");
  //       return;
  //     }
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //       const res = await fetch("/api/import/importVideos", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(jsonData),
  //       });
  //       const result = await res.json();
  //       if (!res.ok) {
  //         setImageUploadError(result.message);
  //       } else {
  //         setImageUploadError(null);
  //         alert("Excel file uploaded successfully!");
  //       }
  //     };
  //     reader.readAsArrayBuffer(excelFile);
  //   } catch (error) {
  //     setImageUploadError("Excel upload failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/video/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/video/${data._id}`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className={`p-3 max-w-3xl mx-auto min-h-screen ${darkMode && "dark"} dark-container`}>
      <h1 className="text-center text-3xl my-7 font-semibold">Create a video</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <TextInput
          type="text"
          placeholder="Youtube Video URL"
          required
          id="url"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {/* <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept=".xlsx, .xls" onChange={(e) => setExcelFile(e.target.files[0])} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadExcel}
          >
            Upload Excel
          </Button>
        </div> */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.img && <img src={formData.img} alt="upload" className="w-full h-72 object-cover" />}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className={`h-72 mb-12`}
          required
          onChange={(value) => {
            var startIndex = value.indexOf('>') + 1;
            var endIndex = value.lastIndexOf('<');
            var newValue = value.slice(startIndex, endIndex);
            setFormData({ ...formData, content: newValue });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
