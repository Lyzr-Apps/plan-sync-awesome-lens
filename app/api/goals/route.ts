import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for demo purposes
// In production, replace with actual database
let goalsStore: any[] = [
  {
    id: '1',
    title: 'Morning Exercise',
    category: 'HABITS',
    targetValue: 7,
    currentValue: 4,
    frequency: 'DAILY',
    endDate: null,
    createdAt: new Date().toISOString(),
    checkIns: []
  },
  {
    id: '2',
    title: 'Save $200 Monthly',
    category: 'FINANCES',
    targetValue: 200,
    currentValue: 85,
    frequency: 'MONTHLY',
    endDate: null,
    createdAt: new Date().toISOString(),
    checkIns: []
  },
  {
    id: '3',
    title: 'Portfolio Projects',
    category: 'CAREER',
    targetValue: 3,
    currentValue: 2,
    frequency: 'MONTHLY',
    endDate: null,
    createdAt: new Date().toISOString(),
    checkIns: []
  },
  {
    id: '4',
    title: 'Read 30 Minutes Daily',
    category: 'PERSONAL',
    targetValue: 7,
    currentValue: 2,
    frequency: 'DAILY',
    endDate: null,
    createdAt: new Date().toISOString(),
    checkIns: []
  }
]

// GET all goals
export async function GET() {
  try {
    return NextResponse.json({ success: true, goals: goalsStore })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// POST create new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, frequency, targetValue, endDate } = body

    const newGoal = {
      id: Date.now().toString(),
      title,
      category,
      frequency,
      targetValue: parseFloat(targetValue),
      currentValue: 0,
      endDate: endDate || null,
      createdAt: new Date().toISOString(),
      checkIns: []
    }

    goalsStore.push(newGoal)
    return NextResponse.json({ success: true, goal: newGoal })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

// PUT update goal
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const goalIndex = goalsStore.findIndex(g => g.id === id)
    if (goalIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      )
    }

    goalsStore[goalIndex] = { ...goalsStore[goalIndex], ...updateData }
    return NextResponse.json({ success: true, goal: goalsStore[goalIndex] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

// DELETE goal
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Goal ID required' },
        { status: 400 }
      )
    }

    goalsStore = goalsStore.filter(g => g.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
