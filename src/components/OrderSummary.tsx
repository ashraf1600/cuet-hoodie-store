import React from 'react';
import { Package, ShieldCheck } from 'lucide-react';
import Cutout from './Cutout';

interface OrderSummaryProps {
  orderNumber: string;
  hoodieName: string;
  colour: string;
  size: string;
  batch: string;
  department?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageSrc?: string;
  studentName?: string;
  studentId?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderNumber,
  hoodieName,
  colour,
  size,
  batch,
  department,
  quantity,
  unitPrice,
  totalPrice,
  imageSrc,
  studentName,
  studentId,
}) => {
  return (
    <div className="bg-ink-2 border border-line rounded-xs p-6 space-y-5 sticky top-24">
      {/* Header with Order Number */}
      <div className="flex items-center justify-between border-b border-line/60 pb-4">
        <div>
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.2em] text-brick-bright">
            Pre-Order Summary
          </span>
          <h3 className="font-anton text-xl tracking-wide uppercase text-paper">
            Your Order
          </h3>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-paper bg-ink-3 border border-line px-2.5 py-1 rounded-xs">
            {orderNumber}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex gap-4 items-center">
        {imageSrc ? (
          <Cutout src={imageSrc} alt={`${hoodieName} hoodie in ${colour}`} floor className="w-24 h-28 shrink-0" />
        ) : (
          <div className="w-16 h-20 bg-ink-3 border border-line rounded-xs flex items-center justify-center text-muted shrink-0">
            <Package size={24} />
          </div>
        )}
        <div className="space-y-1">
          <h4 className="font-anton text-base uppercase text-paper leading-tight">{hoodieName}</h4>
          <p className="font-body text-xs text-muted">
            {colour || 'No colour selected'} · Size {size || '—'} · {batch || '—'}
            {department && <span className="text-brick-bright font-semibold"> ({department})</span>}
          </p>
          <p className="font-body text-xs font-semibold text-paper">
            Qty: {quantity} &times; ৳{unitPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Student Details Preview */}
      {(studentName || studentId) && (
        <div className="bg-ink-3 border border-line/40 rounded-xs p-3 space-y-1 text-xs font-body">
          <div className="text-muted-dark uppercase tracking-wider text-[10px] font-bold">
            Customer / Student
          </div>
          <div className="text-paper font-medium">{studentName || '—'}</div>
          <div className="text-muted">Student ID: {studentId || '—'}</div>
        </div>
      )}

      {/* Calculation Breakdown */}
      <div className="space-y-2 border-t border-line/60 pt-4 text-xs font-body">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="text-paper">৳{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Campus Pickup / Courier Delivery</span>
          <span className="text-brick-bright font-semibold">Included / Free on Campus</span>
        </div>
        <div className="border-t border-line/60 pt-3 flex justify-between items-baseline">
          <span className="font-anton text-lg uppercase text-paper">Total Payable</span>
          <span className="font-anton text-2xl text-brick-bright">৳{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Assurance Note */}
      <div className="bg-ink border border-line/40 p-3 rounded-xs flex items-start gap-2.5 text-[11px] text-muted leading-relaxed">
        <ShieldCheck size={16} className="text-brick-bright shrink-0 mt-0.5" />
        <span>
          Your order number is <strong className="text-paper">{orderNumber}</strong>. We check every bKash TrxID before printing.
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
