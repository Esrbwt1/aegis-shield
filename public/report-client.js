document.addEventListener('DOMContentLoaded', () => {
    // Get the encoded data from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (!encodedData) {
        document.body.innerHTML = '<h1>Error: No scan data provided.</h1>';
        return;
    }

    // Decode the data and parse it back into a JSON object
    const reportData = JSON.parse(atob(encodedData));

    // --- Populate Header ---
    document.getElementById('report-url').textContent = `Target: ${reportData.storeUrl}`;
    document.getElementById('report-timestamp').textContent = `Scanned On: ${new Date(reportData.timestamp).toLocaleString()}`;

    // --- Populate Dashboard ---
    const riskScore = reportData.riskScore;
    const riskScoreText = document.getElementById('risk-score-text');
    const riskStatusText = document.getElementById('risk-status-text');
    const gaugeFill = document.getElementById('gauge-fill');

    riskScoreText.textContent = riskScore;
    const rotation = (riskScore / 100) * 180;
    gaugeFill.style.transform = `rotate(${rotation}deg)`;

    if (riskScore > 80) {
        riskStatusText.textContent = 'Low Risk';
        riskStatusText.style.color = '#22c55e';
        gaugeFill.style.backgroundColor = '#22c55e';
    } else if (riskScore > 40) {
        riskStatusText.textContent = 'Medium Risk';
        riskStatusText.style.color = '#f59e0b';
        gaugeFill.style.backgroundColor = '#f59e0b';
    } else {
        riskStatusText.textContent = 'High Risk';
        riskStatusText.style.color = '#ef4444';
        gaugeFill.style.backgroundColor = '#ef4444';
    }
    
    document.getElementById('summary-headline').textContent = `${Object.keys(reportData.findings).length} checks performed.`;
    
    // --- Populate Findings ---
    const findingsList = document.getElementById('findings-list');
    const preorderButton = document.querySelector('.cta button');
    preorderButton.addEventListener('click', () => {
        // We will pass the same encoded data to the preorder page
        window.location.href = `/preorder?data=${encodedData}`;
    });
    for (const key in reportData.findings) {
        const finding = reportData.findings[key];
        const card = document.createElement('div');
        card.className = `finding-card ${finding.status.toLowerCase()}`;
        
        let findingTitle = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

        card.innerHTML = `
            <p><strong>${findingTitle}: ${finding.status}</strong></p>
            <code class="evidence">${finding.evidence}</code>
        `;
        findingsList.appendChild(card);
    }
});