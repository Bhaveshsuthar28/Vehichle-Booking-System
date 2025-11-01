import React, { useState } from 'react';
import { Edit, History, ImageUp, User, X } from 'lucide-react';

const Sidebar = ({ user, stats, tripHistory, onEditProfile, onUploadImage, isCaptain = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEditProfile(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="w-80 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 flex flex-col h-full shadow-lg">
      <div className="flex-grow">
        <div className="flex items-center justify-center mb-6 relative">
          <div className="relative">
            <img
              src={user.profileImage || `https://ui-avatars.com/api/?name=${user.fullname?.firstname}+${user.fullname?.lastname}&background=random`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            <button
              onClick={onUploadImage}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
              aria-label="Upload Profile Image"
            >
              <ImageUp size={20} />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input type="text" name="firstname" value={editedUser.fullname.firstname} onChange={handleEditChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input type="text" name="lastname" value={editedUser.fullname.lastname} onChange={handleEditChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input type="text" name="phone" value={editedUser.phone} onChange={handleEditChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-gray-500 text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{user.fullname?.firstname} {user.fullname?.lastname}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>
            <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 w-full flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              <Edit size={16} className="mr-2" /> Edit Profile
            </button>
          </div>
        )}

        {isCaptain && stats && (
          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-center">Captain Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">Hours Online:</span>
                <span className="font-bold text-blue-500">{stats.hoursOnline?.toFixed(2) || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">Total Trips:</span>
                <span className="font-bold text-blue-500">{stats.totalTrips || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">Avg. Speed:</span>
                <span className="font-bold text-blue-500">{stats.avgSpeed?.toFixed(2) || 0} km/h</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><History className="mr-2" /> Trip History</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {tripHistory && tripHistory.length > 0 ? (
              tripHistory.map(trip => (
                <div key={trip._id} className="bg-gray-200 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-semibold">{trip.pickup} to {trip.destination}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fare: {trip.fare}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status: {trip.status}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No trips yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

