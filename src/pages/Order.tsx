import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, ShoppingBag, Copy, Check } from 'lucide-react';
import FormInput from '../components/FormInput';
import OrderSummary from '../components/OrderSummary';
import { BATCHES, COLOURS, PRODUCTS, getSizeInfo, getVariant, normaliseColour } from '../data/products';
import Cutout from '../components/Cutout';
import { getOrCreateCheckoutOrderNumber, commitOrderNumber } from '../utils/orderGenerator';
import { validateOrderForm, ValidationErrors } from '../utils/validation';
import { saveOrder } from '../utils/orderStorage';
import { getSubmissionMethod, submitOrderToGoogleService } from '../utils/googleSubmission';
import { Order as OrderType } from '../types';

export const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};

  // Design picked on the product page (or The Gateway when arriving directly)
  const initialProduct =
    (stateData.productId
      ? PRODUCTS.find(p => p.id === stateData.productId)
      : PRODUCTS.find(p => p.name === stateData.hoodieName)) || PRODUCTS[0];

  const initialColour = normaliseColour(initialProduct, stateData.colour);
  const initialSize = initialProduct.sizes.includes(stateData.size) ? stateData.size : initialProduct.sizes[0];
  const initialBatch = stateData.batch || "CUET'21";
  const initialDepartment = stateData.department || '';
  const initialQuantity = stateData.quantity || 1;

  // Persistent Order Number for checkout session
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const num = getOrCreateCheckoutOrderNumber();
    setOrderNumber(num);
  }, []);

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [universityEmail, setUniversityEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [batch, setBatch] = useState(initialBatch);
  const [department] = useState(initialDepartment);

  // Product Selection State — customers can switch design and colour here too
  const [productId, setProductId] = useState(initialProduct.id);
  const matchedProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const hoodieName = matchedProduct.name;
  const [colour, setColour] = useState(initialColour);
  const [size, setSize] = useState(initialSize);
  const [quantity, setQuantity] = useState(initialQuantity);
  const unitPrice = matchedProduct.price;
  const imageSrc = getVariant(matchedProduct, colour).cutout;

  const chooseDesign = (id: string) => {
    const next = PRODUCTS.find(p => p.id === id);
    if (!next) return;
    setProductId(id);
    setColour(normaliseColour(next, colour));
    if (!next.sizes.includes(size)) setSize(next.sizes[0]);
  };

  // Copy to clipboard notification state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(prev => (prev === fieldName ? null : prev));
    }, 2000);
  };

  // Payment State
  const [bkashNumber, setBkashNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Delivery State
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  // Validation & Submission
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalPrice = unitPrice * quantity;
  const merchantNumber = import.meta.env.VITE_BKASH_MERCHANT_NUMBER || '017XXXXXXXX';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateOrderForm({
      customerName,
      studentId,
      universityEmail,
      personalEmail,
      phoneNumber,
      batch,
      colour,
      size,
      quantity,
      bkashNumber,
      transactionId,
      deliveryAddress,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(validation.errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const newOrder: OrderType = {
      orderNumber,
      customerName: customerName.trim(),
      studentId: studentId.trim(),
      universityEmail: universityEmail.trim().toLowerCase(),
      personalEmail: personalEmail.trim() ? personalEmail.trim().toLowerCase() : undefined,
      phoneNumber: phoneNumber.trim(),
      batch,
      department: department ? department.trim() : undefined,
      hoodieName,
      colour,
      size,
      quantity,
      unitPrice,
      totalPrice,
      paymentMethod: 'bKash',
      bkashNumber: bkashNumber.trim(),
      transactionId: transactionId.trim().toUpperCase(),
      deliveryAddress: deliveryAddress.trim(),
      instructions: instructions.trim() ? instructions.trim() : undefined,
      orderDate: new Date().toISOString(),
    };

    // 1. Send the order to the Google Sheet / Form — this is the real order record.
    const result = await submitOrderToGoogleService(newOrder);

    if (result.status === 'failed') {
      setSubmitError(
        "We couldn't send your order. Check your internet connection and press Submit again — use the same TrxID, you don't need to pay again."
      );
      setIsSubmitting(false);
      return;
    }
    if (result.status === 'not-configured' && !import.meta.env.DEV) {
      setSubmitError('Online ordering is not open yet. Please contact us to place your order.');
      setIsSubmitting(false);
      return;
    }
    if (result.status === 'not-configured') {
      console.warn('[orders] Google Sheet not set up in .env — this test order is only saved in this browser.');
    }

    // 2. Keep a copy in this browser for the receipt page (a repeat of the same order is fine).
    saveOrder(newOrder);

    // 3. Fresh order number for the next checkout.
    commitOrderNumber(orderNumber);

    navigate(`/confirmation/${orderNumber}`, {
      state: { order: newOrder, submission: result.status },
      replace: true,
    });
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-wider text-muted hover:text-paper transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Catalog</span>
      </Link>

      <div className="border-b border-line/60 pb-6 space-y-2">
        <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-brick-bright">
          Order Placement
        </span>
        <h1 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-paper">
          Checkout &amp; Verification
        </h1>
        <p className="font-body text-xs sm:text-sm text-muted">
          Fill in your student verification details and bKash transaction ID to complete your pre-order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Structured Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10" noValidate>
          {import.meta.env.DEV && getSubmissionMethod() === 'none' && (
            <div className="border border-amber-500/70 bg-amber-950/40 p-4 rounded-xs text-amber-100 text-xs font-body leading-relaxed">
              <strong className="block uppercase tracking-wider mb-1">Developer note — not connected to Google</strong>
              Set <code>VITE_GOOGLE_SHEET_WEBHOOK_URL</code> in <code>.env</code> (see README → “Connect the Google Sheet”) and restart{' '}
              <code>npm run dev</code>. Until then, test orders are only saved in this browser. The live site refuses orders without it.
            </div>
          )}
          {submitError && (
            <div className="bg-red-950/60 border border-red-500/80 p-4 rounded-xs flex items-center gap-3 text-red-200 text-xs font-body">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* ─── Section 1: Student Information ─── */}
          <div className="border border-line bg-ink-2 p-6 rounded-xs space-y-5">
            <div className="border-b border-line/40 pb-3">
              <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-brick-bright">
                Section 1 of 4
              </span>
              <h2 className="font-anton text-xl uppercase tracking-wide text-paper">
                Student Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                name="customerName"
                placeholder="e.g. Ashrafuzzaman Khan"
                required
                value={customerName}
                onChange={e => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                }}
                error={errors.customerName}
              />

              <FormInput
                label="Student ID"
                name="studentId"
                placeholder="e.g. 2104001"
                required
                value={studentId}
                onChange={e => {
                  setStudentId(e.target.value);
                  if (errors.studentId) setErrors({ ...errors, studentId: undefined });
                }}
                error={errors.studentId}
                helperText="CUET 7-digit ID"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="University Email"
                name="universityEmail"
                type="email"
                placeholder="u2104001@cuet.ac.bd"
                required
                value={universityEmail}
                onChange={e => {
                  setUniversityEmail(e.target.value);
                  if (errors.universityEmail) setErrors({ ...errors, universityEmail: undefined });
                }}
                error={errors.universityEmail}
                helperText="Official @cuet.ac.bd address"
              />

              <FormInput
                label="Personal Email (Optional)"
                name="personalEmail"
                type="email"
                placeholder="personal@gmail.com"
                value={personalEmail}
                onChange={e => setPersonalEmail(e.target.value)}
                error={errors.personalEmail}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Contact Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="017XXXXXXXX"
                required
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
                }}
                error={errors.phoneNumber}
                helperText="11-digit Bangladeshi number"
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs uppercase font-bold tracking-wider text-paper/90 flex items-center justify-between">
                  <span>
                    Batch <span className="text-brick-bright">*</span>
                  </span>
                </label>
                <select
                  name="batch"
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full bg-ink-3 border border-line rounded-xs px-3.5 py-2.5 font-body text-sm text-paper focus:outline-none focus:border-paper"
                >
                  {BATCHES.map(
                    b => (
                      <option key={b} value={b} className="bg-ink text-paper">
                        {b}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

          </div>

          {/* ─── Section 2: Product Information (Populated & Locked) ─── */}
          <div className="border border-line bg-ink-2 p-6 rounded-xs space-y-5">
            <div className="border-b border-line/40 pb-3 flex items-center justify-between">
              <div>
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-brick-bright">
                  Section 2 of 4
                </span>
                <h2 className="font-anton text-xl uppercase tracking-wide text-paper">
                  Product &amp; Pricing
                </h2>
              </div>
              <span className="font-mono text-xs bg-ink-3 text-brick-bright border border-line px-2.5 py-1">
                Order ID: {orderNumber}
              </span>
            </div>

            {/* Design picker */}
            <fieldset className="space-y-2.5">
              <legend className="font-body text-xs uppercase font-bold tracking-wider text-paper/90 mb-2.5">Design *</legend>
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.map(p => {
                  const active = p.id === productId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => chooseDesign(p.id)}
                      className={`group flex flex-col items-center gap-2 pt-3 pb-3 border-b-2 transition-colors cursor-pointer ${
                        active ? 'border-brick-bright' : 'border-transparent hover:border-line'
                      }`}
                    >
                      <Cutout
                        src={getVariant(p, normaliseColour(p, colour)).cutout}
                        alt={`${p.name} hoodie`}
                        floor
                        className="w-full h-36 sm:h-44"
                      />
                      <span className="font-body text-[11px] uppercase tracking-[0.18em] text-muted">Design {p.designNumber}</span>
                      <span className={`font-anton text-lg uppercase ${active ? 'text-paper' : 'text-muted'}`}>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <fieldset className="flex flex-col gap-2">
                <legend className="font-body text-xs uppercase font-bold tracking-wider text-paper/90 mb-2">
                  Colour * <span className="text-brick-bright font-semibold normal-case tracking-normal">{colour}</span>
                </legend>
                <div className="flex gap-3">
                  {COLOURS.filter(c => matchedProduct.colours.includes(c.name)).map(c => (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={colour === c.name}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => setColour(c.name)}
                      className={`w-11 h-11 rounded-full p-1 border-2 transition-colors cursor-pointer ${
                        colour === c.name ? 'border-brick-bright' : 'border-line hover:border-paper/60'
                      }`}
                    >
                      <span className="block w-full h-full rounded-full ring-1 ring-white/10" style={{ backgroundColor: c.swatch }} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="order-size" className="font-body text-xs uppercase font-bold tracking-wider text-paper/90">
                    Size *
                  </label>
                  <Link
                    to="/how-to-order#size-chart"
                    target="_blank"
                    className="font-body text-[11px] text-muted hover:text-paper underline underline-offset-2"
                  >
                    Size chart
                  </Link>
                </div>
                <select
                  id="order-size"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  className="w-full bg-ink-3 border border-line rounded-xs px-3 py-2.5 font-body text-sm text-paper focus:outline-none focus:border-paper min-h-11"
                >
                  {matchedProduct.sizes.map(s => {
                    const info = getSizeInfo(s);
                    return (
                      <option key={s} value={s}>
                        {info ? `${s} — chest ${info.chest}", length ${info.length}"` : s}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="Unit Price"
                value={`৳${unitPrice.toLocaleString()}`}
                disabled
                helperText="Fixed merchandise price"
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs uppercase font-bold tracking-wider text-paper/90">
                  Quantity *
                </label>
                <div className="flex items-center border border-line rounded-xs bg-ink-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-10 flex items-center justify-center text-paper hover:bg-ink transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-anton text-base text-paper">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-10 flex items-center justify-center text-paper hover:bg-ink transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <FormInput
                label="Total Price"
                value={`৳${totalPrice.toLocaleString()}`}
                disabled
                helperText="Calculated automatically"
              />
            </div>
          </div>

          {/* ─── Section 3: Payment Information ─── */}
          <div className="border border-line bg-ink-2 p-6 rounded-xs space-y-5">
            <div className="border-b border-line/40 pb-3">
              <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-brick-bright">
                Section 3 of 4
              </span>
              <h2 className="font-anton text-xl uppercase tracking-wide text-paper">
                Payment Information (bKash)
              </h2>
            </div>

            {/* bKash Instructions Banner with 1-Click Fast Copy */}
            <div className="bg-[#1C1613] border border-brick-bright/40 p-4 rounded-xs space-y-3 text-xs font-body">
              <div className="font-bold text-paper uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brick-bright" />
                  bKash &quot;Send Money&quot; Payment Instructions
                </div>
                <span className="text-[10px] text-muted-dark uppercase tracking-widest hidden sm:inline">1-Click Fast Copy</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-muted">
                <li>
                  Open your bKash app and select <strong className="text-paper">Send Money</strong>.
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <span>Enter Receiver bKash Number:</span>
                  <span className="font-mono font-bold text-brick-bright text-sm bg-ink px-2 py-0.5 border border-line rounded-xs">
                    {merchantNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(merchantNumber, 'merchant')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs border border-line bg-ink-3 text-[11px] font-semibold text-paper hover:text-brick-bright hover:border-brick-bright/60 transition-colors cursor-pointer"
                    title="Copy Receiver bKash Number"
                  >
                    {copiedField === 'merchant' ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <span>Enter Total Amount:</span>
                  <strong className="text-paper font-anton text-sm">৳{totalPrice.toLocaleString()}</strong>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(totalPrice.toString(), 'amount')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs border border-line bg-ink-3 text-[11px] font-semibold text-paper hover:text-brick-bright hover:border-brick-bright/60 transition-colors cursor-pointer"
                    title="Copy Total Amount"
                  >
                    {copiedField === 'amount' ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Amount</span>
                      </>
                    )}
                  </button>
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <span>Reference:</span>
                  <strong className="text-paper font-mono font-bold text-sm bg-ink px-2 py-0.5 border border-line rounded-xs">
                    {orderNumber}
                  </strong>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(orderNumber, 'ref')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs border border-line bg-ink-3 text-[11px] font-semibold text-paper hover:text-brick-bright hover:border-brick-bright/60 transition-colors cursor-pointer"
                    title="Copy Order Reference"
                  >
                    {copiedField === 'ref' ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Ref</span>
                      </>
                    )}
                  </button>
                </li>
                <li>Copy the 8+ digit Transaction ID (TrxID) from your bKash SMS/confirmation and enter it below.</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Sender bKash Number"
                name="bkashNumber"
                type="tel"
                placeholder="01XXXXXXXXX"
                required
                value={bkashNumber}
                onChange={e => {
                  setBkashNumber(e.target.value);
                  if (errors.bkashNumber) setErrors({ ...errors, bkashNumber: undefined });
                }}
                error={errors.bkashNumber}
                helperText="The bKash number you sent money from"
              />

              <FormInput
                label="Transaction ID (TrxID)"
                name="transactionId"
                placeholder="e.g. BL9A4K89QZ"
                required
                value={transactionId}
                onChange={e => {
                  setTransactionId(e.target.value.toUpperCase());
                  if (errors.transactionId) setErrors({ ...errors, transactionId: undefined });
                }}
                error={errors.transactionId}
                helperText="8+ character unique bKash TrxID"
              />
            </div>
          </div>

          {/* ─── Section 4: Delivery Information ─── */}
          <div className="border border-line bg-ink-2 p-6 rounded-xs space-y-5">
            <div className="border-b border-line/40 pb-3">
              <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-brick-bright">
                Section 4 of 4
              </span>
              <h2 className="font-anton text-xl uppercase tracking-wide text-paper">
                Delivery Information
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs uppercase font-bold tracking-wider text-paper/90 flex items-center justify-between">
                <span>
                  Delivery / Pickup Address <span className="text-brick-bright">*</span>
                </span>
              </label>
              <textarea
                name="deliveryAddress"
                rows={3}
                placeholder="e.g. Shahid Tareq Huda Hall (Room 312), CUET Campus, or Home courier address"
                required
                value={deliveryAddress}
                onChange={e => {
                  setDeliveryAddress(e.target.value);
                  if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: undefined });
                }}
                className={`w-full bg-ink-3 border rounded-xs px-3.5 py-2.5 font-body text-sm text-paper placeholder:text-muted-dark focus:outline-none transition-colors ${
                  errors.deliveryAddress ? 'border-red-500' : 'border-line focus:border-paper'
                }`}
              />
              {errors.deliveryAddress ? (
                <span className="font-body text-xs text-red-400">{errors.deliveryAddress}</span>
              ) : (
                <span className="font-body text-[11px] text-muted-dark">
                  Specify your CUET residential hall &amp; room, or full address for outside campus courier.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs uppercase font-bold tracking-wider text-paper/90">
                Additional Instructions (Optional)
              </label>
              <input
                type="text"
                name="instructions"
                placeholder="e.g. Please leave with room-mate if unavailable"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="w-full bg-ink-3 border border-line rounded-xs px-3.5 py-2.5 font-body text-sm text-paper placeholder:text-muted-dark focus:outline-none focus:border-paper"
              />
            </div>
          </div>

          {/* Submission Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              <span>
                {isSubmitting ? 'Sending your order…' : `Submit Order · Total ৳${totalPrice.toLocaleString()}`}
              </span>
            </button>
            <p className="font-body text-[11px] text-center text-muted-dark mt-2.5">
              Your order is sent to us with ID {orderNumber}. Keep this number for pickup or delivery.
            </p>
          </div>
        </form>

        {/* Right Column: Live Order Summary Sticky Card */}
        <div className="lg:col-span-5">
          <OrderSummary
            orderNumber={orderNumber}
            hoodieName={hoodieName}
            colour={colour}
            size={size}
            batch={batch}
            department={department}
            quantity={quantity}
            unitPrice={unitPrice}
            totalPrice={totalPrice}
            imageSrc={imageSrc}
            studentName={customerName}
            studentId={studentId}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
