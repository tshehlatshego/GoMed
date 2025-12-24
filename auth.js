// Auth helpers for GoMed
const CURRENT_USER_KEY = 'gomedCurrentUser';

function isLoggedIn() {
  try {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  } catch (e) {
    return false;
  }
}

function handleGetStarted(nextUrl) {
  if (isLoggedIn()) {
    window.location.href = nextUrl;
  } else {
    const ret = encodeURIComponent(nextUrl);
    window.location.href = `login.html?return=${ret}`;
  }
  return false; // prevent default link behavior
}

function enforceLoginOrRedirect(nextUrl) {
  if (!isLoggedIn()) {
    const ret = encodeURIComponent(nextUrl || window.location.pathname.split('/').pop());
    window.location.href = `login.html?return=${ret}`;
  }
}
