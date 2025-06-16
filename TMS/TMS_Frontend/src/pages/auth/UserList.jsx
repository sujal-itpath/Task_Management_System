import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import UserTable from '../../component/UserTable'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

const UserList = () => {
  const { isAdmin } = useAuthStore()
  const navigate = useNavigate()

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <ShieldExclamationIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You are not authorized to access this page. This area is restricted to administrators only.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <UserTable />
    </div>
  )
}

export default UserList
