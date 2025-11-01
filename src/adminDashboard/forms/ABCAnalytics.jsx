import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import leadService from "../../services/leadService";
import { getAllCategories } from "../../services/categoryService";

// Simple Card components for the dashboard
const Card = ({ className = "", children }) => (
  <div className={`bg-card border border-border rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`p-4 pb-2 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`font-semibold text-lg ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-4 pt-2 ${className}`}>
    {children}
  </div>
);

// Theme-aware chart colors that work in both light and dark themes
const getChartColors = () => {
  // Simplified dark mode detection - check background color
  const computedStyle = getComputedStyle(document.documentElement);
  const bgColor = computedStyle.getPropertyValue('--background').trim();
  const isDarkMode = bgColor.includes('222') || bgColor.includes('4%') || document.body.classList.contains('dark');
  
  console.log('Dark mode detected:', isDarkMode, 'Background:', bgColor); // Debug log
  
  return {
    // For axis text 
    axisText: isDarkMode ? '#ffffff' : '#374151',
    // For dots - visible in both themes
    dotFill: isDarkMode ? '#ffffff' : '#3b82f6',
    dotStroke: isDarkMode ? '#ffffff' : '#3b82f6', 
    // Grid lines
    gridStroke: isDarkMode ? '#555555' : '#e5e7eb'
  };
};

