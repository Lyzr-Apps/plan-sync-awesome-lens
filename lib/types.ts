// TypeScript interfaces based on actual agent response structures

export type GoalCategory = 'HABITS' | 'FINANCES' | 'CAREER' | 'PERSONAL'
export type FrequencyType = 'daily' | 'weekly' | 'monthly'
export type InsightCategory = 'achievement' | 'progress' | 'growth'

// Life Coach Manager Response
export interface LifeCoachResponse {
  coaching_message: string
  behavior_insights: string
  plan_recommendations: string
  motivational_insights: string
  action_items: string[]
  encouragement: string
}

// Behavior Pattern Analyst Response
export interface BehaviorAnalystResponse {
  patterns_identified: string[]
  whats_working: string[]
  struggle_areas: string[]
  burnout_risk: string
  optimal_windows: string[]
  supportive_insights: string[]
}

// Plan Optimizer Response
export interface GoalAdjustment {
  goal_name: string
  current_timeline: string
  suggested_timeline: string
  rationale: string
}

export interface PlanOptimizerResponse {
  optimization_summary: string
  goal_adjustments: GoalAdjustment[]
  load_assessment: string
  recommended_pace: string
  supportive_message: string
}

// Insight Generator Response
export interface KeyInsight {
  insight_title: string
  insight_message: string
  category: InsightCategory
}

export interface VisualizationSuggestion {
  viz_type: string
  data_focus: string
  motivational_angle: string
}

export interface InsightGeneratorResponse {
  key_insights: KeyInsight[]
  achievements_highlighted: string[]
  visualization_suggestions: VisualizationSuggestion[]
  progress_summary: string
  encouragement_message: string
}

// Goal Model (Prisma)
export interface Goal {
  id: string
  title: string
  category: GoalCategory
  frequency: FrequencyType
  targetValue: number
  currentValue: number
  startDate: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Check-in Model
export interface CheckIn {
  id: string
  goalId: string
  completedAt: Date
  value: number
  notes?: string
}

// Chat Message
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  parsedResponse?: LifeCoachResponse
}

// Progress Data
export interface CategoryProgress {
  category: GoalCategory
  percentage: number
  completedGoals: number
  totalGoals: number
}

// Dashboard Data
export interface TodaysFocus {
  id: string
  title: string
  category: GoalCategory
  isDone: boolean
}

export interface StreakData {
  current: number
  longest: number
  lastCheckIn: Date | null
}
