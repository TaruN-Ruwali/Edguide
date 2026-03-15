const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const videos = await prisma.video.findMany()
  console.log("Videos in DB:", videos.map(v => v.id))
  
  const progress = await prisma.progress.findMany()
  console.log("Progress in DB:", progress)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())



