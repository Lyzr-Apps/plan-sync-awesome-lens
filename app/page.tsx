'use client'

import { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  FaHome,
  FaChartLine,
  FaComments,
  FaBullseye,
  FaDumbbell,
  FaDollarSign,
  FaBriefcase,
  FaBook,
  FaPlus,
  FaFire,
  FaCheck,
  FaTrophy,
  FaStar,
  FaPaperPlane,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import type {
  Goal,
  GoalCategory,
  FrequencyType,
  ChatMessage,
  LifeCoachResponse,
  TodaysFocus,
  CategoryProgress,
  StreakData,
  KeyInsight,
} from '@/lib/types'

// Agent IDs
const LIFE_COACH_MANAGER_ID = '69883505f92870f1ee0acc6b'
const INSIGHT_GENERATOR_ID = '698834e2f92870f1ee0acc69'

// Category Icon Map
const categoryIcons = {
  HABITS: FaDumbbell,
  FINANCES: FaDollarSign,
  CAREER: FaBriefcase,
  PERSONAL: FaBook,
}

// Category Colors
const categoryColors = {
  HABITS: 'hsl(172, 66%, 45%)',
  FINANCES: 'hsl(45, 93%, 47%)',
  CAREER: 'hsl(217, 91%, 50%)',
  PERSONAL: 'hsl(280, 65%, 60%)',
}

// Progress Ring Component
function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = 'hsl(217, 91%, 50%)'
}: {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(210, 30%, 90%)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="transform rotate-90 text-sm font-bold"
        style={{ transformOrigin: 'center' }}
        fill="currentColor"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  )
}

