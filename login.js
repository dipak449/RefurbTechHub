// login.js

function toggleLogin(show = true) {
  const overlay = document.getElementById('loginOverlay');
  overlay.classList.toggle('d-none', !show);
  document.body.classList.toggle('no-scroll', show);
  showPage('login');
}

function showPage(page) {
  ['loginContainer', 'registerContainer', 'forgotContainer'].forEach(id => {
    document.getElementById(id).classList.add('d-none');
  });
  document.getElementById(`${page}Container`).classList.remove('d-none');
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const stored = JSON.parse(localStorage.getItem(email));

  if (!stored || stored.password !== password) {
    alert('Invalid credentials!');
    return;
  }

  sessionStorage.setItem('loggedInUser', email);
  alert('Login successful!');
  toggleLogin(false);
  updateNavbarForUser(email);

  // Check if checkout was requested
  if (sessionStorage.getItem('redirectToCheckout') === 'true') {
    sessionStorage.removeItem('redirectToCheckout');
    setTimeout(() => {
      alert('Now you can proceed to checkout!');
      toggleCartSidebar(); // optionally reopen cart
    }, 200);
  }
}


function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!name || !phone || !address || !email || !password) {
    return alert('Please fill all fields');
  }

  if (localStorage.getItem(email)) return alert('User already exists');

  const userData = { name, phone, address, email, password };
  localStorage.setItem(email, JSON.stringify(userData));

  alert('Registration successful! Now login.');
  showPage('login');
}


function handleForgot() {
  const email = document.getElementById('forgotEmail').value;
  if (!localStorage.getItem(email)) return alert('No account found.');
  alert(`Reset link sent to ${email} (simulated).`);
  showPage('login');
}

function logoutUser() {
  sessionStorage.removeItem('loggedInUser');
  document.getElementById('loginBtn').classList.remove('d-none');
  document.getElementById('profileDropdown').classList.add('d-none');
  alert('Logged out successfully.');
}

function updateNavbarForUser(email) {
  const user = JSON.parse(localStorage.getItem(email));
  document.getElementById('loginBtn').classList.add('d-none');
  document.getElementById('profileDropdown').classList.remove('d-none');

  const info = `
  Name: ${user.name}
  Email: ${user.email}
  Phone: ${user.phone}
  Address: ${user.address}
`;

document.getElementById('userEmailDisplay').innerText = info;

// Theme toggle and login check
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', toggle.checked);
  });

  if (localStorage.getItem('theme') === 'dark') {
    toggle.checked = true;
    document.body.classList.add('dark');
  }

  toggle.addEventListener('change', () => {
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });

  // If already logged in
  const loggedInEmail = sessionStorage.getItem('loggedInUser');
  if (loggedInEmail) updateNavbarForUser(loggedInEmail);
})};
