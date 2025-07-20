"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function VolunteerProfilePage() {
  const { data: session, status } = useSession();
  const [volunteer, setVolunteer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const [formData, setFormData] = useState({
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
      <div className="max-w-4xl mx-auto mt-10 p-8 text-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-8 w-8 bg-myColorA rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading your volunteer profile...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 font-medium">
          Please sign in to access your volunteer profile
        </p>
        <div className="mt-4">
          <Link
            href="/signin"
            className="px-4 py-2 bg-myColorA text-white rounded-lg hover:bg-myColorAB"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-myColorA p-6">
        <h1 className="text-2xl font-bold text-white">Volunteer Profile</h1>
        <p className="text-green-100 mt-1">
          Share your skills and availability to help make a difference
        </p>
      </div>

      {!volunteer && !editMode ? (
        <div className="p-8 text-center">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-myColorA"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Create Your Volunteer Profile
            </h2>
            <p className="text-gray-600 mb-6">
              Tell us about your skills, experience, and availability to help us
              match you with the perfect volunteering opportunities.
            </p>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-3 bg-myColorA text-white rounded-lg hover:bg-myColorAB transition"
          >
            Create Profile
          </button>
        </div>
      ) : (
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {volunteer && !editMode && (
            <div className="mb-6">
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  volunteer.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : volunteer.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Status: {volunteer.status}
              </div>
              {volunteer.status === "Pending" && (
                <p className="text-sm text-gray-500 mt-2">
                  Your volunteer application is being reviewed. We'll notify you
                  when it's approved.
                </p>
              )}
            </div>
          )}

          {editMode ? (
            <form className="space-y-6">
              {/* Skills Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-myColorA text-sm px-3 py-1 rounded-full flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-myColorA hover:text-myColorAB"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., Teaching, First Aid)"
                      className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-myColorA"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSkill())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-myColorA text-white px-4 rounded-r hover:bg-myColorAB"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-myColorA"
                >
                  <option value="">Select your availability</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Evenings">Evenings</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Remote only">Remote only</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your relevant experience..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-myColorA"
                />
              </div>

              {/* Preferred Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Location
                </label>
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  placeholder="City, region, or 'Remote'"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-myColorA"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    if (volunteer) {
                      setFormData({
                        skills: volunteer.skills || [],
                        availability: volunteer.availability || "",
                        experience: volunteer.experience || "",
                        preferredLocation: volunteer.preferredLocation || "",
                      });
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={
                    volunteer ? handleSave : handleCreateVolunteerProfile
                  }
                  disabled={loading}
                  className="px-4 py-2 bg-myColorA text-white rounded-md hover:bg-myColorAB disabled:opacity-50 flex items-center"
                >
                  {loading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {loading
                    ? "Saving..."
                    : volunteer
                      ? "Save Changes"
                      : "Submit Profile"}
                </button>
              </div>
            </form>
          ) : (
            volunteer && (
              <div className="space-y-6">
                {/* Skills Display */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills && volunteer.skills.length > 0 ? (
                      volunteer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-myColorAB text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability Display */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </h3>
                  <p className="text-gray-900">
                    {volunteer.availability || "Not specified"}
                  </p>
                </div>

                {/* Experience Display */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </h3>
                  <p className="text-gray-900 whitespace-pre-line">
                    {volunteer.experience || "No experience details provided"}
                  </p>
                </div>

                {/* Preferred Location Display */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Preferred Location
                  </h3>
                  <p className="text-gray-900">
                    {volunteer.preferredLocation || "Not specified"}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => setEditMode(true)}
                    disabled={
                      volunteer.status === "Approved" ||
                      volunteer.status === "Rejected"
                    }
                    className={`px-4 py-2 rounded-md ${
                      volunteer.status === "Approved" ||
                      volunteer.status === "Rejected"
                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                        : "bg-myColorA text-white hover:bg-myColorAB"
                    }`}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Why volunteer with us?
        </h3>
        <ul className="text-gray-600 space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-myColorA mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Gain valuable experience while making a real difference
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-myColorA mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Connect with like-minded individuals and expand your network
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-myColorA mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Flexible opportunities to match your schedule and interests
          </li>
        </ul>
      </div>
    </div>
  );
}
