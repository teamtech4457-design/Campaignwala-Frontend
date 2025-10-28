import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import leadService from "../../services/leadService";
import api from "../../services/api";

const AllLeads = ({ darkMode = useOutletContext() }) => {
  const [activeTab, setActiveTab] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
    fetchCategories();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await leadService.getAllLeads({
        hrUserId: user._id,
        limit: 100
      });
      
      if (response.success) {
        setLeadsData(response.data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', {
        params: { status: 'active' }
      });
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Pending":
        navigate("/user/pending-leads");
        break;
      case "Approved":
        navigate("/user/approved-leads");
        break;
      case "Rejected":
        navigate("/user/rejected-leads");
        break;
      default:
        break;
    }
  };

  // 🔍 Filter leads by category + search
  const filteredLeads = leadsData.filter((lead) => {
    const matchesCategory =
      categoryFilter === "All" || lead.category === categoryFilter;
    const matchesSearch =
      (lead.customerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (lead.customerContact || '').includes(searchQuery) ||
      (lead.leadId || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div
      className={`min-h-screen pt-8 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="mb-6 text-center sm:text-left px-2">
          <h2
            className={`text-2xl sm:text-3xl font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            All Leads
          </h2>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6 px-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-4 py-2 rounded-md border text-sm sm:text-base w-full sm:w-1/3 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-4 py-2 rounded-md border text-sm sm:text-base w-full sm:w-1/3 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6 border-b pb-2 px-2">
          {["Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-t-md transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab} Leads
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div
          className={`rounded-lg border mx-2 ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          } shadow-sm overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`p-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-base sm:text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Recent Leads Overview
            </h3>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Showing your most recent leads across all statuses.
            </p>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead
                className={`${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <tr>
                  <th className="text-left px-3 sm:px-4 py-2">Lead ID</th>
                  <th className="text-left px-3 sm:px-4 py-2">Name</th>
                  <th className="text-left px-3 sm:px-4 py-2 hidden lg:table-cell">Contact</th>
                  <th className="text-left px-3 sm:px-4 py-2 hidden md:table-cell">Category</th>
                  <th className="text-left px-3 sm:px-4 py-2 hidden lg:table-cell">Offer</th>
                  <th className="text-left px-3 sm:px-4 py-2">Created</th>
                  <th className="text-left px-3 sm:px-4 py-2 hidden md:table-cell">Approved</th>
                  <th className="text-left px-3 sm:px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      Loading leads...
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className={`border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td className="px-3 sm:px-4 py-2 font-medium">{lead.leadId}</td>
                      <td className="px-3 sm:px-4 py-2">{lead.customerName}</td>
                      <td className="px-3 sm:px-4 py-2 hidden lg:table-cell">{lead.customerContact}</td>
                      <td className="px-3 sm:px-4 py-2 hidden md:table-cell">{lead.category}</td>
                      <td className="px-3 sm:px-4 py-2 hidden lg:table-cell">{lead.offerName}</td>
                      <td className="px-3 sm:px-4 py-2">{formatDate(lead.createdAt)}</td>
                      <td className="px-3 sm:px-4 py-2 hidden md:table-cell">{formatDate(lead.updatedAt)}</td>
                      <td className="px-3 sm:px-4 py-2">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                            lead.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : lead.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLeads;
