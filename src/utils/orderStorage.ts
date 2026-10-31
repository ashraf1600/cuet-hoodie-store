import { Order } from '../types';

const ORDERS_STORAGE_KEY = 'cuet_hoodie_orders_v1';

/**
 * Load all orders safely from LocalStorage
 */
export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error('Failed to parse orders from LocalStorage:', error);
    return [];
  }
};

/**
 * Get a specific order by order number
 */
export const getOrderByNumber = (orderNumber: string): Order | undefined => {
  const orders = getStoredOrders();
  return orders.find(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
};

/**
 * Save a new order, preventing duplicates
 */
export const saveOrder = (order: Order): boolean => {
  try {
    const orders = getStoredOrders();
    const existingIndex = orders.findIndex(o => o.orderNumber === order.orderNumber);
    if (existingIndex >= 0) {
      console.warn(`Order ${order.orderNumber} already exists in LocalStorage.`);
      return false;
    }
    const updated = [order, ...orders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save order to LocalStorage:', error);
    return false;
  }
};

/**
 * Delete an order (for local management)
 */
export const deleteOrder = (orderNumber: string): boolean => {
  try {
    const orders = getStoredOrders();
    const filtered = orders.filter(o => o.orderNumber !== orderNumber);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete order:', error);
    return false;
  }
};

/**
 * Clear all orders (with safety)
 */
export const clearAllOrders = (): void => {
  localStorage.removeItem(ORDERS_STORAGE_KEY);
};
