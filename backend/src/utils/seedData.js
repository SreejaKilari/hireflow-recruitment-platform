const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Seeding realistic development data...');

    // Clear existing collections
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Notification.deleteMany();

    // 1. Create Platform Admin (Controlled Creation)
    const adminUser = await User.create({
      name: 'HireFlow Platform Admin',
      email: 'admin@hireflow.dev',
      password: 'AdminPassword123!',
      role: 'admin',
      headline: 'Principal Infrastructure Administrator',
      location: 'San Francisco, CA',
    });

    // 2. Create Recruiters & Companies
    const recruiterStripe = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@stripe.com',
      password: 'Password123!',
      role: 'recruiter',
      headline: 'Lead Technical Recruiter @ Stripe',
      location: 'San Francisco, CA',
    });

    const companyStripe = await Company.create({
      name: 'Stripe',
      description:
        'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their businesses online.',
      website: 'https://stripe.com',
      location: 'San Francisco, CA (Remote Friendly)',
      logoUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      industry: 'Financial Technology & Payments',
      employeeCount: '5,000+',
      recruiter: recruiterStripe._id,
    });

    recruiterStripe.company = companyStripe._id;
    await recruiterStripe.save();

    const recruiterVercel = await User.create({
      name: 'David Chen',
      email: 'recruiter@vercel.com',
      password: 'Password123!',
      role: 'recruiter',
      headline: 'Senior Talent Partner @ Vercel',
      location: 'New York, NY',
    });

    const companyVercel = await Company.create({
      name: 'Vercel',
      description:
        'Vercel provides developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.',
      website: 'https://vercel.com',
      location: 'Remote (Global)',
      logoUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
      industry: 'Developer Tooling & Cloud Platforms',
      employeeCount: '500+',
      recruiter: recruiterVercel._id,
    });

    recruiterVercel.company = companyVercel._id;
    await recruiterVercel.save();

    // 3. Create Job Seeker User
    const seekerUser = await User.create({
      name: 'Kilari Sreeja',
      email: 'seeker@hireflow.dev',
      password: 'Password123!',
      role: 'job_seeker',
      status: 'active',
      headline: 'Senior Full Stack MERN Developer | React & Node.js Specialist',
      bio: 'Results-driven software engineer with 4+ years building high-concurrency SaaS applications, modern web clients, and distributed APIs.',
      skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript ES6+', 'REST APIs', 'JWT', 'Docker'],
      location: 'Bengaluru, India (Open to Remote)',
      phone: '+91 90148 53736',
      resumeUrl: '/uploads/resumes/sample-resume.pdf',
      resumeOriginalName: 'Kilari_Sreeja_Resume_2026.pdf',
      education: [
        {
          institution: 'National Institute of Technology',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science and Engineering',
          startYear: 2019,
          endYear: 2023,
        },
      ],
      experience: [
        {
          title: 'Full Stack Software Engineer',
          company: 'CloudFlow Labs',
          location: 'Bengaluru, India',
          startDate: new Date('2023-07-01'),
          current: true,
          description: 'Engineered microservices using Node.js/Express and built interactive dashboard features with React and Redux/Context API.',
        },
      ],
    });

    // 4. Create Realistic Jobs
    const job1 = await Job.create({
      title: 'Senior Full Stack Engineer (MERN)',
      company: companyStripe._id,
      companyName: 'Stripe',
      recruiter: recruiterStripe._id,
      jobType: 'full-time',
      workplaceType: 'remote',
      experienceLevel: 'senior',
      category: 'Engineering',
      location: 'San Francisco, CA (Remote)',
      minSalary: 155000,
      maxSalary: 195000,
      currency: 'USD',
      openings: 3,
      deadline: new Date('2026-12-31'),
      description:
        'We are seeking a seasoned Full Stack Engineer to lead architecture initiatives across our core billing platform. You will design scalable Node.js microservices and craft high-performance React frontends.',
      responsibilities: [
        'Architect robust APIs in Node.js and Express with high test coverage and observability',
        'Build responsive, accessible user interfaces using modern React and state management',
        'Optimize database queries and schema designs in MongoDB for multi-tenant scalability',
        'Collaborate with product designers and engineering managers on system roadmaps',
      ],
      skillsRequired: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs', 'JWT'],
      status: 'active',
      isApproved: true,
      isFeatured: true,
    });

    const job2 = await Job.create({
      title: 'Frontend React Developer',
      company: companyVercel._id,
      companyName: 'Vercel',
      recruiter: recruiterVercel._id,
      jobType: 'full-time',
      workplaceType: 'remote',
      experienceLevel: 'mid',
      category: 'Frontend',
      location: 'Remote (US/EU)',
      minSalary: 125000,
      maxSalary: 155000,
      currency: 'USD',
      openings: 2,
      deadline: new Date('2026-12-15'),
      description:
        'Join our design system and frontend platform team to create lightning-fast web experiences enjoyed by millions of developers worldwide.',
      responsibilities: [
        'Implement reusable UI design systems and design token architectures',
        'Integrate frontend state with RESTful and GraphQL backend endpoints',
        'Improve core web vitals and client-side rendering performance',
      ],
      skillsRequired: ['React.js', 'JavaScript ES6+', 'CSS3', 'HTML5', 'Performance Tuning'],
      status: 'active',
      isApproved: true,
      isFeatured: true,
    });

    const job3 = await Job.create({
      title: 'Backend API Engineer (Node.js & MongoDB)',
      company: companyStripe._id,
      companyName: 'Stripe',
      recruiter: recruiterStripe._id,
      jobType: 'full-time',
      workplaceType: 'hybrid',
      experienceLevel: 'mid',
      category: 'Backend',
      location: 'New York, NY',
      minSalary: 130000,
      maxSalary: 165000,
      currency: 'USD',
      openings: 2,
      deadline: new Date('2026-12-25'),
      description:
        'Build mission-critical payment ingestion services, webhook distribution pipelines, and fraud prevention microservices.',
      responsibilities: [
        'Develop real-time data sync services and REST APIs with Express and Node.js',
        'Ensure 99.99% service uptime, telemetry, and automated security scans',
        'Design clean Mongoose schemas and enforce database integrity',
      ],
      skillsRequired: ['Node.js', 'Express.js', 'MongoDB', 'Security', 'Caching'],
      status: 'active',
      isApproved: true,
      isFeatured: false,
    });

    // 5. Create Applications
    const app1 = await Application.create({
      job: job1._id,
      applicant: seekerUser._id,
      resumeUrl: seekerUser.resumeUrl,
      resumeOriginalName: seekerUser.resumeOriginalName,
      coverLetter:
        'I am thrilled to apply for the Senior Full Stack Engineer role at Stripe. With deep expertise across the MERN stack, I am confident in my ability to contribute to your core platforms immediately.',
      status: 'shortlisted',
      notes: 'Strong candidate profile. Excellent Node.js and MongoDB background.',
      statusHistory: [
        { status: 'applied', comment: 'Application submitted.' },
        { status: 'under_review', comment: 'Profile reviewed by hiring team.' },
        { status: 'shortlisted', comment: 'Selected for technical interview stage.' },
      ],
    });

    const app2 = await Application.create({
      job: job2._id,
      applicant: seekerUser._id,
      resumeUrl: seekerUser.resumeUrl,
      resumeOriginalName: seekerUser.resumeOriginalName,
      coverLetter:
        'Vercel products empower my daily development workflow. I would love to bring my React and design system expertise to your frontend team.',
      status: 'applied',
      statusHistory: [{ status: 'applied', comment: 'Application submitted.' }],
    });

    // 6. Create Initial Notifications
    await Notification.create([
      {
        recipient: seekerUser._id,
        sender: recruiterStripe._id,
        message: 'Congratulations! Your application for "Senior Full Stack Engineer (MERN)" at Stripe has been shortlisted.',
        type: 'application_status',
        link: '/seeker/applications',
        isRead: false,
      },
      {
        recipient: recruiterStripe._id,
        sender: seekerUser._id,
        message: `${seekerUser.name} applied for "${job1.title}".`,
        type: 'new_application',
        link: `/recruiter/jobs/${job1._id}/applications`,
        isRead: false,
      },
    ]);

    console.log('[Seed] Realistic seed data generated successfully!');
    console.log('---------------------------------------------------------');
    console.log('Demo Credentials for Testing:');
    console.log('1. Admin:     admin@hireflow.dev       / AdminPassword123!');
    console.log('2. Recruiter: recruiter@stripe.com     / Password123!');
    console.log('3. Seeker:    seeker@hireflow.dev      / Password123!');
    console.log('---------------------------------------------------------');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message);
  }
};

if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}

module.exports = seedDatabase;
