'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { api } from '@/lib/api';

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrders();
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await api.cancelOrder(orderId);
      // Reload orders to get updated status
      await loadOrders();
      alert('Order cancelled successfully!');
    } catch (err: any) {
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('You do not have permission to cancel orders. Only Admins and Managers can cancel orders.');
      } else {
        setError(err.message || 'Failed to cancel order');
      }
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await api.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      alert(`Order status updated to ${newStatus}!`);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const canCancelOrders = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canManageOrders = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-blue-900">
                {user.role === 'ADMIN' 
                  ? 'As an Admin, you can view all orders, update their status, and cancel them.'
                  : user.role === 'MANAGER'
                  ? `As a Manager, you can view orders from ${user.country}, update their status (PENDING → CONFIRMED → DELIVERED), and cancel them.`
                  : 'You can view your order history and track order status here. Only Admins and Managers can cancel orders.'
                }
              </p>
              {!canCancelOrders && (
                <p className="text-sm text-blue-800 mt-1">
                  ⚠️ You don't have permission to cancel orders (Members role)
                </p>
              )}
              {canManageOrders && (
                <p className="text-sm text-blue-800 mt-1">
                  💡 Use the status dropdown to move orders through: PENDING → CONFIRMED → DELIVERED
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start by browsing restaurants and placing an order!</p>
            <Link
              href="/dashboard/restaurants"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {order.restaurant?.name} - {order.restaurant?.country}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${parseFloat(order.totalAmount.toString()).toFixed(2)}
                    </p>
                    
                    {/* Status Management for Admin/Manager */}
                    {canManageOrders && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <div className="mt-3 space-y-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          disabled={updatingOrderId === order.id}
                          className="w-full px-3 py-2 border-2 border-blue-300 bg-white text-gray-900 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-blue-400 transition-colors"
                        >
                          <option value="PENDING" className="text-yellow-700 bg-yellow-50">🟡 PENDING</option>
                          <option value="CONFIRMED" className="text-blue-700 bg-blue-50">🔵 CONFIRMED</option>
                          <option value="DELIVERED" className="text-green-700 bg-green-50">🟢 DELIVERED</option>
                        </select>
                        <p className="text-xs text-gray-600 font-medium">Update order status</p>
                      </div>
                    )}

                    {canCancelOrders && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                    {!canCancelOrders && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <p className="mt-2 text-xs text-gray-500 italic">
                        Contact manager to cancel
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-700">
                        <span>
                          {item.menuItem?.name} x {item.quantity}
                          {item.menuItem?.category && (
                            <span className="ml-2 text-xs text-gray-500">({item.menuItem.category})</span>
                          )}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Metadata */}
                <div className="border-t mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">User</p>
                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Country</p>
                    <p className="font-medium text-gray-900">{order.restaurant?.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Cancel Permission */}
        {orders.length > 0 && !canCancelOrders && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-yellow-900">
                  Limited Permissions (MEMBER Role)
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  You can view and place orders, but cannot cancel them. To test the cancel feature, login as Nick Fury (Admin) or a Manager (Captain Marvel/Captain America).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
