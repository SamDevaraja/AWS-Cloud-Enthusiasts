import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Compass, RefreshCw, AlertCircle, Sparkles, User, Mail, GraduationCap, ClipboardList } from 'lucide-react';
import api from '../utils/api';

export default function Register() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Multi-step Wizard States
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    fetchFormConfig();
  }, [eventId, navigate]);

  const fetchFormConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch event details and form config in parallel
      const [eventRes, formRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/form`)
      ]);

      if (eventRes.data.success && formRes.data.success) {
        const eventData = eventRes.data.data;
        setEvent(eventData);
        if (eventData.status === 'Completed') {
          setError('Registration has closed for this event because the event has completed.');
          setLoading(false);
          return;
        }
        const fields = formRes.data.data.fields || [];
        setFormFields(fields);
        
        // Initialize form data with empty values for each field
        const initialData = {};
        fields.forEach(field => {
          initialData[field.field_name] = '';
        });
        setFormData(initialData);
      } else {
        setError('Failed to fetch registration form config.');
      }
    } catch (err) {
      console.error('Registration form init error:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear validation error when user types
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  // Split fields into default vs custom fields
  const defaultFields = formFields.filter(f => f.is_default);
  const customFields = formFields.filter(f => !f.is_default);

  // Step 1 Validation: Default Fields
  const validateStep1 = () => {
    const errors = {};
    let isValid = true;

    defaultFields.forEach(field => {
      const val = formData[field.field_name];
      if (field.is_required && (!val || String(val).trim() === '')) {
        errors[field.field_name] = `${field.field_label} is required`;
        isValid = false;
      }
      
      // Email validation
      if (field.field_type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          errors[field.field_name] = 'Enter a valid email address';
          isValid = false;
        } else if (!val.toLowerCase().endsWith('@rajalakshmi.edu.in')) {
          errors[field.field_name] = 'Email must be a valid @rajalakshmi.edu.in address';
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // Step 2 Validation: Custom Fields
  const validateStep2 = () => {
    const errors = {};
    let isValid = true;

    customFields.forEach(field => {
      const val = formData[field.field_name];
      if (field.is_required && (!val || String(val).trim() === '')) {
        errors[field.field_name] = `${field.field_label} is required`;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        // If there are no custom fields, jump directly to step 3 (review)
        if (customFields.length === 0) {
          setCurrentStep(3);
        } else {
          setCurrentStep(2);
        }
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 3) {
      if (customFields.length === 0) {
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const submitData = {
        email: formData.Email || formData.email,
        registerNumber: formData['Register Number'] || formData.registerNumber || formData.register_number,
        responses: formData
      };

      const response = await api.post(`/events/${eventId}/register`, submitData);

      if (response.data && response.data.success) {
        const ticketData = response.data.data; // { registrationId, ticketId, qrCodeUrl }
        
        // Save to LocalStorage for "My Tickets"
        const savedTickets = JSON.parse(localStorage.getItem('cloud_enthusiasts_tickets') || '[]');
        
        // Prevent duplicates in LocalStorage
        const exists = savedTickets.some(t => t.ticketId === ticketData.ticketId);
        if (!exists) {
          savedTickets.push({
            ticketId: ticketData.ticketId,
            regId: submitData.registerNumber,
            eventId: eventId,
            eventTitle: event.title,
            date: event.date,
            time: event.time,
            name: formData.Name || formData.name || 'Participant',
            email: submitData.email,
            qrCodeUrl: ticketData.qrCodeUrl
          });
          localStorage.setItem('cloud_enthusiasts_tickets', JSON.stringify(savedTickets));
        }

        // Navigate to success page
        navigate(`/registration-success/${ticketData.ticketId}`);
      } else {
        setError('Submission failed. Please check form data.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Duplicate registration or capacity limit exceeded.');
      setSubmitting(false);
      // Fallback: take user back to step 1 to correct fields
      setCurrentStep(1);
    }
  };

  const renderStepIndicator = () => {
    const stepsCount = customFields.length === 0 ? 2 : 3;
    const labels = customFields.length === 0 
      ? ['Contact Info', 'Review & Confirm']
      : ['Contact Info', 'Additional Info', 'Review & Confirm'];

    const getStepIndex = (step) => {
      if (customFields.length === 0 && step === 3) return 2;
      return step;
    };

    return (
      <div className="flex items-center justify-center space-x-4 mb-10">
        {labels.map((lbl, idx) => {
          const stepNum = idx + 1;
          const displayStep = getStepIndex(currentStep);
          const active = displayStep === stepNum;
          const done = displayStep > stepNum;

          return (
            <React.Fragment key={lbl}>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                  done 
                    ? 'bg-[#005E63] text-white' 
                    : active 
                      ? 'bg-[#005E63] text-white ring-4 ring-[#BFE3DE]' 
                      : 'bg-[#2F3437]/10 text-[#2F3437]/60'
                }`}>
                  {done ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  active ? 'text-[#005E63] font-bold' : 'text-[#2F3437]/50'
                }`}>
                  {lbl}
                </span>
              </div>
              {idx < labels.length - 1 && (
                <div className="w-10 h-0.5 bg-[#2F3437]/10" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#2F3437]/60">Configuring event form fields...</p>
      </div>
    );
  }

  if (error && currentStep === 1 && !event) {
    return (
      <div className="max-w-xl mx-auto my-20 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-extrabold text-xl mb-2">Form Error</h3>
        <p className="text-sm text-red-700/80 mb-6">{error}</p>
        <Link to="/events" className="inline-flex items-center space-x-1 bg-red-800 hover:bg-red-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F3EB]/15 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Back navigation */}
        <Link to={`/events/${eventId}`} className="inline-flex items-center space-x-2 text-[#005E63] hover:text-[#004F54] font-semibold mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </Link>

        {/* Wizard Panel */}
        <div className="bg-[#F7F7F5] rounded-3xl p-8 shadow-lg border border-[#005E63]/5">
          <div className="text-center mb-8">
            <span className="inline-flex items-center space-x-1 bg-[#BFE3DE]/30 text-[#005E63] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Event Registration</span>
            </span>
            <h2 className="font-extrabold text-2xl text-[#2F3437] font-display line-clamp-1">
              {event?.title}
            </h2>
            <p className="text-xs text-[#2F3437]/60 mt-1">
              Please fill in your details to secure a seat pass.
            </p>
          </div>

          {renderStepIndicator()}

          {/* Form Content */}
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
            
            {/* Step 1: Default Fields */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                {defaultFields.map(field => {
                  const isName = field.field_name.toLowerCase() === 'name';
                  const isEmail = field.field_name.toLowerCase() === 'email';
                  const isReg = field.field_name.toLowerCase().includes('register') || field.field_name.toLowerCase().includes('roll');
                  const isDept = field.field_name.toLowerCase() === 'department';

                  const Icon = isName ? User : isEmail ? Mail : isReg ? ClipboardList : GraduationCap;

                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-sm font-bold text-[#2F3437]/80">
                        {field.field_label} {field.is_required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#005E63]">
                          <Icon className="w-5 h-5 shrink-0" />
                        </div>
                        <input
                          type={field.field_type}
                          required={field.is_required}
                          value={formData[field.field_name] || ''}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                          placeholder={`Enter your ${field.field_label.toLowerCase()}...`}
                          className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-[#2F3437] focus:outline-none focus:ring-2 focus:ring-[#005E63] text-sm transition ${
                            validationErrors[field.field_name] 
                              ? 'border-red-400 focus:ring-red-400' 
                              : 'border-[#005E63]/10 bg-white'
                          }`}
                        />
                      </div>
                      {validationErrors[field.field_name] && (
                        <p className="text-xs text-red-500 font-medium">{validationErrors[field.field_name]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 2: Custom fields dynamic rendering */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                {customFields.map(field => {
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-sm font-bold text-[#2F3437]/80">
                        {field.field_label} {field.is_required && <span className="text-red-500">*</span>}
                      </label>

                      {field.field_type === 'select' ? (
                        <select
                          required={field.is_required}
                          value={formData[field.field_name] || ''}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                          className={`block w-full px-4 py-3 border rounded-xl text-[#2F3437] focus:outline-none focus:ring-2 focus:ring-[#005E63] text-sm bg-white transition ${
                            validationErrors[field.field_name]
                              ? 'border-red-400'
                              : 'border-[#005E63]/10'
                          }`}
                        >
                          <option value="">Select option...</option>
                          {(Array.isArray(field.select_options)
                            ? field.select_options
                            : typeof field.select_options === 'string'
                              ? JSON.parse(field.select_options)
                              : []
                          ).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.field_type}
                          required={field.is_required}
                          value={formData[field.field_name] || ''}
                          placeholder={`Enter ${field.field_label.toLowerCase()}...`}
                          onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                          className={`block w-full px-4 py-3 border rounded-xl text-[#2F3437] focus:outline-none focus:ring-2 focus:ring-[#005E63] text-sm bg-white transition ${
                            validationErrors[field.field_name]
                              ? 'border-red-400'
                              : 'border-[#005E63]/10'
                          }`}
                        />
                      )}

                      {validationErrors[field.field_name] && (
                        <p className="text-xs text-red-500 font-medium">{validationErrors[field.field_name]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 3: Review Answers & Submission */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="bg-[#BFE3DE]/10 border border-[#005E63]/10 rounded-2xl p-6 space-y-4">
                  <h4 className="font-extrabold text-sm text-[#005E63] uppercase tracking-wider border-b border-[#005E63]/10 pb-2">
                    Summary Review
                  </h4>
                  <div className="divide-y divide-[#005E63]/5 space-y-3 text-sm">
                    {formFields.map(f => (
                      <div key={f.id} className="flex justify-between items-start pt-3 first:pt-0 gap-4">
                        <span className="text-[#2F3437]/60 font-semibold">{f.field_label}:</span>
                        <span className="font-bold text-[#2F3437] text-right">{formData[f.field_name] || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-[#005E63]/10">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-1.5 border border-[#005E63]/20 hover:bg-[#BFE3DE]/20 text-[#2F3437] font-bold py-2.5 px-5 rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-1.5 bg-[#005E63] hover:bg-[#004F54] text-white font-bold py-2.5 px-6 rounded-xl transition shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-1.5 bg-[#005E63] hover:bg-[#004F54] text-white font-extrabold py-3 px-8 rounded-xl transition shadow-md disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Register</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
