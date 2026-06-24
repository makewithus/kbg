"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

const FormSubmissionsView = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    let q;
    if (filter === "all") {
      q = query(collection(db, "applications"), where("userId", "==", user.uid));
    } else {
      q = query(
        collection(db, "applications"),
        where("userId", "==", user.uid),
        where("status", "==", filter)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JS Date
        createdAt: doc.data().createdAt?.toDate()
      }));
      setSubmissions(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      submitted: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      "payment-pending": "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || "bg-gray-100"}`}>
        {status.replace("-", " ")}
      </span>
    );
  };

  const getFormTypeIcon = (type) => {
    return type === "trademark" ? "™" : "🛡️";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
        <p className="text-gray-600">View all your submitted forms and their current status</p>
      </div>

      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("submitted")}
          className={`px-4 py-2 rounded-md ${filter === "submitted" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Submitted
        </button>
        <button
          onClick={() => setFilter("processing")}
          className={`px-4 py-2 rounded-md ${filter === "processing" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter("payment-pending")}
          className={`px-4 py-2 rounded-md ${filter === "payment-pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Payment Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-md ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications found</p>
          <Link href="/apply" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            Submit New Application
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700">
            <div className="col-span-1">Type</div>
            <div className="col-span-3">Reference</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Documents</div>
            <div className="col-span-2">Actions</div>
          </div>

          {submissions.map((submission) => (
            <div key={submission.id} className="grid grid-cols-12 p-4 border-b items-center">
              <div className="col-span-1 text-xl">
                {getFormTypeIcon(submission.type)}
              </div>
              <div className="col-span-3 font-mono text-sm text-gray-600">
                {submission.id.slice(0, 8)}...
              </div>
              <div className="col-span-2 text-sm">
                {submission.createdAt?.toLocaleDateString()}
              </div>
              <div className="col-span-2">
                {getStatusBadge(submission.status)}
              </div>
              <div className="col-span-2">
                {submission.documents?.length > 0 ? (
                  <span className="text-green-600">{submission.documents.length} uploaded</span>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
              <div className="col-span-2 flex space-x-2">
                <Link
                  href={`/applications/${submission.id}`}
                  className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                >
                  View
                </Link>
                {submission.status === "payment-pending" && (
                  <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                    Pay
                  </button>
                )}
                {submission.status === "completed" && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/apply" className="px-4 py-2 bg-blue-600 text-white rounded-md inline-block">
          + New Application
        </Link>
      </div>
    </div>
  );
};

export default FormSubmissionsView;