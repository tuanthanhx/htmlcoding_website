(() => {
  const spBreak = 767.98;

  const isMobile = () => window.matchMedia(`(max-width: ${spBreak}px)`).matches;

  const detectBrowsers = () => {
    const html = $('html');
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('mac') >= 0) {
      html.addClass('is-mac');
    }
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        html.addClass('is-chrome');
      } else {
        html.addClass('is-safari');
      }
    }
    if (ua.indexOf('msie ') > -1 || ua.indexOf('trident/') > -1) {
      html.addClass('is-ie');
    }
    if (ua.indexOf('firefox') > -1) {
      html.addClass('is-firefox');
    }
    if (ua.indexOf('android') > -1) {
      html.addClass('is-android');
    }
    if (ua.match(/(iphone|ipod|ipad)/)) {
      html.addClass('is-ios');
    }
    if (ua.indexOf('edg/') > -1) {
      html.removeClass('is-chrome');
      html.addClass('is-chromium');
    }
  };

  const tabletViewport = () => {
    const viewport = document.getElementById('viewport');
    let ua = '';
    const setViewport = () => {
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      if (window.screen.width < 375 && portrait) {
        viewport.setAttribute('content', 'width=375, user-scalable=0');
      } else if (
        (window.screen.width >= 768 && window.screen.width <= 1199) ||
        (window.screen.width < 768 && window.screen.height >= 768 && !portrait)
      ) {
        viewport.setAttribute('content', 'width=1300, user-scalable=0');
        ua = navigator.userAgent.toLowerCase();
        if (
          (/macintosh/i.test(ua) &&
            navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 1) ||
          (ua.match(/(iphone|ipod|ipad)/) && !isMobile()) ||
          (ua.indexOf('android') > -1 && !isMobile())
        ) {
          $('html').addClass('is-tablet');
        }
      } else {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
        );
        $('html').removeClass('is-tablet');
      }
    };
    setViewport();
    $(window).on('load resize', setViewport);
  };

  const smoothScroll = () => {
    const anchors = $('a[href*="#"]:not([href="#"])');
    const headerHeight = 0;
    const speed = 500;
    let timeout = 0;
    let position = 0;
    const triggerScroll = (context) => {
      const href =
        typeof context === 'string' ?
          context :
          '#' + $(context).attr('href').split('#')[1];
      if (href === '#top') {
        $('body, html').animate({ scrollTop: 0 }, speed, 'swing');
        return false;
      }
      if (!$(context).hasClass('no-scroll') && $(href).length) {
        position = $(href).offset().top - headerHeight;
        $('body, html').animate({ scrollTop: position }, speed, 'swing');
        return false;
      }
      return true;
    };
    setTimeout(() => {
      window.scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);
    if (window.location.hash) {
      window.scroll(0, 0);
      if (
        navigator.userAgent.indexOf('MSIE ') > -1 ||
        navigator.userAgent.indexOf('Trident/') > -1
      ) {
        timeout = 0;
      } else {
        timeout = 500;
      }
      setTimeout(() => {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on('click', (e) => triggerScroll(e.target.closest('a')));
  };

  const toggleNav = () => {
    $('.button-menu').on('click', () => {
      $('header').stop().toggleClass('nav-is-visible');
      return false;
    });
  };

  const toggleButtonTopVisibility = () => {
    const btnTop = $('a[href="#top"]');
    $(window).on('load scroll resize', () => {
      if ($(window).scrollTop() >= 200) {
        btnTop.fadeIn();
      } else {
        btnTop.fadeOut();
      }
    });
  };
  const handlePlayVideo = () => {
    const btnPlay = $('.video-button-play');
    btnPlay.on('click', function (e) {
      const videoBox = $(this).closest('.video-box');
      const videoMain = document.querySelector('.video-main');
      videoBox.addClass('is-playing');
      videoBox.find('.video-title').hide(0);
      videoBox.find('.video-button-play').hide(0);
      videoBox.find('.video-overlay').hide(0);
      videoBox.find('.video-placeholder').hide(0);
      videoMain.muted = false;
      videoMain.play();
      e.preventDefault();
    });
  };

  const initSwipper = () => {
    new Swiper('.stories-slider', {
      loop: true,
      slidesPerView: isMobile() ? 1 : 2,
      slidesPerGroup: isMobile() ? 1 : 2,
      spaceBetween: isMobile() ? 30 : 0,
      // autoplay: {
      //   delay: 5000
      // },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    detectBrowsers();
    tabletViewport();
    smoothScroll();
    toggleNav();
    toggleButtonTopVisibility();
  });
  window.addEventListener('load', () => {
    initSwipper();
    handlePlayVideo();
  });
})();
