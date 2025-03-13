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

  const toggleFaq = () => {
    $('.list-faq .item-title').on('click', function () {
      const item = $(this).closest('li');
      const itemText = $(this).next('.item-text');
      item.toggleClass('is-expanded');
      if (item.hasClass('is-expanded')) {
        itemText.stop().slideDown(200);
      } else {
        itemText.stop().slideUp(200);
      }
    });
  };

  const toggleNav = () => {
    $('.button-menu').on('click', () => {
      $('header').stop().toggleClass('nav-is-visible');
      return false;
    });
    $('header a').on('click', () => {
      $('header').stop().removeClass('nav-is-visible');
      return false;
    });
  };

  const toggleHeaderFixed = () => {
    const header = $('header');
    $(window).on('load scroll resize', () => {
      if ($(window).scrollTop() <= (isMobile() ? 0 : 200)) {
        header.addClass('is-transparent');
      } else {
        header.removeClass('is-transparent');
      }
    });
  };
  const showPriceBreakdown = () => {
    $('.result-link a').on('click', () => {
      alert('This feature will be completed soon.');
      return false;
    });
  };

  const config = {
    basePrice: 100,
    setupPrice: 100,
    baseSpeed: 1,
    setupSpeed: 1,
    testSpeed: 1, responsiveMultipliers: {
      desktop_only: 0.8,
      mobile_only: 0.8,
      responsive: 1.0,
      responsive_liquid: 1.2
    },
    complexityMultipliers: {
      basic: 1.0,
      intermediate: 1.5,
      advanced: 2.0
    },
    speedMultipliers: {
      standard: { cost: 1.0, time: 1.0 },
      express: { cost: 1.3, time: 0.7 },
      super_express: { cost: 1.6, time: 0.5 }
    }
  };

  const calculateEstimate = () => {

    // 1. Collect user input
    const pageCount = parseInt(document.querySelector('input[name="page_count"]').value, 10) || 1;
    const responsiveOption = document.querySelector('select[name="responsive_option"]').value || 'responsive';
    const complexityLevel = document.querySelector('select[name="complexity_level"]').value || 'basic';
    const deliverySpeed = document.querySelector('select[name="delivery_speed"]').value || 'standard';

    // Validate page count
    const validatedPageCount = Math.min(Math.max(pageCount, 1), 100);

    // 2. Calculate estimates
    const responsiveFactor = config.responsiveMultipliers[responsiveOption];
    const complexityFactor = config.complexityMultipliers[complexityLevel];
    const speedFactors = config.speedMultipliers[deliverySpeed];

    const estimatedCost = config.setupPrice + config.basePrice * validatedPageCount * responsiveFactor * complexityFactor * speedFactors.cost;

    const estimatedWorkingDay = config.setupSpeed + config.testSpeed + config.baseSpeed * validatedPageCount * speedFactors.time;

    // 3. Update display
    const costElement = document.querySelector('[data-id="estimated-cost"]');
    const dayElement = document.querySelector('[data-id="estimated-day"]');

    costElement.textContent = Math.round(estimatedCost).toLocaleString();
    dayElement.textContent = Math.round(estimatedWorkingDay);

    // 4. Styling
    const sliderPin = document.querySelector('.range-slider-value');
    const minValue = 1;
    const maxValue = 100;
    const minPercent = isMobile() ? 3.5 : 1.5;
    const maxPercent = isMobile() ? 96.5 : 98.5;
    const percent = minPercent + ((pageCount - minValue) * (maxPercent - minPercent)) / (maxValue - minValue);
    sliderPin.textContent = pageCount;
    sliderPin.style.left = `${percent}%`;

    return { cost: estimatedCost, days: estimatedWorkingDay };
  };

  const setupEventListeners = () => {
    const inputs = document.querySelectorAll('input[name="page_count"], select[name="responsive_option"], select[name="complexity_level"], select[name="delivery_speed"]');
    inputs.forEach(input => {
      input.addEventListener('change', calculateEstimate);
      input.addEventListener('input', calculateEstimate);
    });
  };

  const handleFormSubmit = () => {
    $('#form-contact').on('submit', function (e) {
      e.preventDefault();
      const formData = $(this).serialize();
      $('#form-contact').addClass('is-loading');
      $.ajax({
        url: '/api/send-email',
        type: 'POST',
        data: formData,
        success: () => {
          $('#form-contact').hide(0, () => {
            $('.section-top-contact .wrapper').append('<p class="form-message">Message sent successfully!</p>');
            $('#form-contact').remove();
          });
        },
        error: () => {
          alert('Error sending message');
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    detectBrowsers();
    tabletViewport();
    smoothScroll();
    toggleButtonTopVisibility();
    toggleFaq();
    toggleNav();
    toggleHeaderFixed();
    showPriceBreakdown();
  });

  window.addEventListener('load', () => {
    setupEventListeners();
    calculateEstimate();
    handleFormSubmit();
  });
})();
