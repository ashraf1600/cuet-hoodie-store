import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Printer, ShoppingBag, Copy, Check, QrCode } from 'lucide-react';
import { getOrderByNumber } from '../utils/orderStorage';

export const Confirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const stateOrder = location.state?.order;
  const submission: string | undefined = location.state?.submission;

  // Retrieve order either from route state or LocalStorage
  const order = stateOrder || (orderNumber ? getOrderByNumber(orderNumber) : undefined);

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(prev => (prev === type ? null : prev));
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-anton text-3xl uppercase text-paper">Order Reference Missing</h2>
        <p className="font-body text-sm text-muted">
          Could not locate details for order reference <strong>{orderNumber}</strong>.
        </p>
        <Link to="/products" className="btn-outline inline-flex text-xs">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-fade-in">
      {/* Top Success Badge (Hidden on Print) */}
      <div className="text-center space-y-3 no-print">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 size={36} />
        </div>
        <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 block">
          Order Submitted Successfully
        </span>
        <h1 className="font-anton text-4xl sm:text-5xl uppercase tracking-tight text-paper">
          Thank you, {order.customerName}!
        </h1>
        <p className="font-body text-sm text-muted max-w-md mx-auto">
          Your pre-order has been received. Keep your order number safe for pickup or delivery.
        </p>
      </div>

      {/* Prominent Order Number Card (Hidden on Print) */}
      <div className="bg-ink-2 border-2 border-brick-bright/60 p-6 rounded-xs text-center space-y-3 shadow-2xl no-print">
        <span className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold text-muted">
          Your Order Number
        </span>
        <div className="flex items-center justify-center gap-3">
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-brick-bright tracking-wider">
            {order.orderNumber}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(order.orderNumber, 'ordernum')}
            className="p-2 rounded-xs border border-line bg-ink-3 hover:text-brick-bright hover:border-brick-bright transition-colors cursor-pointer text-muted"
            title="Copy Order ID"
          >
            {copiedType === 'ordernum' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
        <p className="font-body text-xs text-muted-dark">
          Order Date: {new Date(order.orderDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </div>

      {/* What happens next (hidden on print) */}
      <div className="border border-line p-5 rounded-xs space-y-2 no-print">
        <h3 className="font-anton text-lg uppercase text-paper tracking-wide">What happens next</h3>
        <ul className="font-body text-xs sm:text-sm text-muted leading-relaxed space-y-1.5 list-disc pl-4">
          {submission === 'not-configured' ? (
            <li className="text-amber-300">Test order: Google Sheet isn’t connected yet, so this order is only saved in this browser.</li>
          ) : (
            <li>Your order has been sent to us. We check your bKash TrxID before printing.</li>
          )}
          <li>Keep your order number <strong className="text-paper">{order.orderNumber}</strong> — you’ll need it for pickup or delivery.</li>
          <li>
            Questions about sizing or delivery? See{' '}
            <Link to="/how-to-order" className="underline underline-offset-2 hover:text-paper">How to order</Link>.
          </li>
        </ul>
      </div>

      {/* Order Details Receipt Box (Formatted for Print Voucher) */}
      <div className="bg-ink-2 border border-line rounded-xs p-6 sm:p-8 space-y-6 print-receipt-voucher">
        {/* Printable Official Header (Shows cleanly when printed) */}
        <div className="print-only pb-4 mb-4 border-b-2 print-border-strong text-center space-y-1">
          <div className="font-anton text-2xl uppercase tracking-wider text-black">
            BRICK &amp; BOLT — CUET CAMPUS MERCHANDISE
          </div>
          <div className="font-body text-xs text-gray-700 uppercase tracking-widest">
            Chittagong University of Engineering &amp; Technology · Official Pre-Order Voucher
          </div>
          <div className="text-[10px] text-gray-500 font-mono pt-1">
            VOUCHER ID: {order.orderNumber} · ISSUED: {new Date(order.orderDate).toLocaleString()}
          </div>
        </div>

        <div className="border-b border-line/60 pb-3 flex items-center justify-between no-print">
          <div>
            <h2 className="font-anton text-xl uppercase tracking-wide text-paper">
              Order Receipt &amp; Summary
            </h2>
            <p className="font-body text-[11px] text-muted-dark">Official confirmation slip for pickup</p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-outline py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-paper hover:text-ink transition-colors"
          >
            <Printer size={14} />
            <span>Print Receipt Voucher</span>
          </button>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-body">
          {/* Customer & Student Details */}
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-line/40 pb-4 sm:pb-0 sm:pr-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-dark block">
              Student Information
            </span>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Full Name:</span>
              <span className="text-paper font-semibold">{order.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Student ID:</span>
              <span className="text-paper font-mono font-semibold">{order.studentId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">University Email:</span>
              <span className="text-paper">{order.universityEmail}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Phone Number:</span>
              <span className="text-paper font-mono">{order.phoneNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Batch:</span>
              <span className="text-brick-bright font-semibold">{order.batch}</span>
            </div>
            {order.department && (
              <div className="flex justify-between py-1">
                <span className="text-muted">Department:</span>
                <span className="text-paper font-semibold">{order.department}</span>
              </div>
            )}
          </div>

          {/* Product & Payment Details */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-dark block">
              Product &amp; Payment
            </span>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Item:</span>
              <span className="text-paper font-semibold">{order.hoodieName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Colour &amp; Size:</span>
              <span className="text-paper">{order.colour} · Size {order.size}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">Quantity:</span>
              <span className="text-paper font-semibold">{order.quantity} pcs</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">bKash Sender:</span>
              <span className="text-paper font-mono">{order.bkashNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/20">
              <span className="text-muted">bKash TrxID:</span>
              <span className="text-emerald-400 font-mono font-bold">{order.transactionId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Total Paid:</span>
              <span className="font-anton text-base text-brick-bright">৳{order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="border-t border-line/60 pt-4 text-xs font-body space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-dark block">
            Pickup / Delivery Destination
          </span>
          <p className="text-paper font-medium">{order.deliveryAddress}</p>
          {order.instructions && (
            <p className="text-muted italic">Note: {order.instructions}</p>
          )}
        </div>

        {/* Verification Note for Booth Pickup */}
        <div className="border-t border-line/40 pt-4 flex items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-paper uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Status: Registered &amp; Verified</span>
            </div>
            <div className="text-[11px] text-muted">
              Present this voucher or Order ID <strong className="font-mono text-paper">{order.orderNumber}</strong> at the CUET distribution booth for hoodie collection.
            </div>
          </div>
          <div className="w-16 h-16 border border-line bg-ink-3 rounded-xs flex flex-col items-center justify-center text-muted-dark shrink-0">
            <QrCode size={28} className="text-paper" />
            <span className="text-[8px] font-mono tracking-tighter uppercase text-muted-dark mt-0.5">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav Links (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line/60 no-print">
        <Link
          to="/products"
          className="btn-outline py-2.5 px-6 text-xs font-bold flex items-center gap-1.5"
        >
          <ShoppingBag size={14} />
          <span>Shop More Hoodies</span>
        </Link>

        <Link
          to="/"
          className="font-body text-xs uppercase tracking-wider text-muted hover:text-brick-bright transition-colors"
        >
          Return to Homepage &rarr;
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
