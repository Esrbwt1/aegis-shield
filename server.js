const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(express.json()); // <--- ADD THIS LINE
const PORT = 3000;

// Serve static files (our HTML and client-side JS) from a 'public' directory
app.use(express.static('public'));

// The API endpoint that the front-end will call
// It expects a URL like: /scan?url=https://www.shopify.com
app.get('/scan', (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'No target URL provided.' });
  }

  console.log(`[Server] Received scan request for: ${targetUrl}`);

  // Execute the MVS script as a child process
  exec(`node mvs.js ${targetUrl}`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`[MVS Error] ${error || stderr}`);
      return res.status(500).json({ error: 'Failed to execute scan.', details: stderr });
    }
    try {
      const scanData = JSON.parse(stdout);
      console.log(`[Server] Scan complete. Sending results to client.`);
      res.json(scanData);
    } catch (parseError) {
      console.error(`[Server] Failed to parse MVS JSON output.`);
      res.status(500).json({ error: 'Failed to parse scan results.' });
    }
  });
});

// This route will serve our report page
app.get('/report', (req, res) => {
  // We are just sending the HTML file. The client-side JS will handle the data.
  res.sendFile(path.join(__dirname, 'public', 'report.html'));
});


// This route serves the pre-order confirmation page
app.get('/preorder', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'preorder.html'));
});

// This API endpoint simulates capturing the pre-order email
app.post('/submit-preorder', express.json(), (req, res) => {
  const { email, reportData } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  
  // *** IN A REAL-WORLD SCENARIO, YOU WOULD SAVE THIS TO A DATABASE ***
  // For now, we will just log it to the server console to prove it works.
  console.log('==================================================');
  console.log('[Pre-Order Captured!]');
  console.log(`Email: ${email}`);
  console.log(`Scanned URL: ${reportData.storeUrl}`);
  console.log(`Risk Score: ${reportData.riskScore}`);
  console.log('==================================================');

  res.json({ success: true, message: 'Thank you for your pre-order! We will be in touch.' });
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('AEGIS SHIELD ACQUISITION ENGINE - ONLINE');
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Awaiting targets of opportunity...');
  console.log('==================================================');
});