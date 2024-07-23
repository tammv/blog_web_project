import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PaymentSuccess = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        console.log('Current User ID:', currentUser._id); // Log currentUser._id here

        if (currentUser && currentUser._id) {
            upgradeUserToPremium();
        }
    }, [currentUser]);

    const upgradeUserToPremium = async () => {
        try {
            const response = await fetch(`/api/user/level/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('User upgraded to Premium:', data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        // Set timeout to redirect to home page after 5 seconds
        const timeoutId = setTimeout(() => {
            handleRedirect();
        }, 5000);

        // Countdown timer
        const countdownInterval = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(countdownInterval);
                    handleRedirect();
                }
                return prevCount - 1;
            });
        }, 1000);

        // Cleanup functions
        return () => {
            clearTimeout(timeoutId);
            clearInterval(countdownInterval);
        };
    }, []);

    const handleRedirect = () => {
        window.location.href = '/';
    };

    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                backgroundImage: "url('https://i.pinimg.com/564x/f2/2d/2a/f22d2afa19665d3dcf1d1480f1f527c2.jpg')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
            }}
        >
            <div
                className="checkout"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    width: '400px',
                    textAlign: 'center',
                }}
            >
                <div
                    className="logo"
                    style={{
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src="https://i.pinimg.com/736x/e4/4d/bc/e44dbcff7d7d3c4d50af58fc5104f8ba.jpg"
                        alt="Logo"
                        style={{ width: '150px' }}
                    />
                </div>
                <div className="product" style={{ marginBottom: '20px' }}>
                    <p style={{ margin: 0, padding: '5px 0' }}>
                        <strong style={{ fontWeight: 'bold', color: '#333', fontSize: '24px' }}>
                            Payment success
                        </strong>
                    </p>
                    <p style={{ margin: 0, padding: '5px 0' }}>
                        <strong style={{ fontWeight: 'bold', color: 'red', fontSize: '24px' }}>
                            Please log in again to update Premium
                        </strong>
                    </p>
                </div>
                <button
                    onClick={handleRedirect}
                    style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '15px 20px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    Return to home page ({countdown})
                </button>
                {countdown === 0 && (
                    <p style={{ marginTop: '20px', color: '#555' }}>Redirecting to the home page...</p>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
