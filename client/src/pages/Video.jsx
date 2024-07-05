import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VideoComponent = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await fetch(`/api/video/getVideo/${videoId}`);
                const data = await res.json();
                if (res.ok) {
                    setVideo(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>No video found</div>;

    return (
        <div className='p-6 bg-slate-600 rounded-lg shadow-md grid grid-cols-5 gap-5'>
            <div className='col-span-3'>
                <iframe width="100%" height="315" src={video.url} title={video.title}
                    frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <p className="text-slate-200 my-4 font-bold justify-self-end">Author: {video.userId.username}</p>
            </div>
            <div className='col-span-2'>
                <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
                <p className="text-slate-200 mb-4">{video.content}</p>
            </div>
        </div>
    );
};

export default VideoComponent;
