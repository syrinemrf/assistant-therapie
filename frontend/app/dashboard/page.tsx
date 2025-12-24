'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Brain, Heart, Trophy, Activity, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { MoodForm } from '@/components/mood/MoodForm';
import { getUserActivities, getActivityStats } from '@/lib/api/activities';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserId(user._id);
      loadData(user._id);
    } catch (error) {
      console.error('Error loading user:', error);
      router.push('/login');
    }
  }, [router]);

  const loadData = async (uid: string) => {
    setIsLoading(true);
    try {
      const [activitiesData, statsData] = await Promise.all([
        getUserActivities(uid),
        getActivityStats(uid, 7),
      ]);
      setActivities(activitiesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSuccess = () => {
    setShowMoodModal(false);
    if (userId) loadData(userId);
  };

  if (isLoading || !userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const wellnessStats = [
    {
      title: 'Mood Score',
      value: stats?.averageMood ? `${Math.round(stats.averageMood)}%` : 'No data',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Activities',
      value: stats?.totalActivities || 0,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Therapy Sessions',
      value: stats?.byType?.therapy || 0,
      icon: MessageSquare,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(stats?.completionRate || 100)}%`,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome to your Dashboard</h1>
          <p className="text-gray-600">Track your mental wellness journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {wellnessStats.map((stat) => (
            <Card key={stat.title} className="border-primary/10">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start your wellness activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/therapy')} 
                className="w-full justify-start"
                size="lg"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Therapy Session
              </Button>
              <Button 
                onClick={() => setShowMoodModal(true)} 
                variant="outline"
                className="w-full justify-start"
                size="lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Track Mood
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest wellness activities</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No activities yet. Start by tracking your mood or beginning a therapy session!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mood Modal */}
      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Track your mood to help us understand your emotional well-being
            </DialogDescription>
          </DialogHeader>
          <MoodForm userId={userId} onSuccess={handleMoodSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
