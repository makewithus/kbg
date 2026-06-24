"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function AffidavitForm() {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    companyName: "",
    address: "",
    Date: new Date().toISOString().split("T")[0],
    formClass: "",
    trademarkName: "",
    companyGoods: "",
    trademarkDate: "",
    deponent: "",
    templateName: "USER AFFIDAVIT & POA",
    paymentAmount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const signatureFileRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveApplicationToFirebase = async (pdfUrl) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("userId", "==", userId),
      where("templateName", "==", form.templateName)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error(
        `You've already submitted an Affidavit & POA application.`
      );
    }

    const applicationData = {
      ...form,
      userId,
      status: "In Review",
      customService: false,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(pdfUrl && { generatedPdfUrl: pdfUrl }),
    };

    const docRef = await addDoc(
      collection(db, "applications"),
      applicationData
    );
    return { id: docRef.id, pdfUrl };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("Please sign in to submit the application");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const docxResponse = await axios.post("/api/fill-docx", form, {
        responseType: "blob",
      });

      const docxBlob = new Blob([docxResponse.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      await saveApplicationToFirebase();
      setSuccess("Affidavit & POA submitted successfully!");

      setTimeout(() => {
        window.location.href = "/dashboard/user?tab=your-forms";
      }, 2000);
    } catch (err) {
      console.error("Failed to process application:", err);
      setError(
        err.message || "Failed to process application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 fixed right-10 bottom-10 p-4 mb-6 rounded-md">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 fixed right-10 bottom-10 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
              <p className="font-medium">Success</p>
              <p>{success}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-orange-200">
              USER AFFIDAVIT & POWER OF ATTORNEY
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="3"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="Date"
                  value={form.Date}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <input
                  type="text"
                  name="formClass"
                  value={form.formClass}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Name/Logo/Slogan
                </label>
                <input
                  type="text"
                  name="trademarkName"
                  value={form.trademarkName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Goods/Services
                </label>
                <textarea
                  name="companyGoods"
                  value={form.companyGoods}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="2"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Trademark Since Date
                </label>
                <input
                  type="date"
                  name="trademarkDate"
                  value={form.trademarkDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Deponent Name
                </label>
                <input
                  type="text"
                  name="deponent"
                  value={form.deponent}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading || fileUploading}
              className="bg-[#401B71] hover:bg-[#7F1C75] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Affidavit & POA"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
