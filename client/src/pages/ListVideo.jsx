import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListVideoComponent = () => {
    const [videos, setVideos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await fetch(`/api/video/getVideos`);
                const data = await res.json();
                if (res.ok) {
                    setVideos(data.videos);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, []);

    const handleCardClick = (videoId) => {
        navigate(`/video/${videoId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (videos.length === 0) return <div>No video found</div>;

    return (
        <div className='p-6 shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5'>
            {videos.map((video, index) => (
                <div key={index}
                    className='border border-gray-300 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-200 active:scale-95'
                    onClick={() => handleCardClick(video._id)}>
                    <img src={video.img} alt={video.title} className='w-full h-48 object-cover' />
                    <div className='p-4'>
                        <h2 className='font-bold text-xl mb-2'>{video.title}</h2>
                        <p className='text-gray-700 text-base'>{video.userId.username}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListVideoComponent;
