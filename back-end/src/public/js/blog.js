const navbar = document.querySelector('#navbar-sticky');

window.addEventListener('scroll', function() {
  // kiểm tra vị trí cuộn của trang web
  if (window.scrollY > navbar.offsetTop) {
    // nếu vượt quá chiều cao của navbar, đặt position thành fixed
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.width= '100%';
  } else {
    navbar.style.position = 'static';
  }
});
