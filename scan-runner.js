const fs = require('fs');
const { exec } = require('child_process'); // We need 'exec' to run shell commands
const targets = require('./targets.js'); // Import our list of targets

const outputFile = 'operation-market-scan-results.json';
const allScanResults = [];

// This function runs a single scan and returns a Promise
function runMvsScan(url) {
  console.log(`--- Dispatching MVS for target: ${url} ---`);
  return new Promise((resolve) => {
    // We execute our mvs.js script as a child process
    exec(`node mvs.js ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error for ${url}: ${error.message}`);
        // Even on error, we resolve so the runner doesn't stop
        resolve({ url, status: 'ERROR', data: error.message });
        return;
      }
      if (stderr) {
        console.error(`Standard error for ${url}: ${stderr}`);
        resolve({ url, status: 'ERROR', data: stderr });
        return;
      }
      try {
        // The JSON output from mvs.js is in stdout
        const scanData = JSON.parse(stdout);
        resolve({ url, status: 'SUCCESS', data: scanData });
      } catch (parseError) {
        console.error(`Failed to parse JSON for ${url}: ${parseError.message}`);
        resolve({ url, status: 'PARSE_ERROR', data: stdout });
      }
    });
  });
}

// This is the main orchestrator function
async function runOperation() {
  console.log('=== OPERATION MARKET SCAN - INITIALIZING ===');
  console.log(`Discovered ${targets.length} targets in dossier.`);
  console.log(`Results will be saved to: ${outputFile}`);
  console.log('============================================\n');

  for (const target of targets) {
    const result = await runMvsScan(target);
    allScanResults.push(result.data); // We only push the core scan data
    // Add a delay between requests to be a good internet citizen
    await new Promise(res => setTimeout(res, 2000)); // 2 second delay
  }

  console.log('\n============================================');
  console.log('=== ALL SCANS COMPLETE ===');
  console.log('Writing master results to dossier...');

  // Write the collected results to our master JSON file
  fs.writeFileSync(outputFile, JSON.stringify(allScanResults, null, 2));

  console.log(`SUCCESS: Master results dossier saved to ${outputFile}`);
  console.log('OPERATION MARKET SCAN - COMPLETE');
  console.log('============================================');
}

// Launch the operation
runOperation();