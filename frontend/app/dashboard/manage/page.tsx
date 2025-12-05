'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/types';

export default function ManagePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showAddMenuItem, setShowAddMenuItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', country: 'INDIA' });
  const [menuFormData, setMenuFormData] = useState({ name: '', description: '', price: '', category: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user && user.role === 'MEMBER') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'MANAGER')) {
      loadRestaurants();
    }
  }, [user]);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setRestaurants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create restaurant');

      setFormData({ name: '', description: '', country: user?.role === 'ADMIN' ? 'INDIA' : user?.country || 'INDIA' });
      setShowAddRestaurant(false);
      loadRestaurants();
      alert('Restaurant created successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent, restaurantId: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...menuFormData,
          price: parseFloat(menuFormData.price),
        }),
      });

      if (!response.ok) throw new Error('Failed to create menu item');

      setMenuFormData({ name: '', description: '', price: '', category: '' });
      setShowAddMenuItem(null);
      loadRestaurants();
      alert('Menu item added successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete restaurant');

      loadRestaurants();
      alert('Restaurant deleted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteMenuItem = async (restaurantId: string, menuItemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}/menu/${menuItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      loadRestaurants();
      alert('Menu item deleted successfully!');
    } catch (err: any) {
      setError(err.message);
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

  if (!user || user.role === 'MEMBER') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Restaurants</h1>
            </div>
            <button
              onClick={() => setShowAddRestaurant(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Restaurant
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="font-medium text-blue-900">
            {user.role === 'ADMIN'
              ? 'As an Admin, you can manage all restaurants across all countries.'
              : `As a Manager, you can manage restaurants in ${user.country} only.`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Restaurant Modal */}
        {showAddRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add New Restaurant</h3>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {user.role === 'ADMIN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="INDIA">INDIA</option>
                      <option value="AMERICA">AMERICA</option>
                    </select>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRestaurant(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restaurants List */}
        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                    {restaurant.country}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddMenuItem(restaurant.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    + Add Menu Item
                  </button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Add Menu Item Form */}
              {showAddMenuItem === restaurant.id && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <h4 className="font-semibold mb-3 text-gray-900">Add Menu Item</h4>
                  <form onSubmit={(e) => handleCreateMenuItem(e, restaurant.id)} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={menuFormData.name}
                      onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={menuFormData.category}
                      onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={menuFormData.description}
                      onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg col-span-2 text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={menuFormData.price}
                      onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                    />
                    <div className="flex space-x-2">
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddMenuItem(null)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Menu Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-900">Menu Items ({restaurant.menuItems?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurant.menuItems?.map((item: MenuItem) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          {item.category && (
                            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteMenuItem(restaurant.id, item.id)}
                          className="text-red-600 hover:text-red-800 text-lg font-bold ml-2"
                          title="Delete menu item"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-lg font-bold text-blue-600 mt-2">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
