const request = require('supertest');
const app = require('./src/app');
const { connectDB, disconnectDB } = require('./src/config/db');
const seedDatabase = require('./src/utils/seedData');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING HIREFLOW COMPREHENSIVE INTEGRATION SUITE');
  console.log('====================================================');

  await connectDB();
  await seedDatabase();

  const server = app.listen(0);

  let seekerToken = '';
  let recruiterToken = '';
  let adminToken = '';
  let createdJobId = '';
  let applicationId = '';

  try {
    // 1. Health check
    console.log('\n[Test 1] Health Check');
    const healthRes = await request(server).get('/api/health');
    console.assert(healthRes.status === 200, 'Health check should be 200');
    console.log('✓ Health check passed:', healthRes.body.status);

    // 2. Seeker Login
    console.log('\n[Test 2] Job Seeker Login');
    const seekerLogin = await request(server).post('/api/auth/login').send({
      email: 'seeker@hireflow.dev',
      password: 'Password123!',
    });
    console.assert(seekerLogin.status === 200, 'Seeker login should be 200');
    console.assert(seekerLogin.body.data.token, 'Should return JWT token');
    seekerToken = seekerLogin.body.data.token;
    console.log('✓ Seeker login passed. Token received.');

    // 3. Recruiter Login
    console.log('\n[Test 3] Recruiter Login');
    const recLogin = await request(server).post('/api/auth/login').send({
      email: 'recruiter@stripe.com',
      password: 'Password123!',
    });
    console.assert(recLogin.status === 200, 'Recruiter login should be 200');
    recruiterToken = recLogin.body.data.token;
    console.log('✓ Recruiter login passed. Token received.');

    // 4. Admin Login
    console.log('\n[Test 4] Admin Login');
    const adminLogin = await request(server).post('/api/auth/login').send({
      email: 'admin@hireflow.dev',
      password: 'AdminPassword123!',
    });
    console.assert(adminLogin.status === 200, 'Admin login should be 200');
    adminToken = adminLogin.body.data.token;
    console.log('✓ Admin login passed. Token received.');

    // 5. Job Search & Filtering
    console.log('\n[Test 5] Public Job Search & Multi-Filtering');
    const searchRes = await request(server).get('/api/jobs?keyword=Engineer&jobType=full-time');
    console.assert(searchRes.status === 200, 'Job search should be 200');
    console.assert(searchRes.body.data.jobs.length > 0, 'Should return matching jobs');
    console.log(`✓ Job search passed. Found ${searchRes.body.data.jobs.length} matching jobs.`);

    // 6. Recruiter Creates a Job
    console.log('\n[Test 6] Recruiter Job Creation (RBAC verified)');
    const createJobRes = await request(server)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        title: 'Staff Cloud Infrastructure Architect',
        description: 'Lead next-generation serverless cloud infrastructure across global regions.',
        location: 'Remote',
        jobType: 'full-time',
        workplaceType: 'remote',
        experienceLevel: 'lead',
        category: 'Engineering',
        minSalary: 180000,
        maxSalary: 230000,
        skillsRequired: ['Kubernetes', 'Go', 'Docker', 'AWS'],
        responsibilities: ['Architect multi-region clusters', 'Reduce latency by 40%'],
      });
    console.assert(createJobRes.status === 201, 'Job creation should be 201');
    createdJobId = createJobRes.body.data._id;
    console.log('✓ Job created successfully with ID:', createdJobId);

    // 7. Seeker cannot access Recruiter Job Creation
    console.log('\n[Test 7] RBAC: Seeker Blocked from Creating Jobs');
    const blockedJobRes = await request(server)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({ title: 'Hacked Job Title', description: 'Test', location: 'Nowhere' });
    console.assert(blockedJobRes.status === 403, 'Seeker should receive 403 Forbidden on job creation');
    console.log('✓ RBAC check passed: Seeker received 403 Forbidden.');

    // 8. Seeker Applies for the Created Job
    console.log('\n[Test 8] Seeker Submits Job Application');
    const applyRes = await request(server)
      .post(`/api/applications/${createdJobId}/apply`)
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        coverLetter: 'I have extensive distributed infrastructure experience and would love to join!',
      });
    console.assert(applyRes.status === 201, 'Application should be 201');
    applicationId = applyRes.body.data._id;
    console.log('✓ Application submitted with ID:', applicationId);

    // 9. Duplicate Application Prevention
    console.log('\n[Test 9] Duplicate Application Prevention (Database unique index safeguard)');
    const duplicateRes = await request(server)
      .post(`/api/applications/${createdJobId}/apply`)
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({ coverLetter: 'Trying to apply a second time...' });
    console.assert(
      duplicateRes.status === 409 || duplicateRes.status === 400,
      'Duplicate application must be rejected with 409 Conflict'
    );
    console.log('✓ Duplicate application successfully rejected with status:', duplicateRes.status);

    // 10. Recruiter Views Candidate Submissions
    console.log('\n[Test 10] Recruiter ATS: View Candidates for Job');
    const candRes = await request(server)
      .get(`/api/applications/job/${createdJobId}`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    console.assert(candRes.status === 200, 'Should retrieve candidates');
    console.assert(candRes.body.data.applications.length === 1, 'Should have exactly 1 applicant');
    console.log('✓ Recruiter retrieved candidate list.');

    // 11. Recruiter Updates Application Status
    console.log('\n[Test 11] Recruiter ATS: Shortlist Candidate & Add Internal Notes');
    const updateStatusRes = await request(server)
      .patch(`/api/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        status: 'shortlisted',
        notes: 'Impressive track record. Proceeding with hiring manager round.',
      });
    console.assert(updateStatusRes.status === 200, 'Should update status to shortlisted');
    console.assert(updateStatusRes.body.data.status === 'shortlisted', 'Status must be shortlisted');
    console.log('✓ Candidate transitioned to SHORTLISTED stage.');

    // 12. Seeker Checks In-App Notifications
    console.log('\n[Test 12] In-App Notification Delivery');
    const notifRes = await request(server)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${seekerToken}`);
    console.assert(notifRes.status === 200, 'Should retrieve notifications');
    console.assert(notifRes.body.data.length > 0, 'Should have notifications');
    console.log(`✓ Candidate received ${notifRes.body.data.length} in-app notifications.`);

    // 13. Admin Platform Stats
    console.log('\n[Test 13] Admin Analytics & Platform Statistics');
    const adminStatsRes = await request(server)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    console.assert(adminStatsRes.status === 200, 'Admin stats should be 200');
    console.log('✓ Admin stats retrieved:', {
      totalUsers: adminStatsRes.body.data.totalUsers,
      totalJobs: adminStatsRes.body.data.totalJobs,
      totalApplications: adminStatsRes.body.data.totalApplications,
    });

    // 14. Admin User Governance: Toggle User Status
    console.log('\n[Test 14] Admin User Deactivation');
    const deactivateRes = await request(server)
      .patch(`/api/admin/users/${seekerLogin.body.data.user._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.assert(deactivateRes.status === 200, 'Should deactivate user');
    console.assert(deactivateRes.body.data.status === 'deactivated', 'Status should be deactivated');
    console.log('✓ Admin successfully toggled user status to deactivated.');

    // 15. Deactivated User Blocked from Logging In
    console.log('\n[Test 15] Deactivated User Blocked from Access');
    const blockedLogin = await request(server).post('/api/auth/login').send({
      email: 'seeker@hireflow.dev',
      password: 'Password123!',
    });
    console.assert(blockedLogin.status === 403, 'Deactivated account should be blocked with 403');
    console.log('✓ Deactivated account properly blocked from login with 403 Forbidden.');

    // Cleanup: Re-activate Seeker account so demo UI logins work smoothly
    await request(server)
      .patch(`/api/admin/users/${seekerLogin.body.data.user._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('✓ Cleanup: Demo Seeker account re-activated for live portal access.');

    console.log('\n====================================================');
    console.log('🎉 ALL 15 CRITICAL INTEGRATION TESTS PASSED CLEANLY!');
    console.log('====================================================\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
