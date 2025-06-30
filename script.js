function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function checkPin() {
    const correctPin = "2025";
    let enteredPin = sessionStorage.getItem('websitePin');

    if (enteredPin === correctPin) {
        document.getElementById('pin-gate').style.display = 'none';
        document.getElementById('page-content').style.display = 'block';
    } else {
        document.getElementById('pin-gate').style.display = 'flex';
        document.getElementById('page-content').style.display = 'none';
        // Clear the session storage if the PIN is incorrect or not set
        sessionStorage.removeItem('websitePin');
    }
}

function submitPin() {
    const enteredPin = document.getElementById('pin-input').value;
    const correctPin = "2025";

    if (enteredPin === correctPin) {
        sessionStorage.setItem('websitePin', enteredPin);
        document.getElementById('pin-gate').style.display = 'none';
        document.getElementById('page-content').style.display = ''; // Revert to default display (block for div)
        console.log("PIN correct. Showing page content.");
    } else {
        alert('Incorrect PIN. Please try again.');
        document.getElementById('pin-input').value = '';
    }
}

// Check PIN on page load
window.onload = checkPin;
