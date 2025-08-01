const fs = require('fs');

const resultsFile = 'operation-market-scan-results.json';

function analyzeDossier() {
  console.log('=== AEGIS SHIELD - DOSSIER ANALYSIS REPORT ===');

  // --- 1. Load the Dossier ---
  if (!fs.existsSync(resultsFile)) {
    console.error(`CRITICAL FAILURE: Results dossier not found at "${resultsFile}".`);
    console.error('Please run the scan-runner.js script first.');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));

  // --- 2. Initialize Metrics ---
  const totalScanned = results.length;
  let passedAll = 0;
  const checkFailureCount = {};
  const fatalErrors = [];

  // --- 3. Process Each Scan Result ---
  results.forEach(scan => {
    if (scan.findings.fatalError) {
      fatalErrors.push(scan.storeUrl);
      return; // Skip further analysis for this errored scan
    }

    let failedAnyCheck = false;
    // Iterate over the findings for each scan
    for (const checkKey in scan.findings) {
      // Initialize failure counter for the check if it doesn't exist
      if (!checkFailureCount[checkKey]) {
        checkFailureCount[checkKey] = 0;
      }

      if (scan.findings[checkKey].status === 'FAILED') {
        failedAnyCheck = true;
        checkFailureCount[checkKey]++;
      }
    }

    if (!failedAnyCheck) {
      passedAll++;
    }
  });

  // --- 4. Print Executive Summary ---
  const totalFailures = totalScanned - passedAll - fatalErrors.length;

  console.log('\n--- EXECUTIVE SUMMARY ---');
  console.log(`Total Stores Scanned: ${totalScanned}`);
  console.log(`  - Stores with Fatal Errors: ${fatalErrors.length}`);
  console.log(`  - Stores Analyzed: ${totalScanned - fatalErrors.length}`);
  console.log(`-----------------------------------`);
  console.log(`Stores Passing All Checks: ${passedAll} (${((passedAll / (totalScanned - fatalErrors.length)) * 100).toFixed(2)}%)`);
  console.log(`Stores Failing at Least One Check: ${totalFailures} (${((totalFailures / (totalScanned - fatalErrors.length)) * 100).toFixed(2)}%)`);

  console.log('\n--- CHECK-SPECIFIC FAILURE RATES ---');
  for (const checkKey in checkFailureCount) {
    const failureRate = (checkFailureCount[checkKey] / (totalScanned - fatalErrors.length)) * 100;
    console.log(`  - ${checkKey}: ${checkFailureCount[checkKey]} failures (${failureRate.toFixed(2)}%)`);
  }

  if (fatalErrors.length > 0) {
    console.log('\n--- STORES WITH FATAL ERRORS ---');
    fatalErrors.forEach(url => console.log(`  - ${url}`));
  }

  console.log('\n==============================================');
}

// Run the analysis
analyzeDossier();