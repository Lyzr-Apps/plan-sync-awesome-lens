import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for check-ins
let checkInsStore: any[] = []

// POST create check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goalId, value, notes } = body

    const checkIn = {
      id: Date.now().toString(),
      goalId,
      value: parseFloat(value) || 1,
      notes: notes || '',
      completedAt: new Date().toISOString()
    }

    checkInsStore.push(checkIn)

    return NextResponse.json({ success: true, checkIn })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create check-in' },
      { status: 500 }
    )
  }
}

// GET check-ins for a goal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('goalId')

    if (!goalId) {
      return NextResponse.json(
        { success: false, error: 'Goal ID required' },
        { status: 400 }
      )
    }

    const checkIns = checkInsStore
      .filter(ci => ci.goalId === goalId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    return NextResponse.json({ success: true, checkIns })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch check-ins' },
      { status: 500 }
    )
  }
}
