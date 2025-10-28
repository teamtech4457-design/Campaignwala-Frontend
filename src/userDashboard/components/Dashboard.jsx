import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import walletService from '../../services/walletService';
import leadService from '../../services/leadService';

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalEarned: 0,
    totalWithdrawn: 0
  });
  const [leadsStats, setLeadsStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [userName, setUserName] = useState('#user');

  // Default colors for categories
  const categoryColors = [
    'from-yellow-400 to-orange-400',
    'from-blue-100 to-blue-200',
    'from-gray-800 to-gray-900',
    'from-teal-400 to-cyan-500',
    'from-purple-400 to-pink-400',
    'from-green-400 to-blue-400',
    'from-red-400 to-orange-400',
    'from-indigo-400 to-purple-400',
  ];

  useEffect(() => {
    fetchCategories();
    fetchWalletData();
    fetchLeadsStats();
    fetchUserProfile();
    fetchSlides();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        setUserName(response.data.data.user?.name || '#user');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        const response = await walletService.getWalletByUserId(user._id);
        if (response.success) {
          setWalletData({
            balance: response.data.balance || 0,
            totalEarned: response.data.totalEarned || 0,
            totalWithdrawn: response.data.totalWithdrawn || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchLeadsStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        const response = await leadService.getLeadStats(user._id);
        if (response.success) {
          setLeadsStats({
            total: response.data.total || 0,
            pending: response.data.pending || 0,
            approved: response.data.approved || 0,
            rejected: response.data.rejected || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching leads stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories', {
        params: {
          status: 'active',
          limit: 10
        }
      });
      
      console.log('Categories Response:', response.data); // Debug
      
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlides = async () => {
    try {
      setSlidesLoading(true);
      const response = await api.get('/slides', {
        params: {
          status: 'active',
          limit: 10,
          sortBy: 'order',
          order: 'asc'
        }
      });
      
      console.log('Slides Response:', response.data); // Debug
      
      if (response.data.success) {
        setSlides(response.data.data.slides || []);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setSlidesLoading(false);
    }
  };

  const openPopup = (title, img, description) => {
    alert(`${title}\n\n${description}`);
  };
  return (
    <div
      className={`transition-all duration-300 ${
        darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Welcome Section */}
      <section className="mb-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome Back, <span className="text-blue-600">{userName}!</span>
        </h2>
        <p className="text-sm md:text-base text-gray-500">
          Here's a quick overview of your campaign performance and available opportunities.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            title: 'Current Balance',
            amount: `₹ ${walletData.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `Total withdrawn: ₹${walletData.totalWithdrawn.toLocaleString('en-IN')}`,
            img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
            color: 'text-blue-600',
            icon: '$',
          },
          {
            title: 'Total Earnings',
            amount: `₹ ${walletData.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `${leadsStats.approved} leads approved`,
            img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
            color: 'text-green-600',
            icon: '📊',
          },
          {
            title: 'Total Leads',
            amount: `${leadsStats.total}`,
            change: `${leadsStats.pending} pending, ${leadsStats.rejected} rejected`,
            img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop',
            color: 'text-purple-600',
            icon: '🎁',
          },
        ].map((card) => (
          <div
            key={card.title}
            onClick={() => {
              if (card.title === "Current Balance") {
                navigate("/user/wallet-withdrawl");
              } else if (card.title === "Total Earnings") {
                navigate("/user/wallet-withdrawl");
              } else if (card.title === "Total Leads") {
                navigate("/user/all-leads");
              }
            }}
            className={`rounded-lg p-4 border cursor-pointer transition-all duration-300 hover:shadow-lg ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{card.title}</span>
              <span className={card.color}>{card.icon}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{card.amount}</div>
            <div className="text-xs mt-1 text-gray-500">{card.change}</div>
          </div>
        ))}
      </section>

      {/* Banner Section - Slides Carousel */}
      <section className="rounded-xl mb-6 overflow-hidden relative">
        {slidesLoading ? (
          // Loading state
          <div
            className={`flex items-center justify-center gap-4 p-6 ${
              darkMode
                ? 'bg-gradient-to-r from-blue-900 to-green-900'
                : 'bg-gradient-to-r from-blue-100 to-green-100'
            }`}
          >
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full opacity-60 ${
                darkMode ? 'bg-green-700' : 'bg-green-300'
              }`}
            ></div>
            <p
              className={`text-center text-sm sm:text-base md:text-lg font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Loading offers...
            </p>
          </div>
        ) : slides.length > 0 ? (
          // Slides from API with auto-scroll animation
          <div className="relative overflow-hidden">
            <style>{`
              @keyframes slideLeft {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .animate-slide {
                animation: slideLeft ${slides.length * 5}s linear infinite;
              }
              .animate-slide:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="flex animate-slide">
              {/* Duplicate slides for seamless loop */}
              {[...slides, ...slides].map((slide, index) => (
                <div
                  key={`${slide._id}-${index}`}
                  className={`flex-shrink-0 w-full flex flex-col md:flex-row items-center justify-center gap-4 p-6 ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-900 to-green-900'
                      : 'bg-gradient-to-r from-blue-100 to-green-100'
                  }`}
                  style={{
                    backgroundImage: slide.backgroundImage 
                      ? `url(${slide.backgroundImage})` 
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full opacity-60 ${
                      darkMode ? 'bg-green-700' : 'bg-green-300'
                    }`}
                  ></div>
                  <div className="text-center">
                    <p
                      className={`text-sm sm:text-base md:text-lg font-bold ${
                        darkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}
                    >
                      {slide.offerTitle}
                    </p>
                    {slide.description && (
                      <p
                        className={`text-xs sm:text-sm mt-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Fallback banner
          <div
            className={`flex flex-col md:flex-row items-center justify-center gap-4 p-6 ${
              darkMode
                ? 'bg-gradient-to-r from-blue-900 to-green-900'
                : 'bg-gradient-to-r from-blue-100 to-green-100'
            }`}
          >
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full opacity-60 ${
                darkMode ? 'bg-green-700' : 'bg-green-300'
              }`}
            ></div>
            <p
              className={`text-center text-sm sm:text-base md:text-lg font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Explore new offers and maximize your rewards!
            </p>
          </div>
        )}
      </section>

      {/* Product Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          // Loading state
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          // Categories from backend
          categories.map((category, index) => (
            <div
              key={category._id || index}
              onClick={() => {
                // Navigate to category offers page with category ID and name
                navigate(`/user/category-offers/${category._id}`, {
                  state: { 
                    categoryId: category._id,
                    categoryName: category.name,
                    categoryDescription: category.description
                  }
                });
              }}
              className={`rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div
                className={`bg-gradient-to-br ${categoryColors[index % categoryColors.length]} h-24 sm:h-28 md:h-32 flex items-center justify-center`}
              >
                <div className="text-white text-lg font-bold text-center px-2">
                  {category.name?.split(' ')[0] || 'Category'}
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {category.name}
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {category.description || 'Available offers'}
                </p>
              </div>
            </div>
          ))
        ) : (
          // Fallback - no categories found
          [
            {
              title: 'Industrial Bank Credit Card',
              reward: 'Earn ₹ 1,100',
              color: 'from-yellow-400 to-orange-400',
              img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
            },
            {
              title: 'Bajaj EMI Card',
              reward: 'Earn ₹ 800 ',
              color: 'from-blue-100 to-blue-200',
              img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
            },
            {
              title: 'Demat Account',
              reward: 'Earn ₹ 750 ',
              color: 'from-gray-800 to-gray-900',
              img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
            },
            {
              title: 'MoneyTap Personal Loan',
              reward: 'Earn ₹ 2,100 ',
              color: 'from-teal-400 to-cyan-500',
              img: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
            },
            {
              title: 'Savings Account',
              reward: 'Earn ₹ 750 ',
              color: 'from-gray-800 to-gray-900',
              img: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=400&h=300&fit=crop',
            },
            {
              title: 'Bajaj EMI Card (Offer 2)',
              reward: 'Earn ₹ 700',
              color: 'from-gray-800 to-gray-900',
              img: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop',
            },
          ].map((card) => (
            <div
              key={card.title}
              onClick={() => {
                // Fallback navigation - use title as category name
                navigate(`/user/category-offers/fallback`, {
                  state: { 
                    categoryName: card.title,
                    categoryDescription: card.reward
                  }
                });
              }}
              className={`rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div
                className={`bg-gradient-to-br ${card.color} h-24 sm:h-28 md:h-32 flex items-center justify-center`}
              >
                <div className="text-white text-lg font-bold text-center px-2">
                  {card.title.split(' ')[0]}
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {card.reward}
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;