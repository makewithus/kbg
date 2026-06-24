'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function IsoForm() {
  const [form, setForm] = useState({
    // Trademark fields
    INS_tm_title: '',
    INS_tm_full_name: '',
    INS_tm_designation: '',
    INS_tm_company_name: '',
    INS_tm_house_name: '',
    INS_tm_location: '',
    INS_tm_landmark: '',
    INS_tm_district: '',
    INS_tm_pincode: '',
    INS_tm_state: '',
    INS_tm_contact_number: '',
    INS_tm_email: '',
    INS_tm_date: new Date().toISOString().split('T')[0],
    INS_tm_brand_name: '',
    INS_tm_class: '',
    INS_tm_goods_services: '',
    INS_tm_additional_goods_services: '',
    INS_tm_brand_since: '',
    INS_tm_signature_file: '',
    INS_tm_support_doc_file: '',
    // ISO Certification fields
    INS_iso_client_name: '',
    INS_iso_district: '',
    INS_iso_state: '',
    INS_iso_standards: '',
    INS_iso_contact_person: '',
    INS_iso_contact_designation: '',
    INS_iso_contact_number: '',
    INS_iso_contact_email: '',
    INS_iso_full_address: '',
    INS_iso_pincode: '',
    INS_iso_address_district: '',
    INS_iso_address_state: '',
    INS_iso_address_landmark: '',
    INS_iso_org_type: '',
    INS_iso_business_activities: '',
    INS_iso_branches: '',
    INS_iso_total_employees: '',
    INS_iso_mgmt_level_employees: '',
    INS_iso_supervisory_employees: '',
    INS_iso_permanent_employees: '',
    INS_iso_temp_employees: '',
    INS_iso_top_management_employees: '',
    INS_iso_middle_mangement_employees: '',
    templateName: 'Trademark-and-Iso',
    paymentAmount: '0',
  });

  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const signatureFileRef = useRef(null);
  const supportDocFileRef = useRef(null);
  const [userId, setUserId] = useState(null);

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

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'testify');
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxggxnjjw'}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err);
      throw new Error('File upload failed');
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFileUploading(true);
    setError('');
    
    try {
      const fileUrl = await uploadToCloudinary(file);
      setForm({ ...form, [fieldName]: fileUrl });
      setSuccess(`${fieldName.replace('INS_', '').replace(/_/g, ' ')} uploaded successfully!`);

      setTimeout(() => {
        setSuccess(''); 
      }, 3000);

    } catch (err) {
      setError(`Failed to upload file. Please try again.`);
      console.error(err);
    } finally {
      setFileUploading(false);
    }
  };

  const saveApplicationToFirebase = async (pdfUrl) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Check if an application with the same template name already exists for this user
  const applicationsRef = collection(db, 'applications');
  const q = query(
    applicationsRef,
    where('userId', '==', userId),
    where('templateName', '==', form.templateName)
  );

  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    throw new Error(`You've already submitted an application.`);
  }

  // If no existing application found, proceed with saving
  const applicationData = {
    ...form,
    userId,
    status: 'In Review',
    customService: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...(pdfUrl && { generatedPdfUrl: pdfUrl }),
  };

  const docRef = await addDoc(collection(db, 'applications'), applicationData);
  return { id: docRef.id, pdfUrl };
};

//  const convertDocxToPdf = async (docxBlob) => {
//   try {
//     const formData = new FormData();
//     const docxFile = new File([docxBlob], 'document.docx', { 
//       type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
//     });
//     formData.append('file', docxFile);

//     const response = await fetch('/api/convert-to-pdf', {
//       method: 'POST',
//       body: formData
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Conversion failed');
//     }

//     return await response.blob();
//   } catch (err) {
//     console.error('PDF conversion failed:', err);
//     throw new Error('Failed to convert document to PDF. Please try again later.');
//   }
// };

