'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { User, Camera, Loader2, Calendar, CreditCard, ExternalLink, CalendarDays } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user');
        setProfile(res.data.user);
        setFormData(res.data.user);

        if (res.data.user.image) {
          setImagePreview(res.data.user.image);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    if (status === 'authenticated') fetchProfile();
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create a preview
    setImagePreview(URL.createObjectURL(file));

    // Upload immediately if in edit mode
    if (editMode) {
      await uploadImage(file);
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post('/api/user/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        image: res.data.imageUrl
      }));

    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put('/api/user', formData);
      setProfile(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );


  if (status === 'unauthenticated')
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 font-medium">Please sign in to access your profile</p>
        <p className="text-sm text-red-500 mt-2">Your journey with us begins after signing in</p>
      </div>
    );
  if (!profile) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 px-6 py-10 bg-white text-slate-800 rounded-xl shadow-md border border-myColorA">
      {/* Profile Header with Image */}
      <div className="flex flex-col items-center mb-8">
        {/* Profile Image */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-myColorA mb-4">
            {imagePreview || profile.image ? (
              <Image
                src={imagePreview || profile.image}
                alt={profile.name || 'Profile'}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50">
                <User className="h-16 w-16 text-myColorA" />
              </div>
            )}
          </div>

          {/* Edit overlay for image */}
          {editMode && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                {imageLoading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-myColorAB mb-2">{profile.name}</h1>
        <p className="text-slate-500">{profile.memberType || 'Member'}</p>
      </div>

      <form className="space-y-6">
        {['name', 'email', 'phone', 'address', 'memberType'].map((field) => (
          <div key={field} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-sm font-medium text-slate-700 capitalize mb-1">
              {field === 'memberType' ? 'How You Participate' : field}
            </label>

            {editMode ? (
              field === 'email' ? (
                <p className="text-base text-slate-500">{formData[field]}</p>
              ) : field === 'memberType' ? (
                <select
                  name="memberType"
                  value={formData.memberType || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 border border-myColorA focus:outline-none focus:ring-2 focus:ring-myColorA focus:border-transparent"
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Donor">Donor</option>
                  <option value="Sponsor">Sponsor</option>
                  <option value="Beneficiary">Beneficiary</option>
                </select>
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 border border-myColorA focus:outline-none focus:ring-2 focus:ring-myColorA focus:border-transparent"
                />
              )
            ) : (
              <p className="text-base font-medium text-slate-800 py-1">
                {profile[field] ? (
                  profile[field]
                ) : (
                  <span className="italic text-slate-400">Not Provided</span>
                )}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-center pt-6 border-t border-gray-200 mt-8">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-3 bg-myColorA hover:bg-myColorAB text-white rounded-full font-medium transition disabled:opacity-50 mr-4 shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData(profile);
                  setImagePreview(profile.image || null);
                }}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-full font-medium transition shadow-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-8 py-3 bg-myColorA hover:bg-myColorAB text-white rounded-full font-medium transition shadow-sm"
            >
              Update My Information
            </button>
          )}
        </div>
      </form>

      {/* Donations Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CreditCard className="text-myColorA" /> My Donations
        </h2>
        {profile.donations?.length > 0 ? (
          <div className="space-y-4">
            {profile.donations.map((donation) => (
              <div key={donation._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">₹{donation.amount}</p>
                  <p className="text-xs text-slate-500">{new Date(donation.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${donation.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                      donation.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {donation.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm italic">You haven't made any donations yet.</p>
          </div>
        )}
      </div>

      {/* Events Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CalendarDays className="text-myColorAB" /> Participated Events
        </h2>
        {profile.eventRegistrations?.length > 0 ? (
          <div className="space-y-4">
            {profile.eventRegistrations.map((event) => (
              <div key={event._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-myColorA">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{event.title}</p>
                    <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="text-myColorA hover:text-myColorAB text-sm font-medium flex items-center gap-1">
                  View <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm italic">No event participations yet.</p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-sm text-slate-500">
        <p>Thank you for being part of our community!</p>
        <p className="mt-1">Your information helps us better coordinate our efforts.</p>
      </div>
    </div>
  );
}