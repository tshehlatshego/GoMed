// Simple authentication system using localStorage
// In production, this should connect to a real backend authentication service

const USERS_KEY = 'gomedUsers';
const CURRENT_USER_KEY = 'gomedCurrentUser';
const LOGIN_ATTEMPT_KEY = 'gomedLoginAttempt';

// Initialize demo users (in production, these come from backend)
function initializeDemoUsers() {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
        const demoUsers = {
            'demo@gomed.com': {
                email: 'demo@gomed.com',
                password: 'password123', // Hash in production!
                name: 'Demo User',
                phone: '123-456-7890',
                createdAt: new Date().toISOString()
            },
            'test@example.com': {
                email: 'test@example.com',
                password: 'test123',
                name: 'Test Account',
                phone: '098-765-4321',
                createdAt: new Date().toISOString()
            }
        };
        localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Clear previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Simulate login delay (in production, this is network request)
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.disabled = true;
    loginBtn.innerHTML = 'Signing in...';

    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        const user = users[email];

        if (!user || user.password !== password) {
            showError('Invalid email or password');
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Sign In';
            recordFailedAttempt();
            return;
        }

        // Successful login
        const userData = {
            email: user.email,
            name: user.name,
            phone: user.phone,
            loginTime: new Date().toISOString(),
            rememberMe: remember
        };

        // Save current user session
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

        // Clear failed attempts
        localStorage.removeItem(LOGIN_ATTEMPT_KEY);

        // Show success message
        showSuccess('Login successful! Redirecting...');

        // Determine return URL if present
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('return');
        const next = returnUrl ? decodeURIComponent(returnUrl) : 'index.html';

        // Redirect after 1.5 seconds
        setTimeout(() => {
            window.location.href = next;
        }, 1500);
    }, 800);
}

// Handle signup link click
function handleSignup(event) {
    event.preventDefault();
    showSuccess('Signup feature coming soon! Use demo@gomed.com / password123 to test');
    // In production, would navigate to signup.html
}

// Handle forgot password link click
function handleForgotPassword(event) {
    event.preventDefault();
    const email = prompt('Enter your email address to reset password:');
    if (email) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        if (users[email]) {
            showSuccess('Password reset link sent to ' + email + ' (Check your demo email)');
        } else {
            showError('No account found with this email');
        }
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '⚠️ ' + message;
    errorMessage.style.display = 'block';
    document.querySelector('.login-container').scrollTop = 0;
}

// Show success message
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = '✓ ' + message;
    successMessage.style.display = 'block';
}

// Record failed login attempts (basic security)
function recordFailedAttempt() {
    const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPT_KEY) || '{"count": 0, "timestamp": 0}');
    const now = Date.now();
    
    // Reset if more than 15 minutes have passed
    if (now - attempts.timestamp > 15 * 60 * 1000) {
        attempts.count = 0;
    }

    attempts.count++;
    attempts.timestamp = now;
    localStorage.setItem(LOGIN_ATTEMPT_KEY, JSON.stringify(attempts));

    // Warn after 3 attempts
    if (attempts.count === 3) {
        showError('Too many failed attempts. Please try again in 15 minutes.');
    }
}

// Check if user is already logged in on page load
function checkUserSession() {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
        const user = JSON.parse(currentUser);
        // User already logged in, could redirect or show logout option
        console.log('User already logged in:', user.name);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoUsers();
    checkUserSession();

    // Optional: Pre-fill email if previously saved
    const savedEmail = localStorage.getItem('gomedSavedEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
});

// Save email on successful login (if remember me is checked)
document.addEventListener('submit', function(e) {
    if (e.target.id === 'loginForm') {
        const remember = document.getElementById('remember').checked;
        const email = document.getElementById('email').value;
        if (remember) {
            localStorage.setItem('gomedSavedEmail', email);
        } else {
            localStorage.removeItem('gomedSavedEmail');
        }
    }
});

// Logout function (can be called from dashboard/account page)
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('gomedCart');
    window.location.href = 'login.html';
}

// Get current logged-in user
function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

// Check if user is logged in
function isUserLoggedIn() {
    return !!localStorage.getItem(CURRENT_USER_KEY);
}
