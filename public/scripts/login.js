const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const loginSubmit = document.getElementById('login-submit');

const setLoginMessage = (text) => {
  loginMessage.textContent = text;
};

const redirectToApp = () => {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect') || 'index.html';
  const isLocalPath = redirect.startsWith('/') && !redirect.startsWith('//');
  const isLocalPage = /^[a-zA-Z0-9_-]+\.html$/.test(redirect);
  window.location.href = isLocalPath || isLocalPage ? redirect : 'index.html';
};

const checkSession = async () => {
  try {
    const response = await fetch('/api/auth/session');
    if (response.ok) redirectToApp();
  } catch (err) {
    // Stay on the login page when the app is offline or the session check fails.
  }
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoginMessage('');
  loginSubmit.disabled = true;
  loginSubmit.textContent = 'Signing in...';

  const formData = new FormData(loginForm);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.get('username').trim(),
        password: formData.get('password')
      })
    });

    if (!response.ok) {
      const error = await response.json();
      setLoginMessage(error.error || 'Unable to sign in.');
      return;
    }

    redirectToApp();
  } catch (err) {
    setLoginMessage('Unable to reach the server.');
  } finally {
    loginSubmit.disabled = false;
    loginSubmit.textContent = 'Sign in';
  }
});

checkSession();
