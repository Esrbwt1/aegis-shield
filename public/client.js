document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const scanButton = document.getElementById('scan-button');
    const resultsContainer = document.getElementById('results-container');

    scanButton.addEventListener('click', async () => {
        const targetUrl = urlInput.value;
        if (!targetUrl) {
            alert('Please enter a valid URL.');
            return;
        }

        scanButton.disabled = true;
        scanButton.textContent = 'Scanning...';
        resultsContainer.style.display = 'block';
        resultsContainer.textContent = 'Analyzing target... This may take up to 30 seconds.';

        try {
            const response = await fetch(`/scan?url=${encodeURIComponent(targetUrl)}`);
            const results = await response.json();

            if (response.ok) {
                // **NEW LOGIC**
                // 1. Encode the results data into a string that can be put in a URL
                const encodedResults = btoa(JSON.stringify(results));
                // 2. Redirect the browser to the new report page with the data in the URL
                window.location.href = `/report?data=${encodedResults}`;
            } else {
                resultsContainer.textContent = `An error occurred: ${results.error}\n\nDetails: ${results.details || 'N/A'}`;
                scanButton.disabled = false;
                scanButton.textContent = 'Scan Now';
            }
        } catch (error) {
            resultsContainer.textContent = 'A critical network error occurred. Could not reach the Aegis Shield server.';
            scanButton.disabled = false;
            scanButton.textContent = 'Scan Now';
        }
    });
});