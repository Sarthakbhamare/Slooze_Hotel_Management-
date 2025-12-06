'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const TEST_USERS = [
  { email: 'nick.fury@shield.com', name: 'Nick Fury', role: 'ADMIN', country: 'INDIA' },
  { email: 'carol.danvers@shield.com', name: 'Captain Marvel', role: 'MANAGER', country: 'INDIA' },
  { email: 'steve.rogers@shield.com', name: 'Captain America', role: 'MANAGER', country: 'AMERICA' },
  { email: 'thanos@shield.com', name: 'Thanos', role: 'MEMBER', country: 'INDIA' },
  { email: 'thor@shield.com', name: 'Thor', role: 'MEMBER', country: 'INDIA' },
  { email: 'travis@shield.com', name: 'Travis', role: 'MEMBER', country: 'AMERICA' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setError('');
    setIsLoading(true);

    try {
      await login(userEmail, 'Password123!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Ordering App</h1>
          <p className="text-gray-600 mb-8">Role-Based Access Control Demo</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Password123!"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Default password for all users: <code className="bg-gray-200 px-2 py-1 rounded text-gray-900 font-semibold">Password123!</code></p>
          </div>
        </div>

        {/* Quick Login Options */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Login (Test Users)</h2>
          <p className="text-gray-600 mb-6">Click any user below to login instantly:</p>

          <div className="space-y-3">
            {TEST_USERS.map((user) => (
              <button
                key={user.email}
                onClick={() => quickLogin(user.email)}
                disabled={isLoading}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      user.role === 'MANAGER' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{user.country}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Access Levels:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>ADMIN:</strong> Full access (all countries)</li>
              <li>• <strong>MANAGER:</strong> Cancel orders, view country data</li>
              <li>• <strong>MEMBER:</strong> View & order only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