// Goal Card Component
function GoalCard({
  goal,
  onUpdate,
  onCheckIn
}: {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onCheckIn: (goalId: string) => void
}) {
  const Icon = categoryIcons[goal.category]
  const progress = goal.targetValue > 0
    ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
    : 0

  return (
    <Card className="glass-card hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${categoryColors[goal.category]}15` }}
            >
              <Icon className="text-lg" style={{ color: categoryColors[goal.category] }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{goal.title}</h3>
              <span className="text-xs text-muted-foreground capitalize">{goal.frequency}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{goal.currentValue} / {goal.targetValue}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: categoryColors[goal.category]
              }}
            />
          </div>
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={() => onCheckIn(goal.id)}
          >
            <FaCheck className="mr-2" /> Mark Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Dashboard Component
function Dashboard({
  goals,
  streak,
  onCheckIn,
  onOpenChat,
}: {
  goals: Goal[]
  streak: StreakData
  onCheckIn: (goalId: string) => void
  onOpenChat: () => void
}) {
  const [todaysFocus, setTodaysFocus] = useState<TodaysFocus[]>([])

  useEffect(() => {
    // Get today's top 4 priority items
    const focus = goals.slice(0, 4).map(g => ({
      id: g.id,
      title: g.title,
      category: g.category,
      isDone: false,
    }))
    setTodaysFocus(focus)
  }, [goals])

  const categoryProgress: CategoryProgress[] = [
    { category: 'HABITS', percentage: 60, completedGoals: 3, totalGoals: 5 },
    { category: 'FINANCES', percentage: 45, completedGoals: 2, totalGoals: 3 },
    { category: 'CAREER', percentage: 85, completedGoals: 4, totalGoals: 5 },
    { category: 'PERSONAL', percentage: 30, completedGoals: 1, totalGoals: 4 },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-6 pb-24 space-y-6 max-w-4xl mx-auto">
      {/* Greeting Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}</h1>
            <p className="text-muted-foreground">You're doing great! Keep it up.</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <FaFire className="text-primary text-xl" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{streak.current}</div>
              <div className="text-xs text-muted-foreground">day streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Today's Focus</h2>
        <div className="grid grid-cols-2 gap-3">
          {todaysFocus.map((item) => {
            const Icon = categoryIcons[item.category]
            return (
              <Card
                key={item.id}
                className="glass-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onCheckIn(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon style={{ color: categoryColors[item.category] }} />
                    <span className="text-xs font-medium">{item.category}</span>
                  </div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <div className="mt-2">
                    {item.isDone ? (
                      <div className="flex items-center gap-1 text-accent text-xs">
                        <FaCheck /> Done
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Tap to complete</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Progress Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Progress Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          {categoryProgress.map((cat) => {
            const Icon = categoryIcons[cat.category]
            return (
              <Card key={cat.category} className="glass-card">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="mb-2">
                    <Icon className="text-2xl" style={{ color: categoryColors[cat.category] }} />
                  </div>
                  <ProgressRing
                    percentage={cat.percentage}
                    size={70}
                    strokeWidth={6}
                    color={categoryColors[cat.category]}
                  />
                  <div className="text-xs font-medium mt-2">{cat.category}</div>
                  <div className="text-xs text-muted-foreground">
                    {cat.completedGoals}/{cat.totalGoals} goals
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Floating Ask LifeFlow Button */}
      <button
        onClick={onOpenChat}
        className="fixed bottom-24 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <FaComments className="text-2xl" />
      </button>
    </div>
  )
}

// Goals Component
function Goals({
  goals,
  onAddGoal,
  onUpdateGoal,
  onCheckIn,
}: {
  goals: Goal[]
  onAddGoal: (goal: Partial<Goal>) => void
  onUpdateGoal: (goal: Goal) => void
  onCheckIn: (goalId: string) => void
}) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | GoalCategory>('ALL')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'HABITS' as GoalCategory,
    frequency: 'daily' as FrequencyType,
    targetValue: '1',
  })

  const filteredGoals = selectedCategory === 'ALL'
    ? goals
    : goals.filter(g => g.category === selectedCategory)

  const categories: Array<'ALL' | GoalCategory> = ['ALL', 'HABITS', 'FINANCES', 'CAREER', 'PERSONAL']

  const getCategoryCount = (cat: 'ALL' | GoalCategory) => {
    if (cat === 'ALL') return goals.length
    return goals.filter(g => g.category === cat).length
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) return

    await onAddGoal({
      title: formData.title,
      category: formData.category,
      frequency: formData.frequency,
      targetValue: parseFloat(formData.targetValue),
    })

    setFormData({ title: '', category: 'HABITS', frequency: 'daily', targetValue: '1' })
    setShowAddForm(false)
  }

  return (
    <div className="p-6 pb-24 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          {showAddForm ? <FaTimes className="mr-2" /> : <FaPlus className="mr-2" />}
          {showAddForm ? 'Cancel' : 'Add Goal'}
        </Button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="glass-card">
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Goal Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Exercise 3x per week"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as GoalCategory }))}
                className="w-full p-2 rounded-lg border border-border bg-background"
              >
                <option value="HABITS">Habits</option>
                <option value="FINANCES">Finances</option>
                <option value="CAREER">Career</option>
                <option value="PERSONAL">Personal</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as FrequencyType }))}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Target</label>
                <Input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                  min="1"
                />
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Create Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {cat} ({getCategoryCount(cat)})
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              <FaBullseye className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No goals yet. Create your first goal to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={onUpdateGoal}
              onCheckIn={onCheckIn}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Chat Component
