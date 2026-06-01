import { useEffect, useState } from "react";
import {
  ActivityIcon,
  TrendingUpIcon,
  SendIcon,
} from "lucide-react";

import {
  dummyPostsData,
  dummyAccountsData,
  dummyActivityData,
} from "../assets/assets";

const Dashboard = () => {
  const [stats, setStats] = useState({
    scheduledPosts: 0,
    accountsConnected: 0,
    aiCompositions: 0,
    publishedPosts: 0,
  });

const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const posts = dummyPostsData || [];
        const accounts = dummyAccountsData || [];
        const activitiesData = dummyActivityData || [];

        setStats({
          scheduledPosts: posts.filter((post: any) => post?.status === "scheduled").length,

          publishedPosts: posts.filter((post: any) => post?.status === "published").length,

          aiCompositions: posts.filter((post: any) => post?.isAIComposed === true || post?.aiGenerated === true ).length,
          accountsConnected: accounts.length,
        });

        setActivities(activitiesData);
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error
        );
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduledPosts,
      icon: "📅",
      trend: "+5% from last week",
      showTrendIcon: true,
    },
    {
      label: "Published Posts",
      value: stats.publishedPosts,
      icon: "✅",
      trend: "+2% from last week",
      showTrendIcon: true,
    },
    {
      label: "Connected Accounts",
      value: stats.accountsConnected,
      icon: "🔗",
      trend: "Active",
      showTrendIcon: false,
    },
    {
      label: "AI Compositions",
      value: stats.aiCompositions,
      icon: "🤖",
      trend: "+10% from last week",
      showTrendIcon: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Good Morning! <span>👋</span>
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Here's what's happening with your social media
          accounts today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-red-200 hover:bg-red-50 transition-all duration-300 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl mb-2">
                  {card.icon}
                </div>

                <div className="text-3xl font-semibold text-slate-800">
                  {card.value}
                </div>
              </div>

              <div className="text-xs flex items-center gap-1 text-red-500">
                {card.showTrendIcon && (
                  <TrendingUpIcon className="w-3 h-3" />
                )}
                {card.trend}
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-3">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">
            Recent Activity
          </h2>

          <span className="text-sm text-slate-500">
            {activities.length} events
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
              <ActivityIcon className="w-6 h-6 text-slate-400" />
            </div>

            <p className="text-slate-500">
              No recent activity
            </p>

            <p className="text-sm text-slate-400 mt-1 text-center">
              Connect accounts and schedule posts to see
              events here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((activity, index) => (
              <div
                key={activity?._id || index}
                className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-600 shrink-0">
                  <SendIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>Published</span>

                    <span>
                      {activity?.createdAt
                        ? new Date(
                            activity.createdAt
                          ).toLocaleString()
                        : "No date available"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mt-1">
                    {activity?.description ||
                      "No description available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;