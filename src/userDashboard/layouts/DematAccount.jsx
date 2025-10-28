import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import offerService from "../../services/offerService";

const DematAccount = ({ darkMode }) => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get category ID from URL
  const location = useLocation(); // Get category details from navigation state
  const user = useSelector(selectUser); // Get current logged-in user
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get category info from navigation state or use defaults
  const categoryName = location.state?.categoryName || "DEMAT Account";
  const categoryDescription = location.state?.categoryDescription || "";

  useEffect(() => {
    fetchOffers();
  }, [categoryId]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      
      console.log('🎯 Step 1: Category ID from URL:', categoryId);
      console.log('🎯 Step 2: Category Name from state:', categoryName);
      
      let filteredOffers = [];
      
      if (categoryId && categoryId !== 'fallback') {
        // Use backend endpoint to get offers by category ID
        console.log(`🎯 Step 3: Fetching from backend: /api/offers/category/${categoryId}`);
        
        const response = await offerService.getOffersByCategory(categoryId);
        
        console.log('🎯 Step 4: Backend Response:', response);
        console.log('🎯 Step 5: Response Data Array:', response.data);
        
        if (response.success && response.data) {
          console.log('🎯 Step 6: Total offers received:', response.data.length);
          
          // Log first offer to see all fields
          if (response.data.length > 0) {
            console.log('🎯 Step 7: First offer details:', response.data[0]);
            console.log('🎯 Step 8: isApproved field:', response.data[0].isApproved);
          }
          
          // Don't filter by isApproved - show all offers
          filteredOffers = response.data || [];
          
          console.log(`🎯 Step 9: Final filtered offers count: ${filteredOffers.length}`);
        }
      } else {
        // Fallback: Fetch all and filter by name
        console.log(`🎯 Step 3 (Fallback): Filtering by category name "${categoryName}"`);
        
        const response = await offerService.getAllOffers({
          limit: 100
        });
        
        console.log('🎯 Step 4 (Fallback): API Response:', response);
        
        if (response.success) {
          const allOffers = response.data.offers || [];
          console.log('🎯 Step 5 (Fallback): All Offers:', allOffers);
          
          // Filter by category name match
          filteredOffers = allOffers.filter(offer => {
            const offerCategoryName = typeof offer.category === 'string' 
              ? offer.category 
              : offer.category?.name || '';
            
            return offerCategoryName.toUpperCase().includes(categoryName.toUpperCase());
          });
          
          console.log(`🎯 Step 6 (Fallback): Filtered ${filteredOffers.length} offers`);
        }
      }
      
      console.log('🎯 Step 10: Setting offers state with:', filteredOffers);
      setOffers(filteredOffers);
    } catch (error) {
      console.error('❌ Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Navigate to Zero-Fee Demat Page with offer details
  const handleShare = (offerId) => {
    console.log('🔵 Step 1: Share button clicked');
    console.log('🔵 Step 2: Offer ID received:', offerId);
    console.log('🔵 Step 3: Navigating to:', `/user/zerofee-demat/${offerId}`);
    
    try {
      navigate(`/user/zerofee-demat/${offerId}`);
      console.log('✅ Step 4: Navigation successful');
    } catch (error) {
      console.error('❌ Step 4: Navigation failed:', error);
    }
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-10 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center md:text-left">
        Browse Available Offers
      </h2>

      {/* Tabs */}
      <div className="flex justify-center md:justify-start mb-10">
        <button
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-gray-100 border-gray-200 text-gray-800"
          }`}
        >
          {categoryName}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading offers...</p>
        </div>
      )}

      {/* Cards Section - Backend Data */}
      {!loading && offers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto w-full">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className={`rounded-xl border shadow-sm p-6 sm:p-8 flex flex-col justify-between transition hover:shadow-lg ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {offer.name}
                </h3>
                <p
                  className={`text-sm sm:text-base mb-4 leading-relaxed ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {offer.description || "No description available"}
                </p>
                <p className="text-sm sm:text-base text-green-600 font-medium mb-6">
                  Earn {offer.commission1 || "₹500 per lead"}
                </p>
              </div>
              <button
                onClick={() => handleShare(offer._id)}
                className="w-full py-2 sm:py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition"
              >
                Share
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Offers State */}
      {!loading && offers.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No offers available in {categoryName} at the moment.
          </p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default DematAccount;