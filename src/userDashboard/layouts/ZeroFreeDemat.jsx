import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import offerService from "../../services/offerService";

const ZeroFeeDemat = ({ darkMode }) => {
  const { offerId } = useParams(); // Get offer ID from URL
  const user = useSelector(selectUser);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🟢 ZeroFeeDemat Component Mounted');
  console.log('🟢 Step 1: Offer ID from URL params:', offerId);
  console.log('🟢 Step 2: Current User:', user);

  useEffect(() => {
    console.log('🟢 Step 3: useEffect triggered');
    console.log('🟢 Step 4: Offer ID check:', offerId ? 'ID exists' : 'No ID, fetching first offer');
    
    if (offerId) {
      fetchOfferDetails();
    } else {
      // If no specific offer ID, fetch first DEMAT offer
      fetchFirstDematOffer();
    }
  }, [offerId]);

  const fetchOfferDetails = async () => {
    try {
      console.log('🟢 Step 5: fetchOfferDetails started for ID:', offerId);
      setLoading(true);
      const response = await offerService.getOfferById(offerId);
      console.log('🟢 Step 6: API Response:', response);
      
      if (response.success) {
        console.log('✅ Step 7: Offer data received:', response.data);
        setOffer(response.data);
      } else {
        console.error('❌ Step 7: Failed to fetch offer:', response.message);
      }
    } catch (error) {
      console.error('❌ Step 7: Error fetching offer:', error);
    } finally {
      setLoading(false);
      console.log('🟢 Step 8: Loading state set to false');
    }
  };

  const fetchFirstDematOffer = async () => {
    try {
      console.log('🟢 Step 5 (Fallback): Fetching first DEMAT offer');
      setLoading(true);
      const response = await offerService.getAllOffers({ limit: 100 });
      console.log('🟢 Step 6 (Fallback): All offers response:', response);
      
      if (response.success) {
        const allOffers = response.data.offers || [];
        console.log('🟢 Step 7 (Fallback): Total offers:', allOffers.length);
        
        const dematOffer = allOffers.find(o => 
          o.category?.toUpperCase().includes('DEMAT')
        );
        
        console.log('🟢 Step 8 (Fallback): DEMAT offer found:', dematOffer);
        setOffer(dematOffer);
      }
    } catch (error) {
      console.error('❌ Error fetching offers:', error);
    } finally {
      setLoading(false);
      console.log('🟢 Step 9 (Fallback): Loading complete');
    }
  };

  const copyLink = () => {
    const userId = user?._id || user?.id;
    
    console.log('🟡 Copy Link clicked');
    console.log('🟡 User ID:', userId);
    console.log('🟡 Offer:', offer);
    
    if (!userId) {
      console.error('❌ No user ID found');
      alert("Please login to generate your share link.");
      return;
    }
    
    const shareLink = offer 
      ? `${window.location.origin}/share/${offer._id}/${userId}`
      : "https://campaignwaala.com/ref/johndoe/demat";
    
    console.log('🟡 Generated share link:', shareLink);
    
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
    console.log('✅ Link copied successfully');
  };

  if (loading) {
    console.log('🔄 Loading state: Component showing loading spinner');
    return (
      <div className={`min-h-screen pt-24 pb-20 px-4 flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading offer details...</p>
        </div>
      </div>
    );
  }

  console.log('🟢 Step 9: Rendering main component');
  console.log('🟢 Step 10: Offer state:', offer);
  console.log('🟢 Step 11: Offer name:', offer?.name || 'No offer loaded');


  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-10 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center md:text-left">
        {offer?.name || "Zero-Fee Demat Account"}
      </h2>

      {/* Earning Structure */}
      <section
        className={`rounded-xl p-5 sm:p-6 mb-8 shadow-md ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
          💰 Earning Structure
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm sm:text-base">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
            }`}
          >
            <p className="font-semibold">Base Commission:</p>
            <p>{offer?.commission1 || "₹500 per approved application"}</p>
            {offer?.commission1Comment && (
              <p className="text-xs mt-1 opacity-75">{offer.commission1Comment}</p>
            )}
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
            }`}
          >
            <p className="font-semibold">Bonus for 5+ Applications:</p>
            <p>{offer?.commission2 || "Additional ₹100 per application"}</p>
            {offer?.commission2Comment && (
              <p className="text-xs mt-1 opacity-75">{offer.commission2Comment}</p>
            )}
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
            }`}
          >
            <p className="font-semibold">Monthly Target Bonus:</p>
            <p>₹2000 for 20+ applications</p>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section
        className={`rounded-xl p-5 sm:p-6 mb-8 shadow-md ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
          📜 Terms & Conditions
        </h3>
        {offer?.termsAndConditions ? (
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {offer.termsAndConditions}
          </div>
        ) : (
          <ul className="text-sm sm:text-base space-y-2 leading-relaxed">
            <li>Applicants must be Indian citizens aged 18 or above.</li>
            <li>A minimum CIBIL score of 700 is required.</li>
            <li>Income proof is mandatory for approval.</li>
            <li>Campaign Waala reserves the right to review and approve all applications.</li>
          </ul>
        )}
      </section>

      {/* Trackable Link Section */}
      <section
        className={`rounded-xl p-5 sm:p-6 shadow-md ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
          🔗 Your Unique Trackable Link
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            readOnly
            value={offer ? `${window.location.origin}/share/${offer._id}/${user?._id || user?.id || 'user'}` : "Loading..."}
            className={`flex-1 px-4 py-2 rounded-md border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-gray-100 border-gray-300 text-gray-800"
            }`}
          />
          <button
            onClick={copyLink}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Copy Link
          </button>
        </div>
      </section>
    </div>
  );
};

export default ZeroFeeDemat;