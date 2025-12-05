'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Restaurant, MenuItem } from '@/types';
import { api } from '@/lib/api';

export default function RestaurantsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadRestaurants();
      loadPaymentMethods();
    }
  }, [user]);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await api.getRestaurants();
      setRestaurants(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const methods = await api.getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load payment methods:', err);
    }
  };

  const loadMenu = async (restaurantId: string) => {
    try {
      const restaurant = restaurants.find(r => r.id === restaurantId);
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        const items = await api.getMenuItems(restaurantId);
        setMenuItems(items);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
    }
  };

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      const key = itemId;
      if (newCart[key] > 1) {
        newCart[key]--;
      } else {
        delete newCart[key];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedRestaurant || getTotalItems() === 0) return;

    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      const orderItems = Object.entries(cart).map(([itemId, quantity]) => ({
        menuItemId: itemId,
        quantity
      }));

      const order = await api.createOrder({
        restaurantId: selectedRestaurant.id,
        items: orderItems,
        paymentMethodId: selectedPaymentMethod
      });

      // Show success message with order details
      const orderTotal = getTotalPrice();
      alert(`✅ Order Placed Successfully!\n\nOrder #${order.id}\nTotal: $${orderTotal.toFixed(2)}\nStatus: PENDING\nRestaurant: ${selectedRestaurant.name}\n\nYour order has been received and is being processed.`);
      
      setCart({});
      setSelectedRestaurant(null);
      router.push('/dashboard/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
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
              <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
            </div>
            {getTotalItems() > 0 && (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Cart: {getTotalItems()} items (${getTotalPrice().toFixed(2)})
              </div>
            )}
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
                  ? 'As an Admin, you can see all restaurants from all countries.'
                  : `You're viewing restaurants available in ${user.country}.`
                }
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Restaurant List */}
        {!selectedRestaurant ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => loadMenu(restaurant.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {restaurant.country}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{restaurant.description}</p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Menu View */
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedRestaurant.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                    {selectedRestaurant.country}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setMenuItems([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Restaurants
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => {
                const quantity = cart[item.id] || 0;
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      {item.category && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            -
                          </button>
                          <span className="font-semibold text-lg">{quantity}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Section */}
            {getTotalItems() > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                {/* Payment Method Selection */}
                {paymentMethods.length > 0 && (
                  <div className="mb-4 pb-4 border-b">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.type} {method.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = menuItems.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex justify-between text-gray-700">
                        <span>{item.name} x {quantity}</span>
                        <span>${(item.price * quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
