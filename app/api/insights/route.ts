import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const INSIGHT_GENERATOR_AGENT_ID = '698834e2f92870f1ee0acc69'

// GET insights from agent
export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      include: { checkIns: true },
    })

    // Calculate completion rates
    const progressData = goals.map((goal) => {
      const progress = goal.targetValue > 0
        ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
        : 0
      return {
        category: goal.category,
        title: goal.title,
        completionRate: Math.round(progress),
      }
    })

    // Build message for Insight Generator
    const message = progressData
      .map((g) => `${g.title} (${g.category}) - ${g.completionRate}% completion rate`)
      .join(', ')

    return NextResponse.json({
      success: true,
      progressData,
      message: message || 'No goals yet',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
