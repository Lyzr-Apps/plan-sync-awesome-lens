import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST create check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goalId, value, notes } = body

    // Create check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        goalId,
        value: parseFloat(value),
        notes,
      },
    })

    // Update goal current value
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { checkIns: true },
    })

    if (goal) {
      const totalValue = goal.checkIns.reduce((sum, ci) => sum + ci.value, 0)
      await prisma.goal.update({
        where: { id: goalId },
        data: { currentValue: totalValue },
      })
    }

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

    const checkIns = await prisma.checkIn.findMany({
      where: { goalId },
      orderBy: { completedAt: 'desc' },
    })

    return NextResponse.json({ success: true, checkIns })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch check-ins' },
      { status: 500 }
    )
  }
}
