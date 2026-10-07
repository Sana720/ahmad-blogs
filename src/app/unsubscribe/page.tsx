'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!token) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to unsubscribe.');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
        <p className="text-gray-600 mb-8">This unsubscribe link is invalid or has expired.</p>
        <Link href="/" className="text-[#3CB371] hover:underline font-medium">Return to Home</Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Successfully Unsubscribed</h1>
        <p className="text-gray-600 mb-8">You have been removed from our promotional mailing list and will no longer receive these emails.</p>
        <Link href="/" className="text-[#3CB371] hover:underline font-medium">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe</h1>
      <p className="text-gray-600 mb-8">
        You are about to unsubscribe from future AhmadBlogs promotional emails. 
        Are you sure you want to proceed?
      </p>
      
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleUnsubscribe}
        disabled={status === 'loading'}
        className={`w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
          status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {status === 'loading' ? 'Processing...' : 'Confirm Unsubscribe'}
      </button>
      
      <div className="mt-6">
         <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline">Cancel</Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
            <UnsubscribeContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
