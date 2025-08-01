document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (!encodedData) {
        document.body.innerHTML = '<h1>Error: No report data found for pre-order.</h1>';
        return;
    }

    const reportData = JSON.parse(atob(encodedData));

    // Populate summary
    document.getElementById('summary-url').textContent = reportData.storeUrl;
    document.getElementById('summary-score').textContent = reportData.riskScore;

    const emailInput = document.getElementById('email-input');
    const submitButton = document.getElementById('submit-button');
    const successMessage = document.getElementById('success-message');
    const formDiv = document.querySelector('.email-form');

    submitButton.addEventListener('click', async () => {
        const email = emailInput.value;
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('/submit-preorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, reportData })
            });

            const result = await response.json();

            if (response.ok) {
                formDiv.style.display = 'none';
                successMessage.textContent = result.message;
                successMessage.style.display = 'block';
            } else {
                alert(`An error occurred: ${result.error}`);
            }
        } catch (error) {
            alert('A critical network error occurred.');
        }
    });
});