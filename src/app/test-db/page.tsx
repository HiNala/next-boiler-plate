'use client'

import { useState, useEffect } from 'react'

export default function TestDbPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [details, setDetails] = useState('')

  const testConnection = async () => {
    try {
      setStatus('loading')
      setMessage('Testing connection...')
      setError('')
      setDetails('')

      // Test the connection
      const response = await fetch('/api/test-db')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to connect to database')
      }

      setStatus('success')
      setMessage('Successfully connected to database!')
      if (result.data) {
        setDetails(JSON.stringify(result.data, null, 2))
      }
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="p-6 max-w-sm w-full bg-white rounded-xl shadow-md">
          <div className="mb-4">
            <p className="text-xl font-semibold mb-2">Status:</p>
            <p className={`text-lg ${
              status === 'success' ? 'text-green-600' : 
              status === 'error' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {status === 'loading' ? 'Testing connection...' :
               status === 'success' ? 'Connected!' :
               'Connection failed'}
            </p>
          </div>

          {message && (
            <div className="mb-4 text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 text-red-600">
              Error: {error}
            </div>
          )}

          {details && (
            <div className="mb-4 text-sm text-gray-600 overflow-auto max-h-40">
              <pre>{details}</pre>
            </div>
          )}

          <button
            onClick={testConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Again
          </button>
        </div>
      </main>
    </div>
  )
} 