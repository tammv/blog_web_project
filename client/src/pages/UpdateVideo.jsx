import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdateVideo() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [quillContent, setQuillContent] = useState("");
    const [publishError, setPublishError] = useState(null);
    const [darkMode] = useState(false);
    const { videoId } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await fetch(`/api/video/getVideo/${videoId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    return;
                }
                setFormData(data);
                setQuillContent(data.content || ""); // Cập nhật nội dung của ReactQuill
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchVideo();
    }, [videoId]);

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
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var startIndex = quillContent.indexOf('>') + 1;
            var endIndex = quillContent.lastIndexOf('<');
            var newQuillContent = quillContent.slice(startIndex, endIndex);
            const updatedFormData = { ...formData, content: newQuillContent }; // Cập nhật nội dung ReactQuill vào formData
            console.log(updatedFormData);
            const res = await fetch(`/api/video/updateVideo/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/video/${data._id}`);
            }
        } catch (error) {
            setPublishError("Something went wrong");
        }
    };

    return (
        <div className={`p-3 max-w-3xl mx-auto min-h-screen ${darkMode && "dark"} dark-container`}>
            <h1 className="text-center text-3xl my-7 font-semibold">Update Video</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title"
                        required
                        id="title"
                        className="flex-1"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        defaultValue={formData.title}
                    />
                </div>
                <TextInput
                    type="text"
                    placeholder="Youtube Video URL"
                    required
                    id="url"
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    defaultValue={formData.url}
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
                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                {formData.img && <img src={formData.img} alt="upload" className="w-full h-72 object-cover" />}
                <ReactQuill
                    theme="snow"
                    value={quillContent}
                    placeholder="Write something..."
                    className="h-72 mb-12"
                    required
                    onChange={setQuillContent} // Cập nhật state riêng cho nội dung ReactQuill
                />
                <Button type="submit" gradientDuoTone="purpleToPink">
                    Update Video
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
