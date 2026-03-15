const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const courses = await prisma.course.findMany({
    include: { videos: true }
  })
  console.log(`Found ${courses.length} courses:`)
  courses.forEach(c => {
    console.log(`- ${c.title} (${c.id}) - ${c.videos.length} videos`)
    c.videos.forEach(v => {
      console.log(`  * ${v.title} (${v.id})`)
    })
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())





