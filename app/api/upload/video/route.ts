import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const courseId = formData.get("courseId") as string

    if (!file || !courseId) {
      return NextResponse.json({ error: "File and courseId are required" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to tmp folder
    const tmpDir = join(process.cwd(), "tmp", courseId)
    if (!existsSync(tmpDir)) {
      await mkdir(tmpDir, { recursive: true })
    }

    const fileName = `${Date.now()}_${file.name}`
    const filePath = join(tmpDir, fileName)
    await writeFile(filePath, buffer)

    // Return the local path or a specific identifier
    // For now, let's return a "local://" prefixed URL so we know it's local
    const videoUrl = `local://${courseId}/${fileName}`

    return NextResponse.json({ videoUrl })
  } catch (err) {
    console.error("[POST /api/upload/video]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
