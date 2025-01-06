function redirectUser() {
    const role = document.querySelector('.login-box select').value;
    if (role === 'student') {
        window.location.href = '/overview';
    } else if (role === 'tutor') {
        window.location.href = '/overviewtutor';
    }
}