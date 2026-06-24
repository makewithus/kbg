import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import crypto from "crypto";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationIds,
      paymentData,
    } = await request.json();

    console.log(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationIds,
      paymentData.applications
    );
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return Response.json({ message: "Invalid signature" }, { status: 400 });
    }

    // Update payment status in Firestore
    // Loop through each application ID and update its status

    const app = paymentData.applications;

    console.log(app)

    for (const applicationId of app) {
        console.log("Updating payment status for application:", applicationId);
      const applicationRef = doc(db, "applications", applicationId);
      await updateDoc(applicationRef, {
        paymentStatus: "Paid",
        paymentId: razorpay_payment_id,
        paymentDate: new Date(),
        status: "Completed", // Update status to "In Review" after payment
      });

     
    }

     return Response.json({
        message: "Payment verified and updated successfully",
        paymentId: razorpay_payment_id,
      });
  } catch (error) {
    console.error("Payment verification error:", error);
    return Response.json(
      { message: "Payment verification failed", error: error.message },
      { status: 500 }
    );
  }
}
