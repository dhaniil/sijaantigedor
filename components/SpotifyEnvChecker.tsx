'use client';

import { useState } from 'react';

export default function SpotifyEnvChecker() {
  const [showDetails, setShowDetails] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasClientId = !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  // We can't check server-only env vars from the client
  
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/spotify/test-connection');
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Connection successful! ${data.message || ''}`);
      } else {
        setTestResult(`❌ Connection failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md my-4">
      <h3 className="font-semibold text-lg mb-2">Spotify API Configuration</h3>
      
      <div className="mb-2">
        <span className="font-medium">Client ID: </span>
        {hasClientId ? 
          <span className="text-green-600">✅ Configured</span> : 
          <span className="text-red-600">❌ Missing</span>
        }
      </div>
      
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 underline text-sm"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-auto"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      {testResult && (
        <div className="mt-2 text-sm">
          {testResult}
        </div>
      )}
      
      {showDetails && (
        <div className="mt-4 text-sm bg-gray-200 p-2 rounded">
          <p className="font-medium">Configuration Tips:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>Make sure NEXT_PUBLIC_SPOTIFY_CLIENT_ID is set in your .env.local file</li>
            <li>Make sure SPOTIFY_CLIENT_SECRET is set in your .env.local file</li>
            <li>Verify you have the correct credentials from the Spotify Developer Dashboard</li>
            <li>Restart your Next.js server after changing environment variables</li>
          </ul>
        </div>
      )}
    </div>
  );
}
