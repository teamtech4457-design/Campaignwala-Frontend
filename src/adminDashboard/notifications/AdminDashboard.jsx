"use client"
import { useNavigate } from "react-router-dom"
import { Bell, Users, Zap, Clock } from "lucide-react"

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Admin Notification Center</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Manage and send notifications to users</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Incomplete Profile Card */}
          <button onClick={() => navigate("/admin/notifications/incomplete-profile")}>
            <div className="group cursor-pointer rounded-lg border border-border bg-card p-8 transition-all hover:border-blue-500 hover:shadow-lg text-left">
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold">Incomplete Profile</h2>
              <p className="mt-2 text-muted-foreground">
                Send notifications to users who haven't completed their profile yet
              </p>
              <div className="mt-6 flex items-center gap-2 text-blue-500 font-medium group-hover:gap-3 transition-all">
                <span>Go to Page</span>
                <span>→</span>
              </div>
            </div>
          </button>

          {/* Hot Offers Card */}
          <button onClick={() => navigate("/admin/notifications/hot-offers")}>
            <div className="group cursor-pointer rounded-lg border border-border bg-card p-8 transition-all hover:border-orange-500 hover:shadow-lg text-left">
              <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold">Hot Offers</h2>
              <p className="mt-2 text-muted-foreground">
                Send promotional notifications about hot offers to selected users
              </p>
              <div className="mt-6 flex items-center gap-2 text-orange-500 font-medium group-hover:gap-3 transition-all">
                <span>Go to Page</span>
                <span>→</span>
              </div>
            </div>
          </button>
        </div>

        {/* History Button */}
        <div className="mt-8">
          <button 
            onClick={() => navigate("/admin/notifications/history")}
            className="w-full md:w-auto"
          >
            <div className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-purple-500 hover:shadow-lg text-left">
              <div className="flex items-center gap-4">
                <div className="inline-flex rounded-lg bg-purple-500/10 p-3">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Notification History</h3>
                  <p className="text-muted-foreground">View all sent notifications and their status</p>
                </div>
                <div className="flex items-center gap-2 text-purple-500 font-medium group-hover:gap-3 transition-all">
                  <span>View History</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">Recent Notifications</h3>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="font-medium">Profile Completion Reminder</p>
                  <p className="text-sm text-muted-foreground">Sent to 234 users</p>
                </div>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="font-medium">Summer Sale - 50% Off</p>
                  <p className="text-sm text-muted-foreground">Sent to 1,245 users</p>
                </div>
                <span className="text-sm text-muted-foreground">1 day ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Feature Announcement</p>
                  <p className="text-sm text-muted-foreground">Sent to 5,678 users</p>
                </div>
                <span className="text-sm text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}