function Chat({
  onClose,
  userName = 'there',
}: {
  onClose?: () => void
  userName?: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickSuggestions = [
    "I'm struggling with my goals",
    "How am I doing overall?",
    "Help me adjust my plan",
  ]

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await callAIAgent(messageText, LIFE_COACH_MANAGER_ID)

      if (result.success && result.response.status === 'success') {
        const coachResponse = result.response.result as LifeCoachResponse

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: coachResponse.coaching_message || 'I understand. Let me help you.',
          timestamp: new Date(),
          parsedResponse: coachResponse,
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <FaComments className="text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">LifeFlow Coach</h2>
            <p className="text-xs text-muted-foreground">Here to support you</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <FaTimes />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FaComments className="text-4xl mx-auto mb-2 opacity-50" />
            <p>Ask me anything about your goals and progress!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

              {/* Parsed Response Sections */}
              {msg.parsedResponse && (
                <div className="mt-4 space-y-3 pt-3 border-t border-border/20">
                  {msg.parsedResponse.behavior_insights && (
                    <div className="glass-card p-3 rounded-lg">
                      <div className="text-xs font-semibold mb-1 flex items-center gap-2">
                        <FaChartLine /> Behavior Insights
                      </div>
                      <p className="text-xs">{msg.parsedResponse.behavior_insights}</p>
                    </div>
                  )}

                  {msg.parsedResponse.plan_recommendations && (
                    <div className="glass-card p-3 rounded-lg">
                      <div className="text-xs font-semibold mb-1 flex items-center gap-2">
                        <FaBullseye /> Plan Recommendations
                      </div>
                      <p className="text-xs">{msg.parsedResponse.plan_recommendations}</p>
                    </div>
                  )}

                  {msg.parsedResponse.action_items && msg.parsedResponse.action_items.length > 0 && (
                    <div className="glass-card p-3 rounded-lg">
                      <div className="text-xs font-semibold mb-2 flex items-center gap-2">
                        <FaCheck /> Action Items
                      </div>
                      <ul className="space-y-1">
                        {msg.parsedResponse.action_items.map((item, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-2">
                            <FaCheck className="mt-0.5 text-accent flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.parsedResponse.encouragement && (
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-xs text-accent font-medium">{msg.parsedResponse.encouragement}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="px-3 py-2 bg-secondary rounded-full text-xs whitespace-nowrap hover:bg-secondary/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass-card p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <FaPaperPlane />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Insights Component
function Insights({ goals }: { goals: Goal[] }) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly')
  const [insights, setInsights] = useState<KeyInsight[]>([])
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [goals])

  const loadInsights = async () => {
    if (goals.length === 0) return

    setIsLoading(true)
    try {
      // Build progress message
      const progressData = goals.map(g => {
        const progress = g.targetValue > 0
          ? Math.min((g.currentValue / g.targetValue) * 100, 100)
          : 0
        return `${g.title} (${g.category}) - ${Math.round(progress)}% completion rate`
      }).join(', ')

      const result = await callAIAgent(
        `Generate insights from my progress: ${progressData}`,
        INSIGHT_GENERATOR_ID
      )

      if (result.success && result.response.status === 'success') {
        const data = result.response.result as any
        if (data.key_insights) {
          setInsights(data.key_insights)
        }
      }
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const achievements = [
    { icon: FaTrophy, title: 'Week Warrior', description: 'Completed 7 days in a row' },
    { icon: FaStar, title: 'Goal Setter', description: 'Created 5 goals' },
    { icon: FaFire, title: 'On Fire', description: '3 day streak' },
  ]

  const categoryData = [
    { category: 'HABITS', value: 60 },
    { category: 'FINANCES', value: 45 },
    { category: 'CAREER', value: 85 },
    { category: 'PERSONAL', value: 30 },
  ]

  const nextInsight = () => {
    setCurrentInsightIndex((prev) => (prev + 1) % Math.max(insights.length, 1))
  }

  const prevInsight = () => {
    setCurrentInsightIndex((prev) => (prev - 1 + insights.length) % Math.max(insights.length, 1))
  }

  return (
    <div className="p-6 pb-24 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeframe === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Progress Charts */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Category Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((data) => {
              const Icon = categoryIcons[data.category as GoalCategory]
              return (
                <div key={data.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon style={{ color: categoryColors[data.category as GoalCategory] }} />
                      <span className="text-sm font-medium">{data.category}</span>
                    </div>
                    <span className="text-sm font-bold">{data.value}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${data.value}%`,
                        backgroundColor: categoryColors[data.category as GoalCategory],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Insights Carousel */}
      {insights.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="text-center py-6">
                <h3 className="font-semibold mb-2">{insights[currentInsightIndex]?.insight_title}</h3>
                <p className="text-sm text-muted-foreground">{insights[currentInsightIndex]?.insight_message}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs">
                  {insights[currentInsightIndex]?.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={prevInsight}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <div className="text-xs text-muted-foreground">
                  {currentInsightIndex + 1} / {insights.length}
                </div>
                <button
                  onClick={nextInsight}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, idx) => {
            const Icon = achievement.icon
            return (
              <Card key={idx} className="glass-card">
                <CardContent className="p-4 text-center">
                  <Icon className="text-3xl text-primary mx-auto mb-2" />
                  <div className="text-xs font-semibold">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Pattern Insights */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <FaChartLine className="text-2xl text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Pattern Detected</h3>
              <p className="text-sm text-muted-foreground">
                You're most productive on Monday, Wednesday, and Friday mornings.
                Consider scheduling important tasks during these times!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Bottom Navigation Component
function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  const tabs = [
    { id: 'dashboard', icon: FaHome, label: 'Home' },
    { id: 'goals', icon: FaBullseye, label: 'Goals' },
    { id: 'chat', icon: FaComments, label: 'Chat' },
    { id: 'insights', icon: FaChartLine, label: 'Insights' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-card border-t p-2 safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Main App Component
export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [goals, setGoals] = useState<Goal[]>([])
  const [streak, setStreak] = useState<StreakData>({ current: 3, longest: 7, lastCheckIn: new Date() })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGoals()
    loadStreak()
  }, [])

  const loadGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      const data = await response.json()
      if (data.success) {
        setGoals(data.goals)
      }
    } catch (error) {
      console.error('Failed to load goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStreak = () => {
    const savedStreak = localStorage.getItem('lifeflow_streak')
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak))
    }
  }

  const saveStreak = (newStreak: StreakData) => {
    setStreak(newStreak)
    localStorage.setItem('lifeflow_streak', JSON.stringify(newStreak))
  }

  const handleAddGoal = async (goalData: Partial<Goal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      })
      const data = await response.json()
      if (data.success) {
        setGoals([data.goal, ...goals])
      }
    } catch (error) {
      console.error('Failed to create goal:', error)
    }
  }

  const handleUpdateGoal = async (goal: Goal) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      })
      const data = await response.json()
      if (data.success) {
        setGoals(goals.map(g => g.id === goal.id ? data.goal : g))
      }
    } catch (error) {
      console.error('Failed to update goal:', error)
    }
  }

  const handleCheckIn = async (goalId: string) => {
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, value: 1 }),
      })
      const data = await response.json()
      if (data.success) {
        // Update streak
        const today = new Date().toDateString()
        const lastCheckIn = streak.lastCheckIn ? new Date(streak.lastCheckIn).toDateString() : null

        if (lastCheckIn !== today) {
          const newStreak = {
            current: streak.current + 1,
            longest: Math.max(streak.longest, streak.current + 1),
            lastCheckIn: new Date(),
          }
          saveStreak(newStreak)
        }

        // Reload goals
        loadGoals()
      }
    } catch (error) {
      console.error('Failed to check in:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading LifeFlow...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {activeTab === 'dashboard' && (
        <Dashboard
          goals={goals}
          streak={streak}
          onCheckIn={handleCheckIn}
          onOpenChat={() => setActiveTab('chat')}
        />
      )}

      {activeTab === 'goals' && (
        <Goals
          goals={goals}
          onAddGoal={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onCheckIn={handleCheckIn}
        />
      )}

      {activeTab === 'chat' && <Chat />}

      {activeTab === 'insights' && <Insights goals={goals} />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
