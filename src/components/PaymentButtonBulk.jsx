"use client";

import { useState } from "react";
import axios from "axios";
import { Loader, CheckCircle } from "lucide-react";
import { ArrowRight } from "react-feather";

export default function PaymentButtonBulk({
  application,
  userData,
  onPaymentSuccess,
  label,
}) {
  // application can be a single app or an array of apps
  const isBulkPayment = Array.isArray(application);

  const handlePayment = async () => {
    try {
      // Prepare payment data
      const paymentData = isBulkPayment
        ? {
            applications: application.map((app) => app.id),
            amount: application.reduce(
              (sum, app) => sum + (app.paymentAmount || 0),
              0
            ),
            description: `Custom service package (${application.length} forms)`,
          }
        : {
            applicationId: application.id,
            amount: application.paymentAmount || 0,
            description: `Payment for ${
              application.templateName || "application"
            }`,
          };

          console.log(paymentData)

      // Call your payment API
      const response = await axios.post("/api/create-payment", {
        ...paymentData,
        userId: userData?.uid,
        userEmail: userData?.email,
      });

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: paymentData.amount * 100, // in paise
          currency: "INR",
          name: "Your Company Name",
          description: paymentData.description,
          order_id: response.data.id,
          handler: async function (response) {
            
            console.log(response)

            await axios.post("/api/verify-bulk-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              applicationIds: [paymentData.applicationId],
              paymentData
            });

              if (onPaymentSuccess) onPaymentSuccess();
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
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="flex items-center px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] transition-colors"
    >
      {label}
      <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
    </button>
  );
}
