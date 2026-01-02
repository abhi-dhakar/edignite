"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Briefcase,
  Layers,
  Calendar,
  Award,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3
} from "lucide-react";

export default function VolunteerProfilePage() {
  const { data: session, status } = useSession();
  const [volunteer, setVolunteer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    enrollmentNumber: "",
    branch: "",
    division: "",
    year: "",
    skills: [],
    availability: "",
    experience: "",
    preferredLocation: "",
  });

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      try {
        const res = await axios.get("/api/apply-volunteer");
        if (res.data.volunteer) {
          setVolunteer(res.data.volunteer);
          setFormData({
            fullName: res.data.volunteer.fullName || "",
            emailAddress: res.data.volunteer.emailAddress || "",
            mobileNumber: res.data.volunteer.mobileNumber || "",
            enrollmentNumber: res.data.volunteer.enrollmentNumber || "",
            branch: res.data.volunteer.branch || "",
            division: res.data.volunteer.division || "",
            year: res.data.volunteer.year || "",
            skills: res.data.volunteer.skills || [],
            availability: res.data.volunteer.availability || "",
            experience: res.data.volunteer.experience || "",
            preferredLocation: res.data.volunteer.preferredLocation || "",
          });
        }
      } catch (err) {
        console.error("Failed to load volunteer profile:", err);
        setError("Could not load your volunteer profile.");
      }
    };

    if (status === "authenticated") fetchVolunteerProfile();
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.put("/api/apply-volunteer", formData);
      setVolunteer(res.data.volunteer);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update volunteer profile:", err);
      setError(
        err.response?.data?.message ||
        "Failed to update your volunteer profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVolunteerProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/apply-volunteer", formData);
      setVolunteer(res.data.volunteer);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to create volunteer profile:", err);
      setError(
        err.response?.data?.message ||
        "Failed to create your volunteer profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-slate-900 px-4">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero/empowerment.png"
            alt="Background"
            fill
            className="object-cover opacity-30"
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative max-w-md w-full p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-300 mb-8">
            Please sign in to access or create your volunteer profile.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-myColorA text-white rounded-xl font-medium hover:bg-myColorAB transition-all"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero/empowerment.png"
          alt="Empowerment Background"
          fill
          className="object-cover"
          quality={85}
          priority
        />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">

          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-myColorA to-emerald-800 p-8 sm:p-12 text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Volunteer Profile</h1>
                  <p className="text-emerald-100/90 text-lg max-w-xl">
                    Share your skills and availability to help make a lasting difference in our community.
                  </p>
                </div>

                {/* Status Badge */}
                {volunteer && !editMode && (
                  <div className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-semibold shadow-lg backdrop-blur-md border border-white/20 ${volunteer.status === "Approved" ? "bg-emerald-500/20 text-emerald-50" :
                    volunteer.status === "Rejected" ? "bg-red-500/20 text-red-50" :
                      "bg-amber-500/20 text-amber-50"
                    }`}>
                    {volunteer.status === "Approved" ? <CheckCircle2 className="w-5 h-5" /> :
                      volunteer.status === "Rejected" ? <XCircle className="w-5 h-5" /> :
                        <Clock3 className="w-5 h-5" />}
                    <span>{volunteer.status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!volunteer && !editMode ? (
            // Empty State
            <div className="p-12 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-myColorA">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Join Our Volunteer Force
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                We haven't found a volunteer profile for you yet. Tell us about your skills, experience, and availability to help us match you with the perfect volunteering opportunities.
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center px-8 py-4 bg-myColorA text-white rounded-xl font-bold hover:bg-myColorAB transition-all shadow-lg shadow-myColorA/20 hover:scale-105 transform"
              >
                Create My Profile
              </button>
            </div>
          ) : (
            <div className="p-8 sm:p-12">
              {error && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {volunteer && !editMode && volunteer.status === "Pending" && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Application Under Review</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Our team is currently reviewing your application. You will be notified once a decision has been made.
                    </p>
                  </div>
                </div>
              )}

              {editMode ? (
                // Edit Form
                <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <div className="md:col-span-2 pb-2 border-b border-slate-100 mb-2">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-myColorA" />
                        Personal Details
                      </h3>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="enter full name"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        required
                        placeholder="email@example.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        placeholder="10-digit number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Academic Details Section Title */}
                    <div className="md:col-span-2 pt-4 pb-2 border-b border-slate-100 mb-2 mt-2">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-myColorA" />
                        Academic / Professional Details
                      </h3>
                    </div>

                    {/* Enrollment */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Enrollment ID</label>
                      <input
                        type="text"
                        name="enrollmentNumber"
                        value={formData.enrollmentNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. I23PH0XX"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Branch */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Branch / Dept</label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Computer Science"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Division */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Division</label>
                      <input
                        type="text"
                        name="division"
                        value={formData.division}
                        onChange={handleChange}
                        required
                        placeholder="e.g. A"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Year */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Year</label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 2nd Year"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Skills Section */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-myColorA" />
                        Skills & Expertise
                      </label>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-white border border-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-lg flex items-center shadow-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-emerald-400 hover:text-red-500 transition-colors"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add your skills (e.g., Photography, Teaching)..."
                          className="flex-grow p-3 border border-slate-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-myColorA"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddSkill())
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="bg-myColorA text-white px-6 rounded-r-xl font-bold hover:bg-myColorAB transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Additional Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Availability */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Availability</label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                        >
                          <option value="">Select availability</option>
                          <option value="Weekends">Weekends</option>
                          <option value="Weekdays">Weekdays</option>
                          <option value="Evenings">Evenings</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Remote only">Remote only</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preferred Location</label>
                        <input
                          type="text"
                          name="preferredLocation"
                          value={formData.preferredLocation}
                          onChange={handleChange}
                          placeholder="City, region..."
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Experience</label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your previous volunteering experience or relevant background..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-myColorA focus:border-myColorA transition-all"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          if (volunteer) {
                            setFormData({
                              fullName: volunteer.fullName || "",
                              emailAddress: volunteer.emailAddress || "",
                              mobileNumber: volunteer.mobileNumber || "",
                              enrollmentNumber: volunteer.enrollmentNumber || "",
                              branch: volunteer.branch || "",
                              division: volunteer.division || "",
                              year: volunteer.year || "",
                              skills: volunteer.skills || [],
                              availability: volunteer.availability || "",
                              experience: volunteer.experience || "",
                              preferredLocation: volunteer.preferredLocation || "",
                            });
                          }
                        }}
                        className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={
                          volunteer ? handleSave : handleCreateVolunteerProfile
                        }
                        disabled={loading}
                        className="px-8 py-2.5 bg-myColorA text-white rounded-lg font-bold hover:bg-myColorAB disabled:opacity-50 flex items-center shadow-lg shadow-myColorA/20"
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        {loading
                          ? "Saving..."
                          : volunteer
                            ? "Save Changes"
                            : "Submit Profile"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="space-y-10 animate-in fade-in duration-500">
                  {/* Info Grid */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <User className="w-5 h-5 text-myColorA" />
                      Personal & Academic Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <User className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Full Name</span>
                        </div>
                        <p className="text-slate-900 font-medium">{volunteer.fullName}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Email</span>
                        </div>
                        <p className="text-slate-900 font-medium">{volunteer.emailAddress}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Mobile</span>
                        </div>
                        <p className="text-slate-900 font-medium">{volunteer.mobileNumber}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Hash className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Enrollment ID</span>
                        </div>
                        <p className="text-slate-900 font-medium">{volunteer.enrollmentNumber}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Branch</span>
                        </div>
                        <p className="text-slate-900 font-medium">{volunteer.branch}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Layers className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Division & Year</span>
                        </div>
                        <p className="text-slate-900 font-medium">{volunteer.division} - {volunteer.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Availability */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Award className="w-5 h-5 text-myColorA" />
                      Skills & Logistics
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {volunteer.skills && volunteer.skills.length > 0 ? (
                            volunteer.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-medium px-3 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-slate-400 italic">No skills listed</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Availability</span>
                            <p className="text-slate-900 font-medium">{volunteer.availability || "Not specified"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Preferred Location</span>
                            <p className="text-slate-900 font-medium">{volunteer.preferredLocation || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <FileText className="w-5 h-5 text-myColorA" />
                      Experience
                    </h3>
                    <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed border border-slate-100">
                      {volunteer.experience ? volunteer.experience : "No experience details provided."}
                    </div>
                  </div>

                  <div className="pt-6 mt-8 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      disabled={
                        volunteer.status === "Approved" ||
                        volunteer.status === "Rejected"
                      }
                      className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${volunteer.status === "Approved" ||
                        volunteer.status === "Rejected"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-myColorA text-white hover:bg-myColorAB shadow-myColorA/20 hover:-translate-y-0.5"
                        }`}
                    >
                      {volunteer.status === "Approved" ? "Profile Locked (Approved)" : "Edit Profile"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Gain Experience</h4>
              <p className="text-xs mt-1 text-slate-300">Build your CV with real-world impact.</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Network</h4>
              <p className="text-xs mt-1 text-slate-300">Connect with like-minded changemakers.</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Flexible</h4>
              <p className="text-xs mt-1 text-slate-300">Opportunities that match your schedule.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