// Custom label renderer for better visibility in dark theme
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show labels for very small segments

  // Simplified dark mode detection for labels
  const computedStyle = getComputedStyle(document.documentElement);
  const bgColor = computedStyle.getPropertyValue('--background').trim();
  const isDarkMode = bgColor.includes('222') || bgColor.includes('4%') || document.body.classList.contains('dark');

  return (
    <text 
      x={x} 
      y={y} 
      fill={isDarkMode ? "#ffffff" : "#374151"} 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={11}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip component with proper dark theme styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3"
        style={{
          background: "rgba(0,0,0,0)",
          boxShadow: "none",
          border: "none",
          color: "hsl(var(--foreground))"
        }}
      >
        {label && (
          <div className="text-foreground font-medium mb-2 pb-1">
            {label}
          </div>
        )}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-foreground font-medium">
              {entry.name || entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};



function Calendar({ month, year, onDateSelect, onMonthChange, startDate, endDate }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 min-w-[260px] sm:min-w-[300px] lg:min-w-[340px]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onMonthChange(-1)} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="text-center">
          <div className="text-foreground font-semibold text-sm sm:text-base">{monthNames[month]}</div>
          <div className="text-muted-foreground text-xs sm:text-sm">{year}</div>
        </div>
        <button onClick={() => onMonthChange(1)} className="p-1 hover:bg-muted rounded">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground font-semibold py-1 w-8 sm:w-9">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          let isInRange = false
          if (day && startDate && endDate) {
            const currentDate = new Date(year, month, day)
            isInRange = currentDate >= startDate && currentDate <= endDate
          }

          return (
            <button
              key={idx}
              onClick={() => day && onDateSelect(new Date(year, month, day))}
              className={`w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base font-medium rounded flex items-center justify-center transition-colors ${
                isInRange
                  ? "bg-primary text-primary-foreground"
                  : day
                    ? "text-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    : "text-muted-foreground cursor-default"
              }`}
              disabled={!day}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  // Set initial dates to last 30 days from today
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)
  
  const [startDate, setStartDate] = useState(thirtyDaysAgo)
  const [endDate, setEndDate] = useState(today)
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth())
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())
  const [selectedHR, setSelectedHR] = useState("All Categories")
  const [selectedTL, setSelectedTL] = useState("All Users")
  const [showCalendar, setShowCalendar] = useState(false)
  const [manualStartDate, setManualStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0])
  const [manualEndDate, setManualEndDate] = useState(today.toISOString().split('T')[0])
  const [chartKey, setChartKey] = useState(0)
  
  // API Data States
  const [analyticsData, setAnalyticsData] = useState(null)
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🏷️ [FRONTEND] Fetching categories...')
        const response = await getAllCategories({ status: 'active', limit: 1000 })
        console.log('🏷️ [FRONTEND] Categories response:', response)
        if (response.success) {
          console.log('🏷️ [FRONTEND] Categories count:', response.data.categories?.length)
          setCategories(response.data.categories || [])
        }
      } catch (err) {
        console.error('❌ [FRONTEND] Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('👥 [FRONTEND] Fetching users...')
        const response = await leadService.getAllUsers()
        console.log('👥 [FRONTEND] Users response:', response)
        if (response.success) {
          console.log('👥 [FRONTEND] Users count:', response.data?.length)
          setUsers(response.data || [])
        }
      } catch (err) {
        console.error('❌ [FRONTEND] Error fetching users:', err)
      }
    }
    fetchUsers()
  }, [])

  // Fetch analytics data when filters change
  useEffect(() => {
    console.log('🔄 [FRONTEND] Filters changed, fetching analytics...')
    console.log('🔄 [FRONTEND] Users available:', users.length)
    if (users.length > 0 || selectedTL === 'All Users') {
      fetchAnalyticsData()
    } else {
      console.log('⏳ [FRONTEND] Waiting for users to load...')
    }
  }, [startDate, endDate, selectedHR, selectedTL, users])

  const fetchAnalyticsData = async () => {
    try {
      console.log('📊 [FRONTEND] Starting analytics fetch...')
      setLoading(true)
      setError(null)
      
      // Build params - only add dates if they are set
      const params = {}
      
      if (startDate) {
        params.startDate = startDate.toISOString().split('T')[0]
      }
      
      if (endDate) {
        params.endDate = endDate.toISOString().split('T')[0]
      }
      
      console.log('📊 [FRONTEND] Base params:', params)
      
      if (selectedHR !== 'All Categories') {
        params.category = selectedHR
        console.log('📊 [FRONTEND] Added category filter:', selectedHR)
      }
      
      if (selectedTL !== 'All Users') {
        const selectedUser = users.find(u => u.name === selectedTL)
        console.log('📊 [FRONTEND] Selected user:', selectedUser)
        if (selectedUser) {
          params.hrUserId = selectedUser._id
          console.log('📊 [FRONTEND] Added user filter:', selectedUser._id)
        }
      }
      
      console.log('📊 [FRONTEND] Final API params:', params)
      console.log('📊 [FRONTEND] Params will fetch:', 
        Object.keys(params).length === 0 ? 'ALL LEADS (no filter)' : 
        `Filtered leads with: ${JSON.stringify(params)}`
      )
      
      const response = await leadService.getLeadAnalytics(params)
      
      console.log('📊 [FRONTEND] API response:', response)
      
      if (response.success) {
        console.log('✅ [FRONTEND] Analytics data received:', response.data)
        console.log('✅ [FRONTEND] Metrics:', response.data.metrics)
        console.log('✅ [FRONTEND] Date-wise data length:', response.data.dateWiseData?.length)
        setAnalyticsData(response.data)
      } else {
        console.error('❌ [FRONTEND] Response not successful:', response)
        setError('Failed to fetch analytics data')
      }
    } catch (err) {
      console.error('❌ [FRONTEND] Error fetching analytics:', err)
      console.error('❌ [FRONTEND] Error details:', err.response?.data || err.message)
      setError(err.message || 'Failed to fetch analytics data')
    } finally {
      console.log('🏁 [FRONTEND] Analytics fetch completed, loading=false')
      setLoading(false)
    }
  }

  // Listen for theme changes and force chart re-render
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setChartKey(prev => prev + 1)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const applyQuickFilter = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    setStartDate(start)
    setEndDate(end)
    setManualStartDate(start.toISOString().split("T")[0])
    setManualEndDate(end.toISOString().split("T")[0])
  }

  const handleDateSelect = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
      setManualStartDate(date.toISOString().split("T")[0])
      setManualEndDate("")
    } else {
      if (date < startDate) {
        setEndDate(startDate)
        setStartDate(date)
        setManualStartDate(date.toISOString().split("T")[0])
        setManualEndDate(startDate.toISOString().split("T")[0])
      } else {
        setEndDate(date)
        setManualEndDate(date.toISOString().split("T")[0])
      }
    }
  }

  const handleManualDateChange = (type, value) => {
    if (type === "start") {
      setManualStartDate(value)
      if (value) {
        setStartDate(new Date(value))
      }
    } else {
      setManualEndDate(value)
      if (value) {
        setEndDate(new Date(value))
      }
    }
  }

  const handleMonthChange = (direction) => {
    let newMonth = calendarMonth + direction
    let newYear = calendarYear
    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }
    setCalendarMonth(newMonth)
    setCalendarYear(newYear)
  }

  const formatDate = (date) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const dateRangeText = endDate ? `${formatDate(startDate)} ~ ${formatDate(endDate)}` : `${formatDate(startDate)}`

  const getMetrics = () => {
    console.log('📊 [METRICS] Getting metrics, analyticsData:', analyticsData)
    
    if (!analyticsData || !analyticsData.metrics) {
      console.log('⚠️ [METRICS] No analytics data available')
      return [
        { label: "DateWise Count", value: "0", icon: "📅" },
        { label: "Total Count", value: "0", icon: "📊", subtext: "Database" },
        { label: "Pending", value: "0", icon: "⏳" },
        { label: "Approved", value: "0", icon: "✓" },
        { label: "Completed", value: "0", icon: "✓" },
      ]
    }

    const { metrics } = analyticsData
    console.log('✅ [METRICS] Using metrics:', metrics)
    
    return [
      { label: "DateWise Count", value: metrics.dateWiseCount.toString(), icon: "📅" },
      { label: "Total Count", value: metrics.totalCount.toString(), icon: "📊", subtext: "Database" },
      { label: "Pending", value: metrics.pending.toString(), icon: "⏳" },
      { label: "Approved", value: metrics.approved.toString(), icon: "✓" },
      { label: "Completed", value: metrics.completed.toString(), icon: "✓" },
    ]
  }

  const metrics = getMetrics()

  // Prepare chart data
  const dateWiseData = analyticsData?.dateWiseData || []
  console.log('📈 [CHARTS] Date-wise data:', dateWiseData)
  
  // Add colors to distribution data
  const colorPalette = ["#a855f7", "#06b6d4", "#3b82f6", "#10b981", "#f97316", "#84cc16", "#ef4444", "#8b5cf6"]
  
  const accountDistribution = (analyticsData?.categoryDistribution || []).map((item, idx) => ({
    ...item,
    color: colorPalette[idx % colorPalette.length]
  }))
  console.log('📊 [CHARTS] Account distribution:', accountDistribution)
  
  const pendingByAccount = (analyticsData?.pendingByCategory || []).map((item, idx) => ({
    ...item,
    color: colorPalette[idx % colorPalette.length]
  }))
  console.log('📊 [CHARTS] Pending by account:', pendingByAccount)
  
  const approvedByAccount = (analyticsData?.approvedByCategory || []).map((item, idx) => ({
    ...item,
    color: colorPalette[idx % colorPalette.length]
  }))
  console.log('📊 [CHARTS] Approved by account:', approvedByAccount)

  // Calculate totals for chart titles
  const totalPending = pendingByAccount.reduce((sum, item) => sum + item.value, 0)
  const totalApproved = approvedByAccount.reduce((sum, item) => sum + item.value, 0)
  console.log('📊 [CHARTS] Total pending:', totalPending, 'Total approved:', totalApproved)

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 lg:p-6 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Account management and performance metrics</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading analytics data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && (
          <>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-left text-sm sm:text-base min-w-[200px]"
            >
              {dateRangeText}
            </button>

            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs sm:max-w-none overflow-auto max-h-96">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quick filters */}
                  <div className="flex flex-col gap-2 pr-4 border-r border-border">
                    <button
                      onClick={() => {
                        applyQuickFilter(0)
                        setShowCalendar(false)
                      }}
                      className="text-left px-3 py-2 text-primary hover:bg-muted rounded text-sm"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        applyQuickFilter(1)
                        setShowCalendar(false)
                      }}
                      className="text-left px-3 py-2 text-primary hover:bg-muted rounded text-sm"
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => {
                        applyQuickFilter(7)
                        setShowCalendar(false)
                      }}
                      className="text-left px-3 py-2 text-primary hover:bg-muted rounded text-sm"
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => {
                        applyQuickFilter(30)
                        setShowCalendar(false)
                      }}
                      className="text-left px-3 py-2 text-primary hover:bg-muted rounded text-sm"
                    >
                      Last 30 days
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date()
                        setStartDate(new Date(today.getFullYear(), today.getMonth(), 1))
                        setEndDate(today)
                        setManualStartDate(
                          new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0],
                        )
                        setManualEndDate(today.toISOString().split("T")[0])
                        setShowCalendar(false)
                      }}
                      className="text-left px-3 py-2 text-primary hover:bg-muted rounded text-sm"
                    >
                      This month
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date()
                        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1)
                        setStartDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1))
                        setEndDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0))
                        setManualStartDate(
                          new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split("T")[0],
                        )
                        setManualEndDate(
                          new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split("T")[0],
                        )
                        setShowCalendar(false)
                      }}
                      className="text-left px-3 py-2 text-primary hover:bg-muted rounded text-sm"
                    >
                      Last month
                    </button>

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">Manual Date Input</p>
                      <div className="flex flex-col gap-2">
                        <input
                          type="date"
                          value={manualStartDate}
                          onChange={(e) => handleManualDateChange("start", e.target.value)}
                          className="px-2 py-1 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="date"
                          value={manualEndDate}
                          onChange={(e) => handleManualDateChange("end", e.target.value)}
                          className="px-2 py-1 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calendar */}
                  <Calendar
                    month={calendarMonth}
                    year={calendarYear}
                    onDateSelect={handleDateSelect}
                    onMonthChange={handleMonthChange}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dropdowns */}
          <div className="flex flex-row gap-2 sm:gap-3 sm:ml-auto overflow-x-auto">
            <select
              value={selectedHR}
              onChange={(e) => setSelectedHR(e.target.value)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none text-xs sm:text-base w-auto min-w-[100px] sm:min-w-[150px] flex-shrink-0"
            >
              <option>All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedTL}
              onChange={(e) => setSelectedTL(e.target.value)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none text-xs sm:text-base w-auto min-w-[90px] sm:min-w-[150px] flex-shrink-0"
            >
              <option>All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-card border border-border hover:border-primary transition-colors rounded-lg p-3 sm:p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-xs sm:text-sm mb-1 break-words">{metric.label}</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary break-all">{metric.value}</p>
                  {metric.subtext && <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>}
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl ml-2 flex-shrink-0">{metric.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 dark:bg-background [&_.recharts-surface]:touch-auto [&_.recharts-tooltip-wrapper]:pointer-events-auto"
             style={{
               '--chart-touch': 'manipulation'
             }}>
          {/* Date Wise Account Created */}
          <div className="bg-card border border-border rounded-lg w-full max-w-full">
            <div className="p-3 sm:p-4 border-b border-border" style={{ background: "transparent" }}>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Date Wise Account Created</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Account creation trend over time</p>
            </div>
            <div className="p-2 sm:p-4 touch-manipulation">
              <ResponsiveContainer width="100%" height={400} style={{ background: "transparent" }}>
                <BarChart
                  data={dateWiseData}
                  key={chartKey}
                  margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
                  style={{ background: "transparent" }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().gridStroke} fill="none" />
                  <XAxis
                    dataKey="date"
                    stroke={getChartColors().axisText}
                    tick={{ fill: getChartColors().axisText, fontSize: 14 }}
                    style={{ fontSize: "14px" }}
                  />
                  <YAxis
                    stroke={getChartColors().axisText}
                    tick={{ fill: getChartColors().axisText, fontSize: 14 }}
                    style={{ fontSize: "14px" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    trigger="hover"
                    animationDuration={200}
                    allowEscapeViewBox={{ x: false, y: false }}
                  />
                  <Bar
                    dataKey="count"
                    fill={getChartColors().dotFill}
                    radius={[8, 8, 0, 0]}
                    background={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Account Distribution */}
          <Card className="bg-card border-border">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-foreground text-base sm:text-lg">Pending By Account</CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm">Distribution by account type</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-2 sm:p-4 touch-manipulation">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart key={`pie1-${chartKey}`}>
                  <Pie
                    data={pendingByAccount}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    onMouseEnter={(data, index) => {
                      // Enable hover effect on desktop and touch devices
                    }}
                    onTouchStart={(data, index) => {
                      // Enable touch hover effect on mobile
                    }}
                  >
                    {pendingByAccount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />} 
                    allowEscapeViewBox={{ x: false, y: false }}
                    trigger="hover"
                    animationDuration={200}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Total Pending Account */}
          <Card className="bg-card border-border">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-foreground text-base sm:text-lg">Total Pending Account {totalPending}</CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm">Account breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-2 sm:p-4 touch-manipulation">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart key={`pie2-${chartKey}`}>
                  <Pie
                    data={pendingByAccount}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    onMouseEnter={(data, index) => {
                      // Enable hover effect on desktop and touch devices
                    }}
                    onTouchStart={(data, index) => {
                      // Enable touch hover effect on mobile
                    }}
                  >
                    {pendingByAccount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />} 
                    allowEscapeViewBox={{ x: false, y: false }}
                    trigger="hover"
                    animationDuration={200}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Total Approved Account */}
          <Card className="bg-card border-border">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-foreground text-base sm:text-lg">Total Approved Account {totalApproved}</CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm">Approved accounts distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-2 sm:p-4 touch-manipulation">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart key={`pie3-${chartKey}`}>
                  <Pie
                    data={approvedByAccount}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    onMouseEnter={(data, index) => {
                      // Enable hover effect on desktop and touch devices
                    }}
                    onTouchStart={(data, index) => {
                      // Enable touch hover effect on mobile
                    }}
                  >
                    {approvedByAccount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />} 
                    allowEscapeViewBox={{ x: false, y: false }}
                    trigger="hover"
                    animationDuration={200}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-card border border-border rounded-lg">
          <div className="flex flex-wrap gap-3 sm:gap-6">
            {accountDistribution.map((account, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: account.color }}></div>
                <span className="text-foreground text-xs sm:text-sm">{account.name}</span>
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
