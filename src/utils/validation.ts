/**
 * Validation utilities for the Order Placement checkout form
 */

export interface ValidationErrors {
  customerName?: string;
  studentId?: string;
  universityEmail?: string;
  personalEmail?: string;
  phoneNumber?: string;
  batch?: string;
  colour?: string;
  size?: string;
  quantity?: string;
  bkashNumber?: string;
  transactionId?: string;
  deliveryAddress?: string;
}

export const validateStudentId = (id: string): string | null => {
  if (!id || !id.trim()) return 'Student ID is required.';
  const cleaned = id.trim();
  // CUET student IDs are typically 7 digits (e.g. 2104001, 1804020) or prefixed with 'u' (e.g. u2104001)
  if (!/^(u|U)?\d{6,8}$/.test(cleaned)) {
    return 'Enter a valid student ID (e.g. 2104001).';
  }
  return null;
};

export const validateUniversityEmail = (email: string): string | null => {
  if (!email || !email.trim()) return 'University email is required.';
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    return 'Enter a valid email address.';
  }
  // Helpful suggestion if not cuet.ac.bd
  if (!cleaned.endsWith('@cuet.ac.bd') && !cleaned.includes('cuet')) {
    return 'Please use your official CUET student email (e.g. uXXXXXXX@cuet.ac.bd).';
  }
  return null;
};

export const validatePersonalEmail = (email?: string): string | null => {
  if (!email || !email.trim()) return null; // Optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Enter a valid email address.';
  }
  return null;
};

export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone || !phone.trim()) return 'Phone number is required.';
  const cleaned = phone.trim().replace(/[\s-]/g, '');
  // BD phone number format: (+8801... or 013-019 followed by 8 digits)
  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  if (!bdPhoneRegex.test(cleaned)) {
    return 'Enter a valid 11-digit Bangladeshi phone number (e.g. 017XXXXXXXX).';
  }
  return null;
};

export const validateTransactionId = (trxId: string): string | null => {
  if (!trxId || !trxId.trim()) return 'bKash Transaction ID is required.';
  const cleaned = trxId.trim();
  if (cleaned.length < 8) {
    return 'Transaction ID must be at least 8 characters.';
  }
  if (!/^[a-zA-Z0-9]+$/.test(cleaned)) {
    return 'Transaction ID must only contain letters and numbers.';
  }
  return null;
};

export const validateOrderForm = (data: {
  customerName: string;
  studentId: string;
  universityEmail: string;
  personalEmail?: string;
  phoneNumber: string;
  batch: string;
  colour: string;
  size: string;
  quantity: number;
  bkashNumber: string;
  transactionId: string;
  deliveryAddress: string;
}): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  if (!data.customerName || !data.customerName.trim()) {
    errors.customerName = 'Full name is required.';
  } else if (data.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your real full name.';
  }

  const studentIdErr = validateStudentId(data.studentId);
  if (studentIdErr) errors.studentId = studentIdErr;

  const emailErr = validateUniversityEmail(data.universityEmail);
  if (emailErr) errors.universityEmail = emailErr;

  const personalEmailErr = validatePersonalEmail(data.personalEmail);
  if (personalEmailErr) errors.personalEmail = personalEmailErr;

  const phoneErr = validatePhoneNumber(data.phoneNumber);
  if (phoneErr) errors.phoneNumber = phoneErr;

  if (!data.batch || !data.batch.trim()) {
    errors.batch = 'Please select your batch.';
  }

  if (!data.colour || !data.colour.trim()) {
    errors.colour = 'Please choose a hoodie colour.';
  }

  if (!data.size || !data.size.trim()) {
    errors.size = 'Please choose a size.';
  }

  if (!data.quantity || data.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  } else if (data.quantity > 20) {
    errors.quantity = 'For bulk orders over 20 pieces, please contact us directly.';
  }

  const bkashErr = validatePhoneNumber(data.bkashNumber);
  if (bkashErr) errors.bkashNumber = 'Enter a valid sender bKash number.';

  const trxErr = validateTransactionId(data.transactionId);
  if (trxErr) errors.transactionId = trxErr;

  if (!data.deliveryAddress || !data.deliveryAddress.trim()) {
    errors.deliveryAddress = 'Delivery address or hall name is required.';
  } else if (data.deliveryAddress.trim().length < 5) {
    errors.deliveryAddress = 'Please specify your hall/room number or complete address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
