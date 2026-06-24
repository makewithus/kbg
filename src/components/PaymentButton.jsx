"use client";

import { useState } from "react";
import axios from "axios";
import { Loader, CheckCircle } from "lucide-react";

export default function PaymentButton({ application, userData, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create order
      const response = await axios.post("/api/payment", { 
        applicationId: application.id 
      });
      const order = response.data;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Your Company Name",
          description: `Payment for ${application.templateName}`,
          image: "/logo.png",
          order_id: order.id,
          handler: async function (response) {
            try {
              // Verify payment
              await axios.post("/api/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId: application.id,
              });
              
              setPaymentSuccess(true);
              if (onPaymentSuccess) onPaymentSuccess();
            } catch (error) {
              console.error("Payment verification error:", error);
              alert("Payment verification failed: " + error.message);
            }
          },
          prefill: {
            name: userData?.fullName || "",
            email: userData?.email || "",
            contact: userData?.phoneNumber || "",
          },
          theme: {
            color: "#7F1C75",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="mr-2" size={16} />
        Payment Successful
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`flex items-center cursor-pointer px-3 py-1 text-sm ${
        loading ? "bg-purple-400" : "bg-[#7F1C75] hover:bg-[#401B71]"
      } text-white rounded-md transition-colors`}
    >
      {loading ? (
        <>
          <Loader className="animate-spin mr-2" size={16} />
          Processing...
        </>
      ) : (
        <>
          Complete Payment (₹{application.paymentAmount || "0"})
        </>
      )}
    </button>
  );
}