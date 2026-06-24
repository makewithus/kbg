'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function IsoForm2() {
  const [form, setForm] = useState({
    // ISO Certification fields
    INS_clientRefYear: '',
    INS_accreditationBody: '',
    INS_clientName: '',
    INS_place: '',
    INS_remarks: '',
    INS_branch: '',
    INS_executedBy: '',
    INS_officeRef: '',
    INS_isoStandards: [],
    INS_contactPerson: '',
    INS_designation: '',
    INS_mobile: '',
    INS_landline: '',
    INS_executionDate: new Date().toISOString().split('T')[0],
    INS_expDate: '',
    INS_firstSurveillance: '',
    INS_secondSurveillance: '',
    INS_orgAddress: '',
    INS_managementType: '',
    INS_businessActivities: '',
    INS_certificationScope: '',
    INS_branches: '',
    INS_totalEmployees: '',
    INS_topManagement: '',
    INS_middleManagement: '',
    INS_permanentEmployees: '',
    INS_otherEmployees: '',
    INS_additionalServices: '',
    INS_auditDate: '',
    INS_auditTime: '',
    INS_auditor: '',
    INS_auditorType: '',
    INS_totalAmount: '',
    INS_advanceReceived: '',
    INS_chequeNo: '',
    INS_balance: '',
    INS_paymentDate: '',
    INS_bankAt: '',
    INS_firstSurveillanceFee: '',
    INS_secondSurveillanceFee: '',
    INS_paymentSchedule: '',
    INS_authorizedSignature: '',
    templateName: 'ISO Form',
    paymentAmount: '0',
  });

  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    if (e.target.name === 'INS_isoStandards') {
      const options = Array.from(e.target.selectedOptions, option => option.value);
      setForm({ ...form, [e.target.name]: options });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
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
      const docxResponse = await axios.post('/api/fill-docx', form, {
        responseType: 'blob',
      });
      
      const docxBlob = new Blob([docxResponse.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      await saveApplicationToFirebase();
      setSuccess('Application submitted successfully!');

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

  const isoStandards = [
    { value: '9001:2015', label: 'ISO 9001:2015' },
    { value: '14001:2004', label: 'ISO 14001:2004' },
    { value: 'OHSAS 18001:2007', label: 'OHSAS 18001:2007' },
    { value: 'HACCP/22000:2005', label: 'HACCP/22000:2005' },
    { value: 'ISO/TS 16949:2009', label: 'ISO/TS 16949:2009' },
    { value: '20000-1:2005', label: 'ISO 20000-1:2005' },
    { value: '13485:2003', label: 'ISO 13485:2003' },
    { value: '27001:2005', label: 'ISO 27001:2005' },
    { value: 'CE Marking', label: 'CE Marking' },
    { value: 'Others', label: 'Others' }
  ];

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
              ISO CERTIFICATION APPLICATION
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Client Ref No & Year</label>
                <input
                  type="text"
                  name="INS_clientRefYear"
                  value={form.INS_clientRefYear}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Accreditation Body</label>
                <select
                  name="INS_accreditationBody"
                  value={form.INS_accreditationBody}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                >
                  <option value="NABCB">NABCB</option>
                  <option value="QCI">QCI</option>
                  <option value="UKAS">UKAS</option>
                  <option value="ANAB">ANAB</option>
                  <option value="DAkkS">DAkkS</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  type="text"
                  name="INS_clientName"
                  value={form.INS_clientName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Place</label>
                <input
                  type="text"
                  name="INS_place"
                  value={form.INS_place}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Remarks / Special Comments</label>
                <textarea
                  name="INS_remarks"
                  value={form.INS_remarks}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="2"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <input
                  type="text"
                  name="INS_branch"
                  value={form.INS_branch}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Executed By</label>
                <input
                  type="text"
                  name="INS_executedBy"
                  value={form.INS_executedBy}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Office Ref</label>
                <input
                  type="text"
                  name="INS_officeRef"
                  value={form.INS_officeRef}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">ISO Standard(s) Applied for</label>
                <select
                  name="INS_isoStandards"
                  multiple
                  value={form.INS_isoStandards}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75] h-auto min-h-[42px]"
                  required
                >
                  {isoStandards.map((standard) => (
                    <option key={standard.value} value={standard.value}>
                      {standard.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple standards</p>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <input
                  type="text"
                  name="INS_contactPerson"
                  value={form.INS_contactPerson}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  name="INS_designation"
                  value={form.INS_designation}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="tel"
                  name="INS_mobile"
                  value={form.INS_mobile}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Land Line STD Code</label>
                <input
                  type="text"
                  name="INS_landline"
                  value={form.INS_landline}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Date of execution</label>
                <input
                  type="date"
                  name="INS_executionDate"
                  value={form.INS_executionDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Exp Date of Certification</label>
                <input
                  type="date"
                  name="INS_expDate"
                  value={form.INS_expDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">1st Surveillance due on</label>
                <input
                  type="date"
                  name="INS_firstSurveillance"
                  value={form.INS_firstSurveillance}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">2nd Surveillance due on</label>
                <input
                  type="date"
                  name="INS_secondSurveillance"
                  value={form.INS_secondSurveillance}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Organization Name and Address</label>
                <textarea
                  name="INS_orgAddress"
                  value={form.INS_orgAddress}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="3"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Type of Management</label>
                <select
                  name="INS_managementType"
                  value={form.INS_managementType}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                >
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="LLP">LLP</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Government">Government</option>
                  <option value="NGO">NGO</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Main Business / Activities</label>
                <textarea
                  name="INS_businessActivities"
                  value={form.INS_businessActivities}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="2"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Scope of Certification</label>
                <textarea
                  name="INS_certificationScope"
                  value={form.INS_certificationScope}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="2"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">No of Branches and locations</label>
                <input
                  type="text"
                  name="INS_branches"
                  value={form.INS_branches}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Total No of employees</label>
                <input
                  type="number"
                  name="INS_totalEmployees"
                  value={form.INS_totalEmployees}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Management Level/Top management</label>
                <input
                  type="number"
                  name="INS_topManagement"
                  value={form.INS_topManagement}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Supervisory level/Middle management</label>
                <input
                  type="number"
                  name="INS_middleManagement"
                  value={form.INS_middleManagement}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Employees - Permanent</label>
                <input
                  type="number"
                  name="INS_permanentEmployees"
                  value={form.INS_permanentEmployees}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Other employees & Temporary staff</label>
                <input
                  type="number"
                  name="INS_otherEmployees"
                  value={form.INS_otherEmployees}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Additional Services selected/offered</label>
                <input
                  type="text"
                  name="INS_additionalServices"
                  value={form.INS_additionalServices}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Convenient Audit Date</label>
                <input
                  type="date"
                  name="INS_auditDate"
                  value={form.INS_auditDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="INS_auditTime"
                  value={form.INS_auditTime}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Auditor</label>
                <input
                  type="text"
                  name="INS_auditor"
                  value={form.INS_auditor}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Auditor Type</label>
                <select
                  name="INS_auditorType"
                  value={form.INS_auditorType}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                >
                  <option value="QCI Registered">QCI Registered</option>
                  <option value="Internal Qualified">Internal Qualified</option>
                  <option value="Third Party">Third Party</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Total Amount Rs</label>
                <input
                  type="number"
                  name="INS_totalAmount"
                  value={form.INS_totalAmount}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Advance received</label>
                <input
                  type="number"
                  name="INS_advanceReceived"
                  value={form.INS_advanceReceived}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Cheque/DD No</label>
                <input
                  type="text"
                  name="INS_chequeNo"
                  value={form.INS_chequeNo}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <input
                  type="number"
                  name="INS_balance"
                  value={form.INS_balance}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Dated on</label>
                <input
                  type="date"
                  name="INS_paymentDate"
                  value={form.INS_paymentDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Bank at</label>
                <input
                  type="text"
                  name="INS_bankAt"
                  value={form.INS_bankAt}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">1st surveillance Fee</label>
                <input
                  type="number"
                  name="INS_firstSurveillanceFee"
                  value={form.INS_firstSurveillanceFee}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">2nd surveillance Fee</label>
                <input
                  type="number"
                  name="INS_secondSurveillanceFee"
                  value={form.INS_secondSurveillanceFee}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Agreed Payment Schedule</label>
                <textarea
                  name="INS_paymentSchedule"
                  value={form.INS_paymentSchedule}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75]"
                  rows="2"
                  required
                />
              </div>
              
              <div className="space-y-1 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Signature of Authorized Person</label>
                <input
                  type="file"
                  ref={signatureFileRef}
                  onChange={(e) => handleFileUpload(e, 'INS_authorizedSignature')}
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
                {form.INS_authorizedSignature && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Uploaded: </span>
                    <a 
                      href={form.INS_authorizedSignature} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#401B71] hover:underline text-sm"
                    >
                      View Signature
                    </a>
                  </div>
                )}
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