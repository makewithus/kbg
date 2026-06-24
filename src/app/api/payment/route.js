import Razorpay from "razorpay";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.error("Missing Razorpay environment variables");
      return Response.json(
        { message: "Server misconfiguration: Missing payment credentials" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const { applicationId } = await request.json();
    
    console.log("Creating payment order for application:", applicationId);

    const applicationRef = doc(db, "applications", applicationId);
    const applicationSnap = await getDoc(applicationRef);

    if (!applicationSnap.exists()) {
      return Response.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    const application = applicationSnap.data();
    const amount = application.paymentAmount * 100; // Convert to paise

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${applicationId}`,
      payment_capture: 1,
      notes: {
        applicationId: applicationId,
        userId: application.userId,
      },
    };

    const order = await razorpay.orders.create(options);
    
    return Response.json(order);
  } catch (error) {
    console.error("Payment error:", error);
    return Response.json(
      { message: "Payment failed", error: error.message },
      { status: 500 }
    );
  }
}