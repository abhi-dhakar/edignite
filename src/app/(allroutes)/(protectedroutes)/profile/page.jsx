'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import {
  User,
  Camera,
  Loader2,
  Calendar,
  CreditCard,
  ExternalLink,
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Heart,
  ShieldCheck,
  Edit2,
  X,
  Check
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
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
        const userData = res.data.user;

        setProfile(userData);

        // Initialize formData with defaults to ensure controlled inputs and valid API payload
        setFormData({
          ...userData,
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
          // Default to 'Volunteer' because API requires strict memberType
          // Default to 'Volunteer' ONLY if the current type is invalid. Allow 'Admin' to pass through.
          memberType: userData.memberType && ['Donor', 'Volunteer', 'Sponsor', 'Beneficiary', 'Admin'].includes(userData.memberType)
            ? userData.memberType
            : 'Volunteer'
        });

        if (userData.image) {
          setImagePreview(userData.image);
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImagePreview(URL.createObjectURL(file));

    if (editMode) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/user/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({
        ...prev,
        image: res.data.imageUrl
      }));

      // Update session with new image so Navbar updates immediately
      await update({ user: { image: res.data.imageUrl } });
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

      // Update session with new profile data
      await update({
        user: {
          name: formData.name,
          memberType: formData.memberType
        }
      });

      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-myColorA animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading your profile...</p>
      </div>
    </div>
  );

  if (status === 'unauthenticated') return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="max-w-md w-full p-8 bg-red-50 border border-red-100 rounded-2xl text-center shadow-sm">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-2">Access Restricted</h3>
        <p className="text-red-600 mb-6">Please sign in to view and manage your profile functionality.</p>
        <div className="text-xs text-red-400 uppercase tracking-wide font-semibold">Authentication Required</div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 text-myColorA animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your account and view your impact.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDEBAR - Identity Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
              {/* Card Header Gradient */}
              <div className="h-32 bg-gradient-to-r from-myColorA to-emerald-600/80 w-full relative">
                <div className="absolute inset-0 bg-black/5" />
              </div>

              <div className="px-6 pb-8 relative">
                {/* Avatar */}
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-white">
                      {imagePreview || profile.image ? (
                        <Image
                          src={imagePreview || profile.image}
                          alt={profile.name || 'Profile'}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Image Edit Overlay */}
                    {editMode && (
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer z-10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-32 h-32 rounded-full bg-black/40 backdrop-blur-[2px] flex items-center justify-center ring-4 ring-white">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                          />
                          {imageLoading ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          ) : (
                            <Camera className="w-8 h-8 text-white drop-shadow-md" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Identity Details */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">{profile.email}</p>

                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-myColorA/10 text-myColorAB ring-1 ring-inset ring-myColorA/20">
                      {profile.memberType || 'Member'}
                    </span>
                  </div>
                </div>

                {/* Sidebar Stats (Mini) */}
                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{profile.donations?.length || 0}</div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Donations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{profile.eventRegistrations?.length || 0}</div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Events</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Details, Donations, Events */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                    <User className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
                </div>

                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData(profile); // Reset changes
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-myColorA border border-transparent rounded-lg shadow-sm hover:bg-myColorAB focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myColorA transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name Field */}
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Full Name</label>
                    <div className="relative">
                      {editMode ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-myColorA focus:border-myColorA block transition-colors"
                          placeholder="Your Name"
                        />
                      ) : (
                        <p className="text-base font-medium text-slate-800">{profile.name || 'Not Provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Field - Read Only usually */}
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Email Address</label>
                    <div className="relative">
                      <p className="text-base font-medium text-slate-600 flex items-center gap-2 py-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        {profile.email || 'Not Provided'}
                      </p>
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Phone Number</label>
                    <div className="relative">
                      {editMode ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-myColorA focus:border-myColorA block transition-colors"
                          placeholder="+91..."
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-0.5">
                          {!profile.phone && !editMode && <span className="text-slate-400 italic text-sm">Not Provided</span>}
                          {profile.phone && (
                            <>
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span className="text-base font-medium text-slate-800">{profile.phone}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Type Dropdown */}
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Participation</label>
                    <div className="relative">
                      {editMode ? (
                        <div className="relative">
                          {formData.memberType === 'Admin' ? (
                            <div className="w-full px-3 py-2.5 bg-slate-100 border border-slate-300 text-slate-500 text-sm rounded-lg cursor-not-allowed font-medium">
                              Admin (Cannot change role)
                            </div>
                          ) : (
                            <>
                              <select
                                name="memberType"
                                value={formData.memberType || ''}
                                onChange={handleChange}
                                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-myColorA focus:border-myColorA appearance-none transition-colors"
                              >
                                <option value="Volunteer">Volunteer</option>
                                <option value="Donor">Donor</option>
                                <option value="Sponsor">Sponsor</option>
                                <option value="Beneficiary">Beneficiary</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 py-0.5">
                          <ShieldCheck className="h-4 w-4 text-slate-400" />
                          <span className="text-base font-medium text-slate-800">{profile.memberType || 'Member'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Field - Full Width */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Address</label>
                    <div className="relative">
                      {editMode ? (
                        <textarea
                          name="address"
                          value={formData.address || ''}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-myColorA focus:border-myColorA block transition-colors resize-none"
                          placeholder="Your full address..."
                        />
                      ) : (
                        <div className="flex items-start gap-2 py-0.5">
                          {!profile.address ? (
                            <span className="text-slate-400 italic text-sm">Not Provided</span>
                          ) : (
                            <>
                              <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                              <span className="text-base font-medium text-slate-800 leading-relaxed max-w-lg">{profile.address}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* 2. Donations Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Donation History</h2>
                </div>
              </div>

              <div className="p-6">
                {profile.donations?.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100">
                        {profile.donations.map((donation) => {
                          const isCompleted = donation.paymentStatus === 'Completed';
                          const isPending = donation.paymentStatus === 'Pending';

                          return (
                            <tr key={donation._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                                ₹{(donation.amount || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {new Date(donation.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : isPending
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : 'bg-red-50 text-red-700 border-red-100'
                                  }`}>
                                  {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                                  {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                                  {donation.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">No donations yet</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Your contributions help us make a real difference.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Events Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100/50 rounded-lg text-purple-600">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Participated Events</h2>
                </div>
              </div>

              <div className="p-6">
                {profile.eventRegistrations?.length > 0 ? (
                  <div className="grid gap-4">
                    {profile.eventRegistrations.map((event) => (
                      <div key={event._id} className="group relative flex items-center p-4 bg-white border border-slate-100 rounded-xl hover:border-myColorA hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-myColorA text-lg font-bold group-hover:text-white transition-colors">
                          <div className="text-center leading-none">
                            <span className="block text-[10px] uppercase font-semibold opacity-80">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                            <span className="block text-lg">{new Date(event.date).getDate()}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 truncate pr-4">{event.title}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-myColorA transition-colors">
                            <ExternalLink className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">No events attended</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Join our upcoming events to connect with the community.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}