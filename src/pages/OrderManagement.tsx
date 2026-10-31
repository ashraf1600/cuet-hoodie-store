import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Search, AlertTriangle, Trash2, Filter, Package, Users, Layers, ExternalLink, FileText } from 'lucide-react';
import { getStoredOrders, deleteOrder, clearAllOrders } from '../utils/orderStorage';
import { exportOrdersToCsv } from '../utils/csvExport';
import { Order } from '../types';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  const handleDelete = (orderNumber: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderNumber} from local storage?`)) {
      deleteOrder(orderNumber);
      refreshOrders();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('WARNING: This will permanently delete ALL orders stored in this browser. Are you sure?')) {
      clearAllOrders();
      refreshOrders();
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const totalHoodies = orders.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Group by Batch
  const batchCounts = orders.reduce<Record<string, number>>((acc, o) => {
    const b = o.batch || 'Other';
    acc[b] = (acc[b] || 0) + o.quantity;
    return acc;
  }, {});

  // Unique batches for filter dropdown
  const batches = ['ALL', ...Array.from(new Set(orders.map(o => o.batch).filter(Boolean)))];

  // Search & Filter
  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.studentId.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.transactionId.toLowerCase().includes(q);

    const matchesBatch = selectedBatch === 'ALL' || order.batch === selectedBatch;

    return matchesSearch && matchesBatch;
  });

  const handleExportCsv = () => {
    exportOrdersToCsv(filteredOrders, 'CUET_Hoodie_Orders.csv');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line/60 pb-6">
        <div className="space-y-1">
          <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-brick-bright">
            Local Administration &amp; Reporting
          </span>
          <h1 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-paper">
            Order Management
          </h1>
          <p className="font-body text-xs sm:text-sm text-muted">
            Inspect, search, and export local order records stored in this browser.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={orders.length === 0}
            className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
          >
            <Download size={16} />
            <span>Export Orders as CSV</span>
          </button>
        </div>
      </div>

      {/* Mandatory Browser-Specific LocalStorage Warning (Section 7 requirement) */}
      <div className="bg-[#1C1613] border border-amber-500/50 p-4 rounded-xs flex items-start gap-3.5 text-xs font-body text-amber-200 leading-relaxed">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 uppercase tracking-wider block font-bold mb-0.5">
            Important Notice: Browser-Specific Local Storage
          </strong>
          Orders listed here are stored strictly within this browser&apos;s LocalStorage. Orders placed from other devices or browsers are not automatically synchronized here. For centralized coordination across all students, use the integrated <strong>Google Forms &amp; Google Sheets</strong> workflow.
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-ink-2 border border-line p-5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="font-body text-xs uppercase tracking-wider font-semibold">Total Orders</span>
            <Users size={18} className="text-brick-bright" />
          </div>
          <p className="font-anton text-3xl text-paper">{totalOrders}</p>
          <span className="font-body text-[11px] text-muted-dark">Submitted via local form</span>
        </div>

        <div className="bg-ink-2 border border-line p-5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="font-body text-xs uppercase tracking-wider font-semibold">Total Hoodies</span>
            <Package size={18} className="text-brick-bright" />
          </div>
          <p className="font-anton text-3xl text-brick-bright">{totalHoodies} pcs</p>
          <span className="font-body text-[11px] text-muted-dark">Cumulative pieces ordered</span>
        </div>

        <div className="bg-ink-2 border border-line p-5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="font-body text-xs uppercase tracking-wider font-semibold">Total Revenue (bKash)</span>
            <Layers size={18} className="text-brick-bright" />
          </div>
          <p className="font-anton text-3xl text-paper">৳{totalRevenue.toLocaleString()}</p>
          <span className="font-body text-[11px] text-muted-dark">Verified by Transaction ID</span>
        </div>
      </div>

      {/* Orders Grouped by Batch (Section 7 requirement) */}
      <div className="bg-ink-2 border border-line p-5 rounded-xs space-y-3">
        <h3 className="font-anton text-base uppercase text-paper tracking-wide">
          Orders Grouped by Batch
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(batchCounts).map(([b, count]) => (
            <div
              key={b}
              className="px-3 py-1.5 rounded-xs border border-line bg-ink-3 flex items-center gap-2 font-body text-xs"
            >
              <span className="text-paper font-semibold">{b}:</span>
              <span className="font-anton text-brick-bright">{count} pcs</span>
            </div>
          ))}
          {Object.keys(batchCounts).length === 0 && (
            <span className="text-xs text-muted-dark">No orders registered yet.</span>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark" />
          <input
            type="text"
            placeholder="Search by order #, student ID, name, or TrxID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-ink-2 border border-line rounded-xs pl-9 pr-4 py-2.5 font-body text-xs text-paper placeholder:text-muted-dark focus:outline-none focus:border-paper"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-ink-2 border border-line px-3 py-2 rounded-xs">
            <Filter size={14} className="text-muted" />
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="bg-transparent font-body text-xs text-paper focus:outline-none cursor-pointer"
            >
              {batches.map(b => (
                <option key={b} value={b} className="bg-ink text-paper">
                  {b === 'ALL' ? 'All Batches' : b}
                </option>
              ))}
            </select>
          </div>

          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="font-body text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-2 rounded-xs transition-colors cursor-pointer"
            >
              Clear Storage
            </button>
          )}
        </div>
      </div>

      {/* Responsive Orders Table */}
      <div className="bg-ink-2 border border-line rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead className="bg-ink-3 text-muted border-b border-line uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Order #</th>
                <th className="py-3.5 px-4 font-bold">Customer / Student ID</th>
                <th className="py-3.5 px-4 font-bold">Batch</th>
                <th className="py-3.5 px-4 font-bold">Item &amp; Specs</th>
                <th className="py-3.5 px-4 font-bold text-center">Qty</th>
                <th className="py-3.5 px-4 font-bold text-right">Total</th>
                <th className="py-3.5 px-4 font-bold">bKash TrxID</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 text-paper">
              {filteredOrders.map(order => (
                <tr key={order.orderNumber} className="hover:bg-ink-3/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                    <Link
                      to={`/confirmation/${order.orderNumber}`}
                      className="text-brick-bright hover:underline inline-flex items-center gap-1 group"
                      title="View printable receipt voucher"
                    >
                      <span>{order.orderNumber}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{order.customerName}</div>
                    <div className="text-[11px] text-muted font-mono">{order.studentId} · {order.phoneNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-xs bg-ink-3 border border-line text-[11px] font-semibold">
                      {order.batch}
                    </span>
                    {order.department && (
                      <span className="block text-[10px] text-muted-dark mt-0.5 font-medium">
                        {order.department} Dept
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="line-clamp-1">{order.hoodieName}</div>
                    <div className="text-[11px] text-muted">
                      {order.colour} · Size {order.size}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {order.quantity}
                  </td>
                  <td className="py-3.5 px-4 text-right font-anton text-sm text-paper whitespace-nowrap">
                    ৳{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                    {order.transactionId}
                  </td>
                  <td className="py-3.5 px-4 text-muted text-[11px] whitespace-nowrap">
                    {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                    <Link
                      to={`/confirmation/${order.orderNumber}`}
                      title="View Receipt Voucher"
                      className="inline-flex p-1.5 text-muted hover:text-paper transition-colors"
                    >
                      <FileText size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(order.orderNumber)}
                      title="Delete record"
                      className="p-1.5 text-muted hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted">
                    No orders found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
