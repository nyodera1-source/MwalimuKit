require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const { PrismaClient } = require('./lib/generated/prisma/client.js');

async function check() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Fetching data...');
    const paperCount = await prisma.questionPaper.count();
    const questionCount = await prisma.question.count();
    console.log('Papers:', paperCount);
    console.log('Questions:', questionCount);
    
    if (paperCount > 0) {
      const papers = await prisma.questionPaper.findMany({
        select: { subject: true, gradeLevel: true, year: true, examType: true, _count: { select: { questions: true } } },
        orderBy: { year: 'desc' },
        take: 10
      });
      console.log('Sample papers:');
      papers.forEach(p => console.log('  ' + p.subject + ' Grade ' + p.gradeLevel + ' (' + p.year + ', ' + p.examType + ') -> ' + p._count.questions + ' questions'));
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

check();
