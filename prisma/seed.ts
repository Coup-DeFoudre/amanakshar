import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Bhav (Themes)
  const bhavs = [
    { name: 'प्रेम', slug: 'prem', description: 'प्रेम और प्यार की कविताएँ' },
    { name: 'भक्ति', slug: 'bhakti', description: 'भक्ति और आस्था की कविताएँ' },
    { name: 'जीवन', slug: 'jeevan', description: 'जीवन के अनुभवों की कविताएँ' },
    { name: 'दर्शन', slug: 'darshan', description: 'दार्शनिक और चिंतनशील कविताएँ' },
  ]

  for (const bhav of bhavs) {
    await prisma.bhav.upsert({
      where: { slug: bhav.slug },
      update: {},
      create: bhav,
    })
    console.log(`  ✓ Created bhav: ${bhav.name}`)
  }

  // Create default admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const passwordHash = await hash(adminPassword, 12)

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      passwordHash,
    },
  })
  console.log(`  ✓ Created admin user: ${adminUsername}`)

  // Seed site settings
  const settings = [
    { key: 'site_title', value: 'अमन अक्षर — कवि' },
    { key: 'site_description', value: 'कविताओं, प्रस्तुतियों और पुस्तकों का साहित्यिक घर' },
    { key: 'poet_name', value: 'अमन अक्षर' },
    { key: 'contact_email', value: 'info@amanakshar.com' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
    console.log(`  ✓ Set setting: ${setting.key}`)
  }

  // Seed a sample poem for testing
  const samplePoem = await prisma.poem.upsert({
    where: { slug: 'kuch-shabd-sirf-kahe-jaate' },
    update: {},
    create: {
      title: 'कुछ शब्द सिर्फ़ कहे जाते',
      slug: 'kuch-shabd-sirf-kahe-jaate',
      text: `कुछ शब्द सिर्फ़ कहे जाते
जिए जाते हैं

दिल की गहराइयों में उतरते
सांसों में बसते हैं

कुछ शब्द सिर्फ़ सुने जाते
महसूस किए जाते हैं`,
      poetName: 'अमन अक्षर',
      isFeatured: true,
      isPublished: true,
    },
  })
  console.log(`  ✓ Created sample poem: ${samplePoem.title}`)

  // Link poem to bhav
  const premBhav = await prisma.bhav.findUnique({ where: { slug: 'prem' } })
  if (premBhav) {
    await prisma.poemBhav.upsert({
      where: {
        poemId_bhavId: {
          poemId: samplePoem.id,
          bhavId: premBhav.id,
        },
      },
      update: {},
      create: {
        poemId: samplePoem.id,
        bhavId: premBhav.id,
      },
    })
    console.log(`  ✓ Linked poem to bhav: ${premBhav.name}`)
  }

  // Create featured content
  await prisma.featuredContent.upsert({
    where: { id: 'featured-quote-1' },
    update: {},
    create: {
      id: 'featured-quote-1',
      type: 'quote',
      customText: 'कुछ शब्द सिर्फ़ कहे जाते, जिए जाते हैं',
      position: 1,
      isActive: true,
    },
  })
  console.log('  ✓ Created featured quote')

  console.log('\n✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
