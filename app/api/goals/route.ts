import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all goals
export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        checkIns: {
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, goals })
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

    const goal = await prisma.goal.create({
      data: {
        title,
        category,
        frequency,
        targetValue: parseFloat(targetValue),
        currentValue: 0,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return NextResponse.json({ success: true, goal })
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

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, goal })
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

    await prisma.goal.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
