import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  try {
    // Find courses the user is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            videos: {
              include: {
                progress: {
                  where: { userId }
                }
              }
            }
          }
        }
      }
    })

    const courses = enrollments.map(e => {
      const course = e.course
      const totalVideos = course.videos.length
      const completedVideos = course.videos.filter(v => v.progress[0]?.completed).length
      
      // Calculate progress percentage
      const progress = totalVideos > 0 
        ? Math.round((completedVideos / totalVideos) * 100) 
        : 0

      // Find the "next" video (first one not completed)
      const nextVideo = course.videos.find(v => !v.progress[0]?.completed) || course.videos[0]

      return {
        ...course,
        progress,
        nextVideoTitle: nextVideo?.title || "No lessons yet",
        nextVideoId: nextVideo?.id,
      }
    })

    return NextResponse.json(courses)
  } catch (err) {
    console.error("[GET /api/user/courses]", err)
    return NextResponse.json({ error: "Failed to fetch user courses" }, { status: 500 })
  }
}
