import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createReadStream, existsSync, statSync } from "fs"
import { join } from "path"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const video = await prisma.video.findUnique({
      where: { id },
    })

    if (!video) {
      return new NextResponse("Video not found", { status: 404 })
    }

    const { videoUrl } = video

    if (videoUrl.startsWith("local://")) {
      const localPath = videoUrl.replace("local://", "")
      const fullPath = join(process.cwd(), "tmp", localPath)

      if (!existsSync(fullPath)) {
        return new NextResponse("Video file not found in local storage", { status: 404 })
      }

      const stat = statSync(fullPath)
      const fileSize = stat.size
      const range = req.headers.get("range")

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const file = createReadStream(fullPath, { start, end })
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": `${chunksize}`,
          "Content-Type": "video/mp4",
        }
        // @ts-ignore
        return new NextResponse(file, { status: 206, headers: head })
      } else {
        const head = {
          "Content-Length": `${fileSize}`,
          "Content-Type": "video/mp4",
        }
        // @ts-ignore
        const file = createReadStream(fullPath)
        // @ts-ignore
        return new NextResponse(file, { headers: head })
      }
    } else {
      // It's a remote URL (Supabase), just redirect to it
      return NextResponse.redirect(videoUrl)
    }
  } catch (err) {
    console.error(`[GET /api/videos/${id}/stream]`, err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
