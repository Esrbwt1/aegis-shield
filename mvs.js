const puppeteer = require('puppeteer');

// This function will contain the core scanning logic
async function runScan(targetUrl) {
  const scanReport = {
    storeUrl: targetUrl,
    timestamp: new Date().toISOString(),
    riskScore: 100,
    findings: {}
  };

  
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // --- CHECK 1: H1 Heading Detection ---
    const h1Element = await page.$('h1');
    if (h1Element) {
      scanReport.findings.h1Detection = { status: 'PASSED', evidence: 'Primary H1 heading is present.' };
    } else {
      scanReport.findings.h1Detection = { status: 'FAILED', evidence: 'No H1 heading was found.' };
      scanReport.riskScore -= 20;
    }

    // --- CHECK 2: Scan all links for "Terms of Service" ---
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), a => ({ text: a.textContent.trim(), href: a.href })));
    const termsLink = links.find(link => link.text.toLowerCase().includes('terms of service'));
    if (termsLink) {
      scanReport.findings.termsLink = { status: 'PASSED', evidence: `Found link with text: "${termsLink.text}"` };
    } else {
      scanReport.findings.termsLink = { status: 'FAILED', evidence: 'No link containing "Terms of Service" was found.' };
      scanReport.riskScore -= 30;
    }

  } catch (error) {
    scanReport.findings.fatalError = { status: 'ERROR', evidence: error.message };
    scanReport.riskScore = 0;
  } finally {
    if (browser) await browser.close();
  }

  // Output the final JSON report to the console
  console.log(JSON.stringify(scanReport, null, 2));
}

// --- MAIN EXECUTION BLOCK ---
// This is the new logic that handles command-line arguments.
const targetUrl = process.argv[2]; // process.argv[2] is the first argument you provide

if (!targetUrl) {
  console.error('CRITICAL ERROR: No target URL provided.');
  console.error('Usage: node mvs.js <full_url_to_scan>');
  console.error('Example: node mvs.js https://www.shopify.com');
  process.exit(1); // Exit the script with an error code
}

// If a URL is provided, run the scan.
runScan(targetUrl);