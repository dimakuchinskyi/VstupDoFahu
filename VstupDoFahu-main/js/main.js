// Простий JS для мобільного меню, плавного скролу та обробки форми
document.addEventListener('DOMContentLoaded', function(){
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');
  if(navToggle){
    navToggle.addEventListener('click', function(){
      siteNav.classList.toggle('show');
    });
  }

  // Smooth scroll for internal links (same page anchors only)
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(href === '#') return; // skip empty anchors
      var target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close nav on mobile
        if(siteNav && siteNav.classList.contains('show')) siteNav.classList.remove('show');
      }
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e){
    if(siteNav && navToggle){
      if(!siteNav.contains(e.target) && !navToggle.contains(e.target)){
        if(siteNav.classList.contains('show')){
          siteNav.classList.remove('show');
        }
      }
    }
  });

  // Simple contact form handling (no backend) — show a confirmation message
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      if(!name || !email || !message){
        status.textContent = 'Будь ласка, заповніть усі обов' + "'" + 'язкові поля.';
        status.style.color = 'crimson';
        return;
      }
      // Basic email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        status.textContent = 'Будь ласка, введіть коректний email.';
        status.style.color = 'crimson';
        return;
      }
      status.style.color = 'green';
      status.textContent = 'Дякуємо! Повідомлення готове до відправки (демо). Ми зв' + "'" + 'яжемося з вами найближчим часом.';
      // Тут можна додати AJAX-запит до бекенда якщо буде доступний
      setTimeout(function(){
        form.reset();
        status.textContent = '';
      }, 5000);
    });
  }
});

// --- Simple animation bootstrap: add 'play' to elements with class 'anim' with a small stagger ---
document.addEventListener('DOMContentLoaded', function(){
  // target common UI surfaces + explicit .anim markers
  var animated = document.querySelectorAll('.anim, .card, .hero-content, .hero-visual, .page-hero, .quick-link-card, .project, .stat-card, .source-item');
  var baseDelay = 120; // ms between staggered items
  animated.forEach(function(el, i){
    // ensure initial hidden state (so reveal animation is visible)
    el.classList.add('anim');

    // prioritize hero content so main-screen animation is visible early
    var delay = i * baseDelay;
    if(el.classList && el.classList.contains('hero-content')) delay = 80;
    if(el.classList && el.classList.contains('hero-visual')) delay = 200;

    // set custom property for delay and then add class to play
    el.style.setProperty('--delay', (delay) + 'ms');
    // small timeout to ensure CSS computed
    setTimeout(function(){ el.classList.add('play'); }, 60 + delay);
  });

  // Also add a subtle reveal for headings (hero and section headings)
  var headingEls = document.querySelectorAll('h1, .page-hero h1, .container h2, .card h3, .quick-link-card h3');
  headingEls.forEach(function(el, i){
    // avoid double-adding if already animated
    if(!el.classList.contains('heading-anim')){
      el.classList.add('heading-anim');
      // apply shimmer to all headings (user requested blue shimmer everywhere)
      el.classList.add('heading-gradient');
      var hDelay = 120 + i * 90; // stagger headings a bit
      el.style.setProperty('--delay', hDelay + 'ms');
      setTimeout(function(){ el.classList.add('play'); }, 60 + hDelay);
    }
  });

  // add continuous gradient animation to hero primary button for a subtle effect
  var heroPrimary = document.querySelector('.page-hero .btn.primary, .hero .btn.primary');
  if(heroPrimary){ heroPrimary.classList.add('animated'); }

  // IntersectionObserver: reveal elements when scrolled into view
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('play');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.anim, .heading-anim').forEach(function(el){ obs.observe(el); });
  }

  // --- Hero mouse parallax (subtle) ---
  try{
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduce){
      var hero = document.querySelector('.hero');
      var heroVisual = document.querySelector('.hero-visual');
      if(hero && heroVisual){
        var pos = {x:0,y:0};
        var raf = null;
        hero.addEventListener('mousemove', function(e){
          var rect = hero.getBoundingClientRect();
          var cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
          var cy = (e.clientY - rect.top) / rect.height - 0.5;
          pos.x = cx * 12; // max px
          pos.y = cy * 8;
          if(raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(function(){
            heroVisual.style.transform = 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,0)';
          });
        });
        hero.addEventListener('mouseleave', function(){
          if(raf) cancelAnimationFrame(raf);
          heroVisual.style.transform = '';
        });
      }
    }
  }catch(e){ /* silent */ }
});