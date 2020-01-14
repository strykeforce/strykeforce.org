function toggleBurgerMenu() {
  var menu = document.getElementById('site-nav__menu--narrow');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
}
