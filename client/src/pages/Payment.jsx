import React from "react";
import axios from "axios";

const PaymentPage = () => {
  const getUserIDFromCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "userID") {
        return value;
      }
    }
    return null;
  };

  const handleCreatePaymentLink = async () => {
    const persistedData = JSON.parse(localStorage.getItem("persist:root"));
    const user = persistedData ? JSON.parse(persistedData.user) : null;
    const userID = user?.currentUser?._id;
    console.log(userID);
    if (!userID) {
      alert("User ID not found");
      return;
    }

    const body = {
      userID,
      orderCode: Number(String(Date.now()).slice(-6)),
      amount: 25000,
      description: "Thanh toan don hang",
      returnUrl: "https://devb-blog-web.onrender.com/success",
      cancelUrl: "https://devb-blog-web.onrender.com",
    };

    try {
      const response = await fetch("api/payment/newPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log(response);

      if (response.status != 201) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover"
      style={{
        backgroundImage: "url('https://i.pinimg.com/564x/f2/2d/2a/f22d2afa19665d3dcf1d1480f1f527c2.jpg')",
      }}
    >
      <div className="bg-white rounded-lg shadow-md p-6 w-96 text-center">
        <div className="mb-6">
          <img
            src="https://i.pinimg.com/736x/e4/4d/bc/e44dbcff7d7d3c4d50af58fc5104f8ba.jpg"
            alt="Logo"
            className="w-36 mx-auto"
          />
        </div>
        <div className="mb-6">
          <p className="text-lg font-bold text-gray-800">Thanh toán Premium</p>
          <p className="text-lg font-bold text-gray-800">Giá tiền: 25000 VNĐ</p>
        </div>
        <button
          onClick={handleCreatePaymentLink}
          type="submit"
          className="bg-blue-500 text-white rounded-md px-6 py-3 font-medium text-lg hover:bg-blue-600 transition-colors"
        >
          Bạn có chấp nhận lên hội viên siêu cấp tại DevB Blog
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
