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
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Enhanced colors for categories with better gradients
  const categoryColors = [
    'from-amber-400 to-orange-500',
    'from-blue-400 to-cyan-500',
    'from-slate-700 to-slate-800',
    'from-emerald-400 to-teal-500',
    'from-violet-400 to-purple-500',
    'from-green-400 to-emerald-500',
    'from-rose-400 to-pink-500',
    'from-indigo-400 to-blue-500',
  ];

  useEffect(() => {
    fetchCategories();
    fetchWalletData();
    fetchLeadsStats();
    fetchUserProfile();
    fetchSlides();
  }, []);

  // Auto-slide effect with smooth transition - Only show 3 slides
 // Auto-slide effect (carousel) for only first 3 slides
useEffect(() => {
  const totalSlides = 3; // Only cycle through first 3 slides
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, 9500); // 5 seconds per slide
  return () => clearInterval(timer);
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
        darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Welcome Section - UPDATED TEXT */}
      <section className="relative z-10 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
          Welcome Back, <span className="capitalize font-semibold">{userName}</span>! 🌟
        </h2>
        <p className="text-sm md:text-base text-gray-500 text-center max-w-2xl mx-auto">
          Here's a quick overview of your campaign performance and available opportunities.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            title: 'Current Balance',
            amount: `₹ ${walletData.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `Total withdrawn: ₹${walletData.totalWithdrawn.toLocaleString('en-IN')}`,
            img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
            color: 'text-blue-600',
            icon: '💰',
            bgGradient: 'from-blue-500 to-cyan-500',
            borderColor: 'border-blue-400'
          },
          {
            title: 'Total Earnings',
            amount: `₹ ${walletData.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `${leadsStats.approved} leads approved`,
            img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
            color: 'text-green-600',
            icon: '📈',
            bgGradient: 'from-green-500 to-emerald-500',
            borderColor: 'border-green-400'
          },
          {
            title: 'Total Leads',
            amount: `${leadsStats.total}`,
            change: `${leadsStats.pending} pending, ${leadsStats.rejected} rejected`,
            img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop',
            color: 'text-purple-600',
            icon: '🎯',
            bgGradient: 'from-purple-500 to-pink-500',
            borderColor: 'border-purple-400'
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
            className={`rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              darkMode 
                ? `bg-gradient-to-br ${card.bgGradient} border-gray-600 text-white` 
                : `bg-white ${card.borderColor}`
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</span>
              <span className="text-xl">{card.icon}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-2">{card.amount}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full inline-block">
              {card.change}
            </div>
          </div>
        ))}
      </section>

      {/* Banner Section - Horizontal Sliding Swiper */}
<section className="relative z-10 rounded-2xl mb-6 overflow-hidden border-4 border-green-400 dark:border-green-600 shadow-2xl ring-2 ring-blue-300 dark:ring-blue-700">
        <div className="relative overflow-hidden h-48 md:h-56 lg:h-64">
          <style>{`
            @keyframes slideCarousel {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-${slides.length > 0 ? (100 / (slides.length + 7)) : 25}%);
              }
            }
          `}</style>
          
          {slidesLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : slides.length > 0 ? (
            <div className="relative w-full h-full">
              <div 
                className="flex h-full transition-transform duration-8500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentSlide * (100 / (slides.length + 7))}%)`,
                  width: `${(slides.length + 7) * 100}%`
                }}
              >
                {/* Additional Earn More Learn More Slide */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop" 
                    alt="Earn More & More" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Earn More & More!!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Grow your skills and earnings with our exclusive programs!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Big Offers Slide */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop" 
                    alt="Big Offers Coming" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Big Offers Coming Soon!!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Get ready for amazing deals and exclusive benefits!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Savings Offers Slide */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=400&fit=crop" 
                    alt="Savings Account Offers" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-teal-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Saving Offers Are Live Going On!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Don't miss out on exclusive savings account benefits!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Demat Offers Slide */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1642790554815-1ac8d1bb2423?w=1200&h=400&fit=crop" 
                    alt="Demat Account Special Offers" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Demat Offers Going On!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Exclusive deals on demat accounts - Limited time only!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Explore Now
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW SLIDE 1 - Credit Card Special Offers */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=400&fit=crop" 
                    alt="Credit Card Special Offers" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/80 to-orange-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Credit Card Offers Live!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Get amazing rewards and cashback on premium credit cards!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Apply Now
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW SLIDE 2 - Personal Loan Offers */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&h=400&fit=crop" 
                    alt="Personal Loan Offers" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-pink-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Personal Loan Offers!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Low interest rates and instant approval available now!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Get Loan
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW SLIDE 3 - Investment Opportunities */}
                <div
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (slides.length + 7)}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop" 
                    alt="Investment Opportunities" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-green-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">
                        Investment Offers Live!
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg">
                        Start your investment journey with exclusive bonuses!
                      </p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Invest Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
             
              
              {/* Navigation Arrows REMOVED */}
            </div>
          ) : (
            // Fallback when no slides from backend - Show seven slides
            <div className="relative w-full h-full">
              <div className="flex h-full">
                {/* First Slide - Earn More Learn More */}
                <div className="flex-shrink-0 w-1/7 h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop" 
                    alt="Earn More Learn More" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">Earn More Learn More!!</h3>
                      <p className="text-white/90 text-sm md:text-lg">Grow your skills and earnings!</p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Start Now
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Slide - Big Offers */}
                <div className="flex-shrink-0 w-1/7 h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop" 
                    alt="Big Offers Coming" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">Big Offers Comingg!!</h3>
                      <p className="text-white/90 text-sm md:text-lg">Amazing deals are live now!</p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Discover Now
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Slide - Savings Offers Live */}
                <div className="flex-shrink-0 w-1/7 h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=400&fit=crop" 
                    alt="Savings Special Offers" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-teal-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">Saving Offers Are Live!</h3>
                      <p className="text-white/90 text-sm md:text-lg">Amazing deals available now!</p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Grab Offer
                      </div>
                    </div>
                  </div>
                </div>


                {/* Seventh Slide - Investment Offers (NEW) */}
                <div className="flex-shrink-0 w-1/7 h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop" 
                    alt="Investment Offers" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-green-600/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">Investment Offers!</h3>
                      <p className="text-white/90 text-sm md:text-lg">Start investing with bonuses!</p>
                      <div 
                        className="mt-4 bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
                      >
                        Invest Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </section>
{/* Product Cards */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              className={`rounded-xl border-3 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 shadow-md ring-1 ring-gray-200 dark:ring-gray-600 ${
  darkMode ? 'bg-orange-800 border-orange-500' : 'bg-white border-orange-400'
}`}
            >
              <div
                className={`bg-gradient-to-br ${categoryColors[index % categoryColors.length]} h-24 sm:h-28 md:h-32 flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="text-white text-lg font-bold text-center px-2 relative z-10">
                  {category.name?.split(' ')[0] || 'Category'}
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`font-semibold mb-2 ${
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
                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  View Offers →
                </div>
              </div>
            </div>
          ))
        ) : (
          // Fallback - no categories found
          [
            {
              title: 'Industrial Bank Credit Card',
              reward: 'Earn ₹ 1,100',
              color: 'from-amber-400 to-orange-500',
              img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
            },
            {
              title: 'Bajaj EMI Card',
              reward: 'Earn ₹ 800 ',
              color: 'from-blue-400 to-cyan-500',
              img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
            },
            {
              title: 'Demat Account',
              reward: 'Earn ₹ 750 ',
              color: 'from-slate-700 to-slate-800',
              img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
            },
            {
              title: 'MoneyTap Personal Loan',
              reward: 'Earn ₹ 2,100 ',
              color: 'from-emerald-400 to-teal-500',
              img: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
            },
            {
              title: 'Savings Account',
              reward: 'Earn ₹ 750 ',
              color: 'from-violet-400 to-purple-500',
              img: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=400&h=300&fit=crop',
            },
            {
              title: 'Bajaj EMI Card (Offer 2)',
              reward: 'Earn ₹ 700',
              color: 'from-rose-400 to-pink-500',
              img: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop',
            },
          ].map((card, index) => (
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
              className={`rounded-xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div
                className={`bg-gradient-to-br ${card.color} h-24 sm:h-28 md:h-32 flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="text-white text-lg font-bold text-center px-2 relative z-10">
                  {card.title.split(' ')[0]}
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`font-semibold mb-2 ${
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
                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  View Offers →
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
export default Dashboard;