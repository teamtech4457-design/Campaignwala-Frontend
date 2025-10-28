import { useState } from "react";
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
} from "recharts";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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
  return {
    // For axis text - uses CSS variables that automatically adapt
    axisText: 'hsl(var(--foreground))',
    // For dots - white in dark, primary color in light
    dotFill: 'hsl(var(--background))',
    dotStroke: 'hsl(var(--primary))',
    // Grid lines
    gridStroke: 'hsl(var(--border))'
  };
};

// Custom label renderer for better visibility in dark theme
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show labels for very small segments

  return (
    <text 
      x={x} 
      y={y} 
      fill="hsl(var(--background))" 
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
        className="bg-card border border-border rounded-lg p-3 shadow-lg"
        style={{ 
          backgroundColor: "hsl(var(--card))", 
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--foreground))"
        }}
      >
        {/* Show label if it exists (for LineChart) */}
        {label && (
          <div className="text-foreground font-medium mb-2 border-b border-border pb-1">
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



const tlData = {
  "Abhinandan Shukla": {
    dateWiseCount: 45,
    totalCount: 3200,
    pending: 2800,
    approved: 350,
    completed: 50,
  },
  "Akshat Kashyap": {
    dateWiseCount: 38,
    totalCount: 2900,
    pending: 2400,
    approved: 420,
    completed: 80,
  },
  "Aryan Gupta": {
    dateWiseCount: 52,
    totalCount: 3500,
    pending: 3100,
    approved: 320,
    completed: 80,
  },
  "Tanmoy jana": {
    dateWiseCount: 31,
    totalCount: 2591,
    pending: 2586,
    approved: 5,
    completed: 0,
  },
  "Ankit Kumar Singh": {
    dateWiseCount: 42,
    totalCount: 3100,
    pending: 2700,
    approved: 350,
    completed: 50,
  },
  "Suhani Mishra": {
    dateWiseCount: 48,
    totalCount: 3400,
    pending: 2950,
    approved: 380,
    completed: 70,
  },
  "Sejal sharma": {
    dateWiseCount: 35,
    totalCount: 2800,
    pending: 2500,
    approved: 250,
    completed: 50,
  },
  "Amit Sahani": {
    dateWiseCount: 40,
    totalCount: 3000,
    pending: 2650,
    approved: 300,
    completed: 50,
  },
  "Pallivi kumari": {
    dateWiseCount: 44,
    totalCount: 3300,
    pending: 2900,
    approved: 350,
    completed: 50,
  },
}

const dateWiseData = [
  { date: "2025-09-25", count: 250 },
  { date: "2025-09-26", count: 180 },
  { date: "2025-09-27", count: 320 },
  { date: "2025-09-28", count: 220 },
  { date: "2025-09-29", count: 290 },
  { date: "2025-09-30", count: 150 },
  { date: "2025-10-01", count: 280 },
  { date: "2025-10-02", count: 310 },
  { date: "2025-10-03", count: 200 },
  { date: "2025-10-04", count: 270 },
  { date: "2025-10-05", count: 240 },
  { date: "2025-10-25", count: 190 },
]

const accountDistribution = [
  { name: "ANGELONE", value: 8500, color: "#a855f7" },
  { name: "MSTOCK", value: 6200, color: "#06b6d4" },
  { name: "GROWW", value: 5800, color: "#3b82f6" },
  { name: "LEMON", value: 4300, color: "#10b981" },
  { name: "UPSTOX", value: 3200, color: "#f97316" },
  { name: "BAJAJ", value: 2100, color: "#84cc16" },
]

const pendingByAccount = [
  { name: "ANGELONE", value: 12500, color: "#a855f7" },
  { name: "MSTOCK", value: 9800, color: "#06b6d4" },
  { name: "GROWW", value: 7600, color: "#3b82f6" },
  { name: "LEMON", value: 3200, color: "#10b981" },
  { name: "UPSTOX", value: 2100, color: "#f97316" },
  { name: "BAJAJ INSTA", value: 1100, color: "#84cc16" },
]

const approvedByAccount = [
  { name: "BAJAJ", value: 1200, color: "#3b82f6" },
  { name: "ANGELONE", value: 650, color: "#a855f7" },
  { name: "GROWW", value: 320, color: "#06b6d4" },
  { name: "LEMON", value: 124, color: "#10b981" },
]

const tlNames = [
  "Abhinandan Shukla",
  "Akshat Kashyap",
  "Aryan Gupta",
  "Tanmoy jana",
  "Ankit Kumar Singh",
  "Suhani Mishra",
  "Sejal sharma",
  "Amit Sahani",
  "Pallivi kumari",
]

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
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onMonthChange(-1)} className="p-1 hover:bg-muted rounded">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="text-center">
          <div className="text-foreground font-semibold">{monthNames[month]}</div>
          <div className="text-muted-foreground text-sm">{year}</div>
        </div>
        <button onClick={() => onMonthChange(1)} className="p-1 hover:bg-muted rounded">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground font-semibold py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
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
              className={`py-2 text-sm rounded ${
                isInRange
                  ? "bg-primary text-primary-foreground"
                  : day
                    ? "text-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    : "text-muted-foreground"
              }`}
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
  const [startDate, setStartDate] = useState(new Date(2025, 8, 25))
  const [endDate, setEndDate] = useState(new Date(2025, 9, 25))
  const [calendarMonth, setCalendarMonth] = useState(9)
  const [calendarYear, setCalendarYear] = useState(2025)
  const [selectedHR, setSelectedHR] = useState("All Categories")
  const [selectedTL, setSelectedTL] = useState("All Customers")
  const [showCalendar, setShowCalendar] = useState(false)
  const [manualStartDate, setManualStartDate] = useState("2025-09-25")
  const [manualEndDate, setManualEndDate] = useState("2025-10-25")

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
    if (selectedTL === "All Customers") {
      return [
        { label: "DateWise Count", value: "31", icon: "📅" },
        { label: "Total Count", value: "2591", icon: "📊", subtext: "Database" },
        { label: "Pending", value: "2586", icon: "⏳" },
        { label: "Approved", value: "5", icon: "✓" },
        { label: "Completed", value: "0", icon: "✓" },
      ]
    }

    const data = tlData[selectedTL]
    return [
      { label: "DateWise Count", value: data.dateWiseCount.toString(), icon: "📅" },
      { label: "Total Count", value: data.totalCount.toString(), icon: "📊", subtext: "Database" },
      { label: "Pending", value: data.pending.toString(), icon: "⏳" },
      { label: "Approved", value: data.approved.toString(), icon: "✓" },
      { label: "Completed", value: data.completed.toString(), icon: "✓" },
    ]
  }

  const metrics = getMetrics()

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Account management and performance metrics</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[280px] max-w-[400px]">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-left"
            >
              {dateRangeText}
            </button>

            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-card border border-border rounded-lg p-4 shadow-lg">
                <div className="flex gap-4">
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

          {/* Dropdowns moved to the right */}
          <div className="flex gap-3 ml-auto">
            <select
              value={selectedHR}
              onChange={(e) => setSelectedHR(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
            >
              <option>All Categories</option>
              <option>DEMAT Account</option>
              <option>Bank Account</option>
              <option>Credit Card</option>
              <option>Personal Loan</option>
              <option>Insurance</option>
              <option>Mutual Fund</option>
            </select>

            <select
              value={selectedTL}
              onChange={(e) => setSelectedTL(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
            >
              <option>All Customers</option>
              {tlNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-card border border-border hover:border-primary transition-colors rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{metric.value}</p>
                  {metric.subtext && <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>}
                </div>
                <span className="text-xl sm:text-2xl">{metric.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Date Wise Account Created */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Date Wise Account Created</h3>
              <p className="text-muted-foreground text-sm">Account creation trend over time</p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dateWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().gridStroke} />
                  <XAxis 
                    dataKey="date" 
                    stroke={getChartColors().axisText}
                    tick={{ fill: getChartColors().axisText, fontSize: 12 }}
                    style={{ fontSize: "12px" }} 
                  />
                  <YAxis 
                    stroke={getChartColors().axisText}
                    tick={{ fill: getChartColors().axisText, fontSize: 12 }}
                    style={{ fontSize: "12px" }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ 
                      fill: getChartColors().dotFill, 
                      stroke: getChartColors().dotStroke,
                      strokeWidth: 2,
                      r: 6 
                    }}
                    activeDot={{ 
                      fill: getChartColors().dotFill, 
                      stroke: getChartColors().dotStroke,
                      strokeWidth: 2,
                      r: 8 
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Account Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Pending Account 2586</CardTitle>
              <CardDescription className="text-muted-foreground">Distribution by account type</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
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
                  >
                    {pendingByAccount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Pending Account */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Total Pending Account 36296</CardTitle>
              <CardDescription className="text-muted-foreground">Account breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
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
                  >
                    {pendingByAccount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Total Approved Account */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Total Approved Account 2294</CardTitle>
              <CardDescription className="text-muted-foreground">Approved accounts distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
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
                  >
                    {approvedByAccount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-card border border-border rounded-lg">
          <div className="flex flex-wrap gap-6">
            {accountDistribution.map((account, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }}></div>
                <span className="text-foreground text-sm">{account.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
