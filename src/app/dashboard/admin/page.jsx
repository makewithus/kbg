"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  Home,
  FileText,
  Users,
  CreditCard,
  User,
  Menu,
  X,
  ChevronRight,
  Download,
  Search, Info,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Edit,
} from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all-forms");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          if (docSnap.data().role !== "admin") {
            setLoading(false);
            return;
          }
          setAdminData(docSnap.data());
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F1C75]"></div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-[#7F1C75] text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-10 w-64 bg-white shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#7F1C75]">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">{adminData.email}</p>
        </div>

        <nav className="mt-6">
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeTab === "all-forms"
                ? "bg-orange-100 border-r-4 border-[#7F1C75]"
                : "hover:bg-orange-50"
            }`}
            onClick={() => {
              setActiveTab("all-forms");
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
          >
            <FileText
              size={20}
              className={
                activeTab === "all-forms" ? "text-[#7F1C75]" : "text-gray-600"
              }
            />
            <span
              className={`ml-4 ${
                activeTab === "all-forms"
                  ? "font-medium text-[#401B71]"
                  : "text-gray-700"
              }`}
            >
              All Forms
            </span>
          </div>

          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeTab === "users"
                ? "bg-orange-100 border-r-4 border-[#7F1C75]"
                : "hover:bg-orange-50"
            }`}
            onClick={() => {
              setActiveTab("users");
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
          >
            <Users
              size={20}
              className={
                activeTab === "users" ? "text-[#7F1C75]" : "text-gray-600"
              }
            />
            <span
              className={`ml-4 ${
                activeTab === "users"
                  ? "font-medium text-[#401B71]"
                  : "text-gray-700"
              }`}
            >
              Users
            </span>
          </div>

          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeTab === "payments"
                ? "bg-orange-100 border-r-4 border-[#7F1C75]"
                : "hover:bg-orange-50"
            }`}
            onClick={() => {
              setActiveTab("payments");
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
          >
            <CreditCard
              size={20}
              className={
                activeTab === "payments" ? "text-[#7F1C75]" : "text-gray-600"
              }
            />
            <span
              className={`ml-4 ${
                activeTab === "payments"
                  ? "font-medium text-[#401B71]"
                  : "text-gray-700"
              }`}
            >
              Payments
            </span>
          </div>


          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeTab === "profile"
                ? "bg-orange-100 border-r-4 border-[#7F1C75]"
                : "hover:bg-orange-50"
            }`}
            onClick={() => {
              setActiveTab("profile");
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
          >
            <User
              size={20}
              className={
                activeTab === "profile" ? "text-[#7F1C75]" : "text-gray-600"
              }
            />
            <span
              className={`ml-4 ${
                activeTab === "profile"
                  ? "font-medium text-[#401B71]"
                  : "text-gray-700"
              }`}
            >
              Profile
            </span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center text-sm">
              <span className="text-gray-600">Dashboard</span>
              <ChevronRight size={16} className="mx-1 text-gray-400" />
              <span className="font-medium text-[#401B71]">
                {activeTab === "all-forms" && "All Forms"}
                {activeTab === "users" && "Users"}
                {activeTab === "payments" && "Payments"}
                {activeTab === "custom-services" && "Custom Services"}
                {activeTab === "profile" && "Profile"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User size={16} className="text-[#7F1C75]" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "all-forms" && <AllFormsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "payments" && <PaymentsTab />}
          {activeTab === "custom-services" && <CustomServicesTab />}
          {activeTab === "profile" && <ProfileTab adminData={adminData} />}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function CustomServicesTab() {
  const [customServices, setCustomServices] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    forms: [],
    totalAmount: 0,
    comments: '',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all applications with customService flag
        const q = query(
          collection(db, "applications"),
          where("customService", "==", true),
        );
        
        const querySnapshot = await getDocs(q);
        const servicesData = {};

        console.log(querySnapshot);
        
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (!servicesData[data.userId]) {
            servicesData[data.userId] = {
              userId: data.userId,
              forms: [],
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          }
          servicesData[data.userId].forms.push({
            id: doc.id,
            ...data
          });
        });

        // Convert to array
        const servicesArray = Object.values(servicesData);
        setCustomServices(servicesArray);

        // Fetch user data for each service
        const usersData = {};
        for (const service of servicesArray) {
          if (!usersData[service.userId]) {
            const userDoc = await getDoc(doc(db, "users", service.userId));
            if (userDoc.exists()) {
              usersData[service.userId] = userDoc.data();
            }
          }
        }
        setUsers(usersData);

      } catch (error) {
        console.error("Error fetching custom services:", error);
        showToast('Failed to load custom services', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setFormData({
      forms: service.forms.map(form => ({
        id: form.id,
        templateName: form.templateName,
        amount: form.paymentAmount || 0,
        status: form.status || 'Submitted'
      })),
      totalAmount: service.forms.reduce((sum, form) => sum + (form.paymentAmount || 0), 0),
      comments: service.forms[0]?.comments || ''
    });
    setShowModal(true);
  };

  const handleAmountChange = (formId, value) => {
    setFormData(prev => {
      const updatedForms = prev.forms.map(form => 
        form.id === formId ? { ...form, amount: Number(value) } : form
      );
      return {
        ...prev,
        forms: updatedForms,
        totalAmount: updatedForms.reduce((sum, form) => sum + form.amount, 0)
      };
    });
  };

  const handleStatusChange = (formId, value) => {
    setFormData(prev => ({
      ...prev,
      forms: prev.forms.map(form => 
        form.id === formId ? { ...form, status: value } : form
      )
    }));
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;
    
    try {
      // Update each form in the custom service
      const batchUpdates = formData.forms.map(async form => {
        const formRef = doc(db, "applications", form.id);
        await updateDoc(formRef, {
          paymentAmount: form.amount,
          status: form.status,
          comments: formData.comments,
          updatedAt: serverTimestamp()
        });
      });

      await Promise.all(batchUpdates);
      
      // Refresh data
      const updatedServices = customServices.map(service => 
        service.userId === selectedService.userId
          ? {
              ...service,
              forms: service.forms.map(form => {
                const updatedForm = formData.forms.find(f => f.id === form.id);
                return updatedForm ? { ...form, ...updatedForm } : form;
              }),
              updatedAt: serverTimestamp()
            }
          : service
      );
      
      setCustomServices(updatedServices);
      setShowModal(false);
      showToast('Custom service updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating custom service:", error);
      showToast('Failed to update custom service', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted": return "bg-blue-100 text-blue-800";
      case "In Review": return "bg-yellow-100 text-yellow-800";
      case "Payment Pending": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F1C75]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Custom Service Requests</h2>

      {customServices.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No custom service requests
          </h3>
          <p className="text-gray-600">
            There are no pending custom service requests.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {customServices.map(service => (
            <div key={service.userId} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {users[service.userId]?.fullName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {users[service.userId]?.email || 'No email'}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Requested on: {service.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {service.forms.map(form => (
                  <div key={form.id} className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Form Type</p>
                      <p className="font-medium">
                        {form.templateName === "Template_INS_Updated" 
                          ? "TRADEMARK & ISO DATA" 
                          : form.templateName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(form.status)}`}>
                        {form.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">
                        {form.paymentAmount ? `₹${form.paymentAmount}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="text-sm">
                        {form.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Forms: {service.forms.length}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Estimated Total</p>
                    <p className="font-medium text-lg text-[#7F1C75]">
                      ₹{service.forms.reduce((sum, form) => sum + (form.paymentAmount || 0), 0)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71]"
                  >
                    Process Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Process Request Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-[#00000099] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Process Custom Service Request
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">
                  User: {users[selectedService.userId]?.fullName || 'Unknown'}
                </h4>
                <p className="text-sm text-gray-600">
                  Email: {users[selectedService.userId]?.email || 'No email'} | 
                  Phone: {users[selectedService.userId]?.phoneNumber || 'No phone'}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Forms Included</h4>
                <div className="space-y-4">
                  {formData.forms.map(form => (
                    <div key={form.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm text-gray-500">Form Type</p>
                        <p className="font-medium">
                          {form.templateName === "Template_INS_Updated" 
                            ? "TRADEMARK & ISO DATA" 
                            : form.templateName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={form.amount}
                          onChange={(e) => handleAmountChange(form.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={form.status}
                          onChange={(e) => handleStatusChange(form.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75]"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Review">In Review</option>
                          <option value="Payment Pending">Payment Pending</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-[#7F1C75]">
                    ₹{formData.totalAmount}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments/Instructions
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75]"
                    rows={3}
                    placeholder="Add payment instructions or comments..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateService}
                  className="px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71]"
                >
                  Update Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <Info className="h-5 w-5 mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}


function AllFormsTab() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    paymentAmount: '',
    comments: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        showToast('Please upload only JPG, PNG, or DOCX files', 'error');
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'testify'); // Replace with your upload preset
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dxggxnjjw/upload', // Replace with your cloud name
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('File upload failed', 'error');
      return null;
    } finally {
      setIsUploading(false);
    }
  };


  // Get unique template names for filter dropdown
  const templateOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'Template_INS_Updated', label: 'TRADEMARK & ISO DATA' },
    // Add more templates as needed
  ];

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch applications
      const formsSnapshot = await getDocs(collection(db, "applications"));
      const formsData = formsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => b.updatedAt?.toDate() - a.updatedAt?.toDate()); // Sort by updatedAt descending

      setForms(formsData);
      setFilteredForms(formsData);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = {};
      usersSnapshot.forEach(doc => {
        usersData[doc.id] = doc.data();
      });
      setUsers(usersData);

    } catch (error) {
      console.error("Error fetching data:", error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Filter forms based on search term and selected template
  useEffect(() => {
    let results = forms;
    
    // Filter by template
    if (selectedTemplate !== 'all') {
      results = results.filter(form => form.templateName === selectedTemplate);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(form => {
        const userName = users[form.userId]?.fullName?.toLowerCase() || '';
        const templateName = form.templateName?.toLowerCase() || '';
        const comments = form.comments?.toLowerCase() || '';
        
        return (
          userName.includes(term) ||
          templateName.includes(term) ||
          comments.includes(term)
        );
      });
    }
    
    setFilteredForms(results);
  }, [searchTerm, selectedTemplate, forms, users]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted": return "bg-blue-100 text-blue-800";
      case "In Review": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Payment Pending": return "bg-red-100 text-red-800";
      case "Negotiated" : return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewUser = async (userId) => {
    try {
      if (!users[userId]) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUsers(prev => ({
            ...prev,
            [userId]: userDoc.data()
          }));
        }
      }
      const user = users[userId];
      showToast(`User: ${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phoneNumber}`, 'info');
    } catch (error) {
      console.error("Error fetching user:", error);
      showToast('Failed to fetch user details', 'error');
    }
  };

  const handleDownload = async (form) => {
    try {
      console.log(form)
      const docxResponse = await axios.post('/api/fill-docx', form, {
        responseType: 'blob',
      });
      
      const docxBlob = new Blob([docxResponse.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      const url = window.URL.createObjectURL(docxBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${form.templateName} - ${form.INS_tm_full_name}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Document downloaded successfully', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showToast('Failed to download document', 'error');
    }
  };

  const handleOpenModal = (form) => {
    setSelectedForm(form);
    setFormData({
      status: form.status || 'Submitted',
      paymentAmount: form.paymentAmount || '',
      comments: form.comments || '',
      paymentStatus: form.status === 'Completed' ? 'Paid' : 'Pending'
    });
    setShowModal(true);
  };

   const handleUpdateForm = async () => {
    if (!selectedForm) return;
    
    try {
      let attachmentUrl = null;
      
      // Upload file if one was selected
      if (file) {
        attachmentUrl = await uploadFile();
        if (!attachmentUrl) {
          showToast('Form updated but file upload failed', 'error');
        }
      }
      
      // Prepare update data
      const updateData = {
        status: formData.status,
        paymentAmount: formData.paymentAmount,
        comments: formData.comments,
        updatedAt: serverTimestamp(),
        paymentStatus: formData.status === "Completed" ? "Paid" : "Pending",
      };
      
      // Add attachment URL if available
      if (attachmentUrl) {
        updateData.attachmentUrl = attachmentUrl;
        // Keep track of previous attachments if they exist
        if (selectedForm.attachments) {
          updateData.attachments = [...selectedForm.attachments, attachmentUrl];
        } else {
          updateData.attachments = [attachmentUrl];
        }
      }
      
      // Update the document
      await updateDoc(doc(db, "applications", selectedForm.id), updateData);
      
      // Update local state
      setForms(forms.map(f => 
        f.id === selectedForm.id ? { ...f, ...updateData } : f
      ));
      
      setShowModal(false);
      setFile(null);
      showToast('Form updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating form:", error);
      showToast('Failed to update form', 'error');
    }
  };


  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setFormData({
      status: newStatus,
      paymentAmount: formData.paymentAmount,
      comments: (newStatus !== 'Payment Pending' || newStatus !== 'In Review') ? '' : formData.comments
    });
  };

  const handleExport = async () => {
    try {
      const csvContent = [
        ['User Name', 'Email', 'Form Type', 'Status', 'Payment Amount', 'Date', 'Comments'],
        ...filteredForms.map(form => [
          users[form.userId]?.fullName || 'N/A',
          users[form.userId]?.email || 'N/A',
          form.templateName === "Template_INS_Updated" ? "TRADEMARK & ISO DATA" : form.templateName,
          form.status,
          form.paymentAmount || 'N/A',
          form.createdAt?.toDate().toLocaleDateString() || 'N/A',
          form.comments || 'N/A'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form_submissions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Data exported successfully', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export data', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F1C75]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">All Form Submissions</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or template..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
          >
            {templateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredForms.length} of {forms.length} forms
      </div>

      {/* Forms Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negotiated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredForms.length > 0 ? (
              filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {users[form.userId]?.fullName || form.INS_tm_full_name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {users[form.userId]?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(form.templateName === "TRADEMARK-AND-ISO"
                        ? "TRADEMARK & ISO DATA"
                        : form.templateName).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(form.status)}`}>
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {form.paymentAmount ? `₹${form.paymentAmount}` : 'N/A'}
                  </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {form.negotiatedPrice ? `₹${form.negotiatedPrice}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.createdAt?.toDate().toLocaleDateString() || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2 items-center">
                    <button 
                      onClick={() => handleViewUser(form.userId)}
                      className="text-[#401B71] hover:text-orange-900 p-1 rounded hover:bg-[#7F1C75]"
                      title="View User"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleDownload(form)}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                      title="Download Form"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleOpenModal(form)}
                      className="px-3 py-1 text-sm bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] transition-colors"
                      title="Update Form"
                    >
                      Update
                    </button>
                  </td>   
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No forms found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Form Modal */}
     {showModal && selectedForm && (
    <div className="fixed inset-0 bg-[#00000099] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Update Form Submission
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75]"
              >
                <option value="Submitted">Submitted</option>
                <option value="In Review">In Review</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Negotiated">Negotiated</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                value={formData.paymentAmount}
                onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75]"
                placeholder="Enter amount"
              />
            </div>
            
            {(formData.status === 'Payment Pending' || formData.status === 'In Review') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F1C75]"
                  rows={3}
                  placeholder="Add payment instructions..."
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attach Supporting Document (Optional)
              </label>
              <div className="flex items-center">
                <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">
                    {file ? file.name : 'Choose file...'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.docx"
                  />
                </label>
                {file && (
                  <button
                    onClick={() => setFile(null)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, or DOCX files only (max 5MB)
              </p>
              
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#7F1C75] h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
              
              {selectedForm.attachments && selectedForm.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Previous Attachments:
                  </p>
                  <ul className="space-y-1">
                    {selectedForm.attachments.map((url, index) => (
                      <li key={index} className="flex items-center">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7F1C75] hover:underline text-sm"
                        >
                          Document {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setFile(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateForm}
              disabled={isUploading}
              className={`px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Uploading...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <Info className="h-5 w-5 mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F1C75]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Registered Users
        </h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.phoneNumber || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt?.toDate().toLocaleDateString() || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#401B71] hover:text-orange-900">
                    {(user.role &&
                      user.role.charAt(0).toUpperCase() + user.role.slice(1)) ||
                      "N/A"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'paid', 'pending'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch applications with payments
        const appsSnapshot = await getDocs(collection(db, "applications"));
        const appsData = appsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter applications that have payment information
        const paymentApps = appsData.filter(app => 
          app.paymentId || app.paymentStatus || app.paymentAmount
        );
        setApplications(paymentApps);
        
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = {};
        usersSnapshot.forEach(doc => {
          usersData[doc.id] = doc.data();
        });
        setUsers(usersData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter payments based on search term and status filter
  useEffect(() => {
    let results = applications.map(app => {
      const user = users[app.userId];
      
      return {
        id: app.paymentId || app.id,
        applicationId: app.id,
        transactionId: app.paymentId,
        userName: user?.fullName || app.name || app.deponent || "N/A",
        userEmail: user?.email || "N/A",
        amount: app.paymentAmount || 0,
        status: app.paymentStatus || "Pending",
        date: app.paymentDate || app.updatedAt || app.createdAt,
        formType: app.templateName,
        companyName: app.companyName,
        trademarkName: app.trademarkName,
        paymentDetails: {
          paymentAmount: app.paymentAmount,
          paymentStatus: app.paymentStatus,
          paymentDate: app.paymentDate
        }
      };
    });
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(payment => {
        return (
          payment.userName.toLowerCase().includes(term) ||
          (payment.userEmail && payment.userEmail.toLowerCase().includes(term)) ||
          (payment.transactionId && payment.transactionId.toLowerCase().includes(term)) ||
          (payment.formType && payment.formType.toLowerCase().includes(term)) ||
          (payment.companyName && payment.companyName.toLowerCase().includes(term)) ||
          (payment.trademarkName && payment.trademarkName.toLowerCase().includes(term))
        );
      });
    }
    
    // Filter by payment status
    if (statusFilter !== 'all') {
      results = results.filter(payment => {
        if (statusFilter === 'paid') {
          return payment.status === 'Paid' || payment.status === 'Completed';
        } else if (statusFilter === 'pending') {
          return payment.status === 'Pending' || payment.status === 'Payment Pending';
        }
        return true;
      });
    }
    
    setFilteredPayments(results);
  }, [searchTerm, applications, users, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Transaction ID', 'User', 'Email', 'Form Type', 'Amount', 'Status', 'Date'],
        ...filteredPayments.map(payment => [
          payment.transactionId || 'N/A',
          payment.userName,
          payment.userEmail,
          payment.formType || 'N/A',
          `₹${payment.amount?.toLocaleString() || "0"}`,
          payment.status,
          payment.date?.toDate?.().toLocaleDateString() || 
            (typeof payment.date === 'string' ? payment.date : 'N/A')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment_records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F1C75]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Payment Records</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, company, trademark or transaction ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'all' ? 'bg-white shadow-sm text-[#7F1C75]' : 'text-gray-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'paid' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'pending' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-600'}`}
            >
              Pending
            </button>
          </div>
          
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredPayments.length} payment records
        {statusFilter !== 'all' && ` (${statusFilter} only)`}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.transactionId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.userEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.formType || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{payment.amount?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date?.toDate?.().toLocaleDateString() || 
                     (typeof payment.date === 'string' ? payment.date : 'N/A')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No payment records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileTab({ adminData }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: adminData.fullName || "",
    email: adminData.email || "",
    phoneNumber: adminData.phoneNumber || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add update logic here
    setEditMode(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Admin Profile</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center px-3 py-1 text-sm bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F1C75]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F1C75]"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#7F1C75] text-white rounded-md hover:bg-[#401B71] transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-gray-900">
                {formData.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">
                {formData.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-gray-900">
                {formData.phoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                Admin
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
