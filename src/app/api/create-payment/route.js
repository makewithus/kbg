import Razorpay from "razorpay";
import { getDocs, query, collection, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  throw new Error("Missing Razorpay environment variables");
}

export async function POST(request) {
  try {
    const { applications, applicationId, userId, userEmail } = await request.json();
    const isBulkPayment = Array.isArray(applications);
    
    if (isBulkPayment) {
      console.log("Creating bulk payment order for applications:", applications);
      
      // For bulk payments, we'll fetch each application individually
      // due to Firestore's 'in' operator limitations
      let totalAmount = 0;
      const appDetails = [];
      
      for (const appId of applications) {
        const appRef = doc(db, "applications", appId);
        const appSnap = await getDoc(appRef);
        
        if (appSnap.exists()) {
          const data = appSnap.data();
          totalAmount += data.paymentAmount || 0;
          appDetails.push({
            id: appId,
            templateName: data.templateName,
            amount: data.paymentAmount
          });
        }
      }
      
      if (appDetails.length === 0) {
        return Response.json(
          { message: "No valid applications found" },
          { status: 404 }
        );
      }
      
      const amountInPaise = Math.round(totalAmount * 100); // Convert to paise
      
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `bulk_${Date.now()}`,
        payment_capture: 1,
        notes: {
          applicationIds: applications,
          userId: userId,
          type: "bulk_payment",
          count: appDetails.length
        },
      };
      
      const order = await razorpay.orders.create(options);
      
      return Response.json({
        ...order,
        applicationDetails: appDetails,
        totalAmount: totalAmount
      });
      
    } else {
      // Single payment handling remains the same
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
      const amountInPaise = Math.round(application.paymentAmount * 100);
      
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${applicationId}`,
        payment_capture: 1,
        notes: {
          applicationId: applicationId,
          userId: application.userId,
          type: "single_payment"
        },
      };
      
      const order = await razorpay.orders.create(options);
      
      return Response.json({
        ...order,
        applicationDetails: [{
          id: applicationId,
          templateName: application.templateName,
          amount: application.paymentAmount
        }],
        totalAmount: application.paymentAmount
      });
    }
    
  } catch (error) {
    console.error("Payment error:", error);
    return Response.json(
      { message: "Payment failed", error: error.message },
      { status: 500 }
    );
  }
}