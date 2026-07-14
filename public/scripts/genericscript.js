var menuToggle = document.getElementById('menuToggle');
  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('sidebarBackdrop');
  var icon = document.getElementById('menuIcon');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
    icon.textContent = '✕';
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
    icon.textContent = '☰';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (sidebar.classList.contains('-translate-x-full')) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  document.querySelectorAll('[data-logout]').forEach(function (button) {
    button.addEventListener('click', async function () {
      button.disabled = true;
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = 'login.html';
    });
  });