const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Please sign in to submit the application');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Generate the DOCX document
      const docxResponse = await axios.post('/api/fill-docx', form, {
        responseType: 'blob',
      });
      
      const docxBlob = new Blob([docxResponse.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // 2. Convert DOCX to PDF
      // const pdfBlob = await convertDocxToPdf(docxBlob);
      
      // // 3. Upload PDF to Cloudinary
      // const pdfFile = new File([pdfBlob], 'Filled_Application.pdf', {
      //   type: 'application/pdf',
      // });
      
      // // const pdfUrl = await uploadToCloudinary(pdfFile);

      // 4. Save to Firebase
      await saveApplicationToFirebase();
      setSuccess('Application submitted successfully!');

      // // 5. Download the PDF
      // const url = window.URL.createObjectURL(docxBlob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'Filled_Application.docx');
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);


      setTimeout(() => {
         window.location.href = '/dashboard/user?tab=your-forms';
      }, 2000);
     

    } catch (err) {
      console.error('Failed to process application:', err);
      setError(err.message || 'Failed to process application. Please try again.');
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
              TRADEMARK & ISO DATA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trademark Fields */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <select
                  name="INS_tm_title"
                  value={form.INS_tm_title}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="INS_tm_full_name"
                  value={form.INS_tm_full_name}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Designation</label>
                      <input
                        type="text"
                        name="INS_tm_designation"
                        value={form.INS_tm_designation}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>
                      
                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Organization/House</label>
                      <input
                        type="text"
                        name="INS_tm_company_name"
                        value={form.INS_tm_company_name}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="INS_tm_house_name"
                        value={form.INS_tm_house_name}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="INS_tm_location"
                        value={form.INS_tm_location}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Landmark</label>
                      <input
                        type="text"
                        name="INS_tm_landmark"
                        value={form.INS_tm_landmark}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">District</label>
                      <input
                        type="text"
                        name="INS_tm_district"
                        value={form.INS_tm_district}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Pincode</label>
                      <input
                        type="text"
                        name="INS_tm_pincode"
                        value={form.INS_tm_pincode}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="INS_tm_state"
                        value={form.INS_tm_state}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        name="INS_tm_contact_number"
                        value={form.INS_tm_contact_number}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="INS_tm_email"
                        value={form.INS_tm_email}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                      <input
                        type="text"
                        name="INS_tm_brand_name"
                        value={form.INS_tm_brand_name}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Class</label>
                      <input
                        type="text"
                        name="INS_tm_class"
                        value={form.INS_tm_class}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        defaultValue={'0'}
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Goods/Services with full & specific details</label>
                      <input
                        type="text"
                        name="INS_tm_goods_services"
                        value={form.INS_tm_goods_services}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Additional Goods/Services</label>
                      <input
                        type="text"
                        name="INS_tm_additional_goods_services"
                        value={form.INS_tm_additional_goods_services}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Brand Using Since</label>
                      <input
                        type="text"
                        name="INS_tm_brand_since"
                        value={form.INS_tm_brand_since}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        required
                      />
                      </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="INS_tm_date"
                  value={form.INS_tm_date}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              {/* File Uploads */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-3">
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Signature File</label>
                  <input
                    type="file"
                    ref={signatureFileRef}
                    onChange={(e) => handleFileUpload(e, 'INS_tm_signature_file')}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#401B71] file:text-white
                      hover:file:bg-[#7F1C75]"
                    accept="image/*,.pdf"
                    disabled={fileUploading}
                    required
                  />
                  {form.INS_tm_signature_file && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Uploaded: </span>
                      <a 
                        href={form.INS_tm_signature_file} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#401B71] hover:underline text-sm"
                      >
                        View File
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Document</label>
                  <input
                    type="file"
                    ref={supportDocFileRef}
                    onChange={(e) => handleFileUpload(e, 'INS_tm_support_doc_file')}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#401B71] file:text-white
                      hover:file:bg-[#7F1C75]"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    disabled={fileUploading}
                  />
                  {form.INS_tm_support_doc_file && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Uploaded: </span>
                      <a 
                        href={form.INS_tm_support_doc_file} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#401B71] hover:underline text-sm"
                      >
                        View File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-orange-200">
              ISO Certification BASIC DATA SHEET
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Client Name</label>
                      <input
                        type="text"
                        name="INS_iso_client_name"
                        value={form.INS_iso_client_name}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>
                      
                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">District</label>
                      <input
                        type="text"
                        name="INS_iso_district"
                        value={form.INS_iso_district}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="INS_iso_state"
                        value={form.INS_iso_state}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Standards</label>
                      <input
                        type="text"
                        name="INS_iso_standards"
                        value={form.INS_iso_standards}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <input
                        type="text"
                        name="INS_iso_contact_person"
                        value={form.INS_iso_contact_person}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Contact Designation</label>
                      <input
                        type="text"
                        name="INS_iso_contact_designation"
                        value={form.INS_iso_contact_designation}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        name="INS_iso_contact_number"
                        value={form.INS_iso_contact_number}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        name="INS_iso_contact_email"
                        value={form.INS_iso_contact_email}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Full Address</label>
                      <input
                        type="text"
                        name="INS_iso_full_address"
                        value={form.INS_iso_full_address}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Pincode</label>
                      <input
                        type="text"
                        name="INS_iso_pincode"
                        value={form.INS_iso_pincode}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Address District</label>
                      <input
                        type="text"
                        name="INS_iso_address_district"
                        value={form.INS_iso_address_district}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Address State</label>
                      <input
                        type="text"
                        name="INS_iso_address_state"
                        value={form.INS_iso_address_state}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Address Landmark</label>
                      <input
                        type="text"
                        name="INS_iso_address_landmark"
                        value={form.INS_iso_address_landmark}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Organization Type</label>
                      <input
                        type="text"
                        name="INS_iso_org_type"
                        value={form.INS_iso_org_type}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Business Activities</label>
                      <input
                        type="text"
                        name="INS_iso_business_activities"
                        value={form.INS_iso_business_activities}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Branches</label>
                      <input
                        type="text"
                        name="INS_iso_branches"
                        value={form.INS_iso_branches}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Management Level Employees</label>
                      <input
                        type="number"
                        name="INS_iso_mgmt_level_employees"
                        value={form.INS_iso_mgmt_level_employees}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        min="0"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Supervisory Employees</label>
                      <input
                        type="number"
                        name="INS_iso_supervisory_employees"
                        value={form.INS_iso_supervisory_employees}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        min="0"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Permanent Employees</label>
                      <input
                        type="number"
                        name="INS_iso_permanent_employees"
                        value={form.INS_iso_permanent_employees}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        min="0"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Temporary Employees</label>
                      <input
                        type="number"
                        name="INS_iso_temp_employees"
                        value={form.INS_iso_temp_employees}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        min="0"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Top Management Employees</label>
                      <input
                        type="number"
                        name="INS_iso_top_management_employees"
                        value={form.INS_iso_top_management_employees}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        min="0"
                      />
                      </div>

                      <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Middle Management Employees</label>
                      <input
                        type="number"
                        name="INS_iso_middle_mangement_employees"
                        value={form.INS_iso_middle_mangement_employees}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                        min="0"
                      />
                      </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Total Employees</label>
                <input
                  type="number"
                  name="INS_iso_total_employees"
                  value={form.INS_iso_total_employees}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}