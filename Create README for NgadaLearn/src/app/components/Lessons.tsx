import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BookOpen,
  Headphones,
  MessageCircle,
  Star,
  Play,
  CheckCircle2,
  Lock,
  Volume2,
} from "lucide-react";

export function Lessons() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lessonCategories = [
    {
      id: "conversation",
      name: "Conversation",
      icon: MessageCircle,
      color: "blue",
      lessons: [
        { id: 1, title: "Daily Greetings", level: "Beginner", completed: true },
        { id: 2, title: "Shopping & Money", level: "Beginner", completed: true },
        { id: 3, title: "At the Restaurant", level: "Intermediate", completed: false },
        { id: 4, title: "Job Interview", level: "Advanced", completed: false, locked: true },
      ],
    },
    {
      id: "ngadaflow",
      name: "NgadaFlow (Audio)",
      icon: Headphones,
      color: "purple",
      lessons: [
        { id: 5, title: "American Accent", level: "Beginner", completed: true },
        { id: 6, title: "British English", level: "Intermediate", completed: false },
        { id: 7, title: "Fast Speech Practice", level: "Advanced", completed: false, locked: true },
      ],
    },
    {
      id: "vocabulary",
      name: "Vocabulary",
      icon: Star,
      color: "orange",
      lessons: [
        { id: 8, title: "Business Terms", level: "Intermediate", completed: false },
        { id: 9, title: "Travel Phrases", level: "Beginner", completed: true },
        { id: 10, title: "Tech & Innovation", level: "Advanced", completed: false, locked: true },
      ],
    },
  ];

  const sampleExercise = {
    question: "How do you greet someone in a formal business setting?",
    options: [
      "Hey, what's up?",
      "Good morning, nice to meet you.",
      "Yo, how's it going?",
      "Hi there!",
    ],
    correctAnswer: "Good morning, nice to meet you.",
    explanation: "In formal business settings, it's important to use polite greetings like 'Good morning' or 'Good afternoon' followed by a professional introduction.",
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentExercise((prev) => prev + 1);
  };

  if (selectedLesson !== null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedLesson(null)}>
              ← Back to Lessons
            </Button>
          </div>

          <Card className="p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">At the Restaurant</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Intermediate
                </span>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">Exercise {currentExercise + 1} of 10</p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-medium">{sampleExercise.question}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {sampleExercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      showResult
                        ? option === sampleExercise.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : option === selectedAnswer
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50 opacity-50"
                        : selectedAnswer === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && option === sampleExercise.correctAnswer && (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResult && (
                <div
                  className={`p-6 rounded-lg ${
                    selectedAnswer === sampleExercise.correctAnswer
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-red-50 border-2 border-red-200"
                  }`}
                >
                  <h4 className="font-bold mb-2 text-lg">
                    {selectedAnswer === sampleExercise.correctAnswer
                      ? "🎉 Correct!"
                      : "❌ Not quite right"}
                  </h4>
                  <p className="text-gray-700">{sampleExercise.explanation}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline">Skip</Button>
                {showResult ? (
                  <Button
                    onClick={handleNextExercise}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Next Exercise →
                  </Button>
                ) : (
                  <Button disabled={!selectedAnswer}>
                    Check Answer
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Audio Exercise Preview */}
          <Card className="p-6 mt-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">NgadaFlow Audio Practice</h3>
                <p className="text-sm text-gray-600">Listen and repeat after the native speaker</p>
              </div>
              <Button size="sm" className="bg-purple-600">
                <Play className="w-4 h-4 mr-2" />
                Play Audio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Learning Path</h1>
          <p className="text-gray-600">Choose a lesson category to start practicing</p>
        </div>

        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="conversation" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="ngadaflow" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              NgadaFlow
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Vocabulary
            </TabsTrigger>
          </TabsList>

          {lessonCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {category.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`p-6 hover:shadow-lg transition-shadow ${
                    lesson.locked ? "opacity-60" : "cursor-pointer"
                  }`}
                  onClick={() => !lesson.locked && setSelectedLesson(lesson.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br from-${category.color}-100 to-${category.color}-200 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      {lesson.locked ? (
                        <Lock className={`w-8 h-8 text-${category.color}-600`} />
                      ) : lesson.completed ? (
                        <CheckCircle2 className={`w-8 h-8 text-${category.color}-600`} />
                      ) : (
                        <category.icon className={`w-8 h-8 text-${category.color}-600`} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{lesson.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            lesson.level === "Beginner"
                              ? "bg-green-100 text-green-700"
                              : lesson.level === "Intermediate"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {lesson.level}
                        </span>
                        {lesson.completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            ✓ Completed
                          </span>
                        )}
                        {lesson.locked && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {lesson.locked
                          ? "Complete previous lessons to unlock"
                          : lesson.completed
                          ? "Review this lesson anytime"
                          : "Start learning now"}
                      </p>
                    </div>

                    {!lesson.locked && (
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        {lesson.completed ? "Review" : "Start"}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
