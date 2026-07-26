import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080/api';

async function testWorkflow() {
  console.log('🏁 Starting Prefracta AI Integration Test...');

  // 1. Generate unique user details
  const randomSuffix = Math.floor(Math.random() * 100000);
  const username = `tester_${randomSuffix}`;
  const email = `tester_${randomSuffix}@prefracta.ai`;
  const password = 'testpassword123';

  console.log(`👤 Registering user: ${username} (${email})...`);

  // 2. Signup
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!signupRes.ok) {
    const errorText = await signupRes.text();
    console.error('❌ Signup Failed:', errorText);
    process.exit(1);
  }

  const signupData = await signupRes.json();
  console.log('✅ Signup Successful!');
  const token = signupData.token;

  // 3. Run Load Test (Mocked/Simulated since EXECUTION_MODE=demo will be set)
  console.log('⚡ Launching Load Test Audit...');
  const testRes = await fetch(`${BASE_URL}/load-test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      testURL: 'https://prefracta-ai.vercel.app',
      githubRepo: 'https://github.com/DEEP13-2-5/Prefracta-AI'
    })
  });

  if (!testRes.ok) {
    const errorText = await testRes.text();
    console.error('❌ Load Test Failed:', errorText);
    process.exit(1);
  }

  const testData = await testRes.json();
  console.log('✅ Load Test Audit Completed!');
  console.log('\n=======================================');
  console.log('📊 TEST METRICS GATHERED:');
  console.log('=======================================');
  console.log(`- Target URL: ${testData.url}`);
  console.log(`- Detected Framework: ${testData.github?.framework || 'Express/React'}`);
  console.log(`- Throughput (RPS): ${testData.metrics?.throughput.toFixed(2)} req/s`);
  console.log(`- p95 Latency: ${testData.metrics?.latency?.p95} ms`);
  console.log(`- Error Rate: ${testData.metrics?.errorRate}`);
  console.log(`- DevOps Score: ${testData.github?.summary?.devOpsScore}/100`);
  console.log(`- Docker Present: ${testData.github?.docker?.present}`);
  console.log(`- CI/CD Present: ${testData.github?.cicd?.present}`);
  console.log(`- Playwright UX Audit:`);
  console.log(`  * Performance: ${testData.browserMetrics?.performance}/100`);
  console.log(`  * Accessibility: ${testData.browserMetrics?.accessibility}/100`);
  console.log(`  * SEO: ${testData.browserMetrics?.seo}/100`);
  console.log(`- AI Stability Score: ${testData.ai?.businessInsights?.stabilityRiskScore}/100`);
  console.log(`- Conversion Loss Estimate: ${testData.ai?.businessInsights?.conversionLoss}%`);
  console.log(`- Ad Spend Risk: ₹${testData.ai?.businessInsights?.adSpendRisk}`);
  console.log('\n🤖 PREFRACTA AI VERDICT:');
  console.log(testData.ai?.message);
  console.log('=======================================');

  // 4. Test Chat Interaction
  const sessionId = testData.id;
  console.log(`\n💬 Sending a diagnostic query to AI Chat for Session: ${sessionId}...`);
  const chatRes = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      sessionId,
      message: 'Why is my latency so high and what can I do to improve it?'
    })
  });

  if (!chatRes.ok) {
    const errorText = await chatRes.text();
    console.error('❌ Chat Request Failed:', errorText);
    process.exit(1);
  }

  const chatData = await chatRes.json();
  console.log('\n🤖 PREFRACTA CHAT RESPONSE:');
  console.log(chatData.reply);
  console.log('=======================================');
  console.log('🎉 Integration Test Completed Successfully!');
  process.exit(0);
}

testWorkflow().catch(e => {
  console.error('❌ Test script uncaught error:', e);
  process.exit(1);
});
