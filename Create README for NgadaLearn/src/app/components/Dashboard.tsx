import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Link } from "react-router";
import {
  BookOpen,
  Headphones,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Star,
} from "lucide-react";

export function Dashboard() {
  // Mock data for demonstration
  const stats = {
    lessonsCompleted: 24,
    totalLessons: 100,
    currentStreak: 7,
    totalMinutes: 320,
    level: "Intermediate",
    nextMilestone: "Advanced",
  };

  const recentLessons = [
    { id: 1, title: "Daily Conversations", progress: 100, type: "conversation" },
    { id: 2, title: "Business English", progress: 60, type: "vocabulary" },
    { id: 3, title: "Listening Practice", progress: 80, type: "audio" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Student! 👋</h1>
            <p className="text-gray-600">Continue sua jornada para a fluência</p>
          </div>
          <Link to="/lessons">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Continue Learning
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.lessonsCompleted}</span>
            </div>
            <p className="text-sm opacity-90">Lessons Completed</p>
            <Progress value={(stats.lessonsCompleted / stats.totalLessons) * 100} className="mt-2 bg-blue-400" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.currentStreak}</span>
            </div>
            <p className="text-sm opacity-90">Day Streak 🔥</p>
            <p className="text-xs mt-2 opacity-75">Keep it up!</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.totalMinutes}</span>
            </div>
            <p className="text-sm opacity-90">Minutes Practiced</p>
            <p className="text-xs mt-2 opacity-75">This month</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8" />
              <span className="text-xl font-bold">{stats.level}</span>
            </div>
            <p className="text-sm opacity-90">Current Level</p>
            <p className="text-xs mt-2 opacity-75">Next: {stats.nextMilestone}</p>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Your Progress
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm text-gray-600">
                    {stats.lessonsCompleted}/{stats.totalLessons} lessons
                  </span>
                </div>
                <Progress value={(stats.lessonsCompleted / stats.totalLessons) * 100} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Conversation Skills</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Listening (NgadaFlow)</span>
                  <span className="text-sm text-gray-600">72%</span>
                </div>
                <Progress value={72} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Vocabulary</span>
                  <span className="text-sm text-gray-600">90%</span>
                </div>
                <Progress value={90} className="h-3" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Recent Activity
            </h2>

            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    {lesson.type === "conversation" && <BookOpen className="w-6 h-6 text-blue-600" />}
                    {lesson.type === "audio" && <Headphones className="w-6 h-6 text-purple-600" />}
                    {lesson.type === "vocabulary" && <Star className="w-6 h-6 text-orange-600" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <Progress value={lesson.progress} className="h-2 mt-2" />
                  </div>

                  <span className="text-sm text-gray-600">{lesson.progress}%</span>
                </div>
              ))}
            </div>

            <Link to="/lessons">
              <Button variant="outline" className="w-full mt-4">
                View All Lessons
              </Button>
            </Link>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Recent Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-medium text-sm">Week Warrior</p>
              <p className="text-xs text-gray-600">7-day streak</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-4xl mb-2">🎯</div>
              <p className="font-medium text-sm">Fast Learner</p>
              <p className="text-xs text-gray-600">20 lessons in a week</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
              <div className="text-4xl mb-2">🎧</div>
              <p className="font-medium text-sm">Audio Master</p>
              <p className="text-xs text-gray-600">100 minutes listening</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg opacity-50">
              <div className="text-4xl mb-2">🌟</div>
              <p className="font-medium text-sm">Perfect Month</p>
              <p className="text-xs text-gray-600">Coming soon...</p>
            </div>
          </div>
        </Card>

        {/* Daily Goal */}
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Daily Goal: Almost There! 🎯</h3>
              <p className="opacity-90">Complete 1 more lesson to hit your daily target</p>
            </div>
            <Link to="/lessons">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Lesson Now
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
