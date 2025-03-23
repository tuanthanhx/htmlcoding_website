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
    $('header a').on('click', function () {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        if ($(this).attr('href').includes('#')) {
          $('header').stop().removeClass('nav-is-visible');
          return false;
        }
      }
    });
  };

  const toggleHeaderFixed = () => {
    const header = $('header');
    $(window).on('load scroll resize', () => {
      if ($(window).scrollTop() <= (isMobile() ? 0 : 50)) {
        header.addClass('is-transparent');
      } else {
        header.removeClass('is-transparent');
      }
    });
  };

  const handleModal = () => {
    $('.open-modal').on('click', function (e) {
      e.preventDefault();
      const modalId = $(this).attr('data-modal');
      if ($('.' + modalId).length) {
        $('.' + modalId).stop().fadeIn();
      }
    });
    $('.modal .modal-close').on('click', function (e) {
      e.preventDefault();
      const modal = $(this).closest('.modal');
      modal.stop().fadeOut();
    });
  };

  const config = {
    basePrice: 99,
    homePagePrice: 198,
    baseSpeed: 1,
    homePageSpeed: 2,
    testSpeed: 1,
    responsiveMultipliers: {
      desktop_only: { cost: 0.5, name: 'Desktop Only' },
      mobile_only: { cost: 0.5, name: 'Mobile Only' },
      responsive: { cost: 1.0, name: 'Responsive' },
      liquid: { cost: 1.25, name: 'True Liquid Responsive' }
    },
    complexityMultipliers: {
      basic: { cost: 0.5, name: 'Basic' },
      intermediate: { cost: 1, name: 'Intermediate' },
      advanced: { cost: 1.5, name: 'Advanced' }
    },
    speedMultipliers: {
      standard: { cost: 1.0, time: 1, name: 'Standard' },
      express: { cost: 2, time: 0.5, name: 'Express' }
    }
  };

  const calculateEstimate = () => {

    // 1. Collect user input
    const pageCount = parseInt(document.querySelector('input[name="page_count"]').value, 10) || 1;
    const responsiveOption = document.querySelector('select[name="responsive_option"]').value || 'responsive';
    const complexityLevel = document.querySelector('select[name="complexity_level"]').value || 'intermediate';
    const deliverySpeed = document.querySelector('select[name="delivery_speed"]').value || 'standard';

    // Validate page count
    const validatedPageCount = Math.min(Math.max(pageCount, 1), 100);

    // 2. Calculate estimates
    const responsiveFactor = config.responsiveMultipliers[responsiveOption].cost;
    const complexityFactor = config.complexityMultipliers[complexityLevel].cost;
    const speedFactors = config.speedMultipliers[deliverySpeed];

    const estimatedHomePageCost = config.homePagePrice * responsiveFactor * complexityFactor * speedFactors.cost;
    let estimatedInnerPageCost = 0;
    if (validatedPageCount > 1) {
      estimatedInnerPageCost = config.basePrice * (validatedPageCount - 1) * responsiveFactor * complexityFactor * speedFactors.cost;
    }
    const estimatedTotalCost = estimatedHomePageCost + estimatedInnerPageCost;

    const estimatedInnerPageSpeed = config.baseSpeed * (validatedPageCount - 1) * speedFactors.time;
    const estimatedTotalSpeed = config.homePageSpeed + config.testSpeed + estimatedInnerPageSpeed;

    // 3. Styling
    const sliderPin = document.querySelector('.range-slider-value');
    const minValue = 1;
    const maxValue = 100;
    const minPercent = isMobile() ? 3.5 : 1.5;
    const maxPercent = isMobile() ? 96.5 : 98.5;
    const percent = minPercent + ((pageCount - minValue) * (maxPercent - minPercent)) / (maxValue - minValue);
    sliderPin.textContent = pageCount;
    sliderPin.style.display = 'block';
    sliderPin.style.left = `${percent}%`;

    // 4. Update Display
    const costElement = document.querySelector('[data-id="estimated-cost"]');
    const dayElement = document.querySelector('[data-id="estimated-day"]');
    costElement.textContent = Math.round(estimatedTotalCost).toLocaleString();
    dayElement.textContent = Math.round(estimatedTotalSpeed);

    // 5. Update Modal

    const rowCostInnerPage = document.querySelector('table.breakdown-cost tr[data-id="row-inner-page"]');
    const rowSpeedInnerPage = document.querySelector('table.breakdown-speed tr[data-id="row-inner-page"]');

    const colHomePageDetail = document.querySelector('table.breakdown-cost td[data-id="col-home-page-detail"]');
    const colHomePageCost = document.querySelector('table.breakdown-cost td[data-id="col-home-page-cost"]');
    const colCostTotal = document.querySelector('table.breakdown-cost td[data-id="col-total"]');
    const colInnerPageDetail = document.querySelector('table.breakdown-cost td[data-id="col-inner-page-detail"]');
    const colInnerPageCost = document.querySelector('table.breakdown-cost td[data-id="col-inner-page-cost"]');
    const colSpeedTotal = document.querySelector('table.breakdown-speed td[data-id="col-total"]');

    const colHomePageDetail2 = document.querySelector('table.breakdown-speed td[data-id="col-home-page-detail"]');
    const colHomePageSpeed = document.querySelector('table.breakdown-speed td[data-id="col-home-page-speed"]');
    const colInnerPageDetail2 = document.querySelector('table.breakdown-speed td[data-id="col-inner-page-detail"]');
    const colInnerPageSpeed = document.querySelector('table.breakdown-speed td[data-id="col-inner-page-speed"]');

    if (validatedPageCount > 1) {
      rowCostInnerPage.style.display = 'table-row';
      rowSpeedInnerPage.style.display = 'table-row';
    } else {
      rowCostInnerPage.style.display = 'none';
      rowSpeedInnerPage.style.display = 'none';
    }

    const homePageCountText = '1 page';
    const innerPageCountText = `${validatedPageCount - 1} page${validatedPageCount - 1 > 1 ? 's' : ''}`;

    colHomePageDetail.innerHTML = `${homePageCountText}<br>${config.responsiveMultipliers[responsiveOption].name}<br>${config.complexityMultipliers[complexityLevel].name} Level<br>${config.speedMultipliers[deliverySpeed].name} Speed`;
    colHomePageCost.textContent = `$${Math.round(estimatedHomePageCost).toLocaleString()}`;
    colCostTotal.textContent = `$${Math.round(estimatedTotalCost).toLocaleString()}`;
    colInnerPageDetail.innerHTML = `${innerPageCountText}<br>${config.responsiveMultipliers[responsiveOption].name}<br>${config.complexityMultipliers[complexityLevel].name} Level<br>${config.speedMultipliers[deliverySpeed].name} Speed`;
    colInnerPageCost.textContent = `$${Math.round(estimatedInnerPageCost).toLocaleString()}`;
    colSpeedTotal.textContent = `${Math.round(estimatedTotalSpeed)} days`;


    colHomePageDetail2.textContent = homePageCountText;
    colHomePageSpeed.textContent = `${config.homePageSpeed} day${config.homePageSpeed > 1 ? 's' : ''}`;
    colInnerPageDetail2.textContent = innerPageCountText;
    colInnerPageSpeed.textContent = `${Math.round(estimatedInnerPageSpeed)} day${Math.round(estimatedInnerPageSpeed) > 1 ? 's' : ''}`;

    return { cost: estimatedTotalCost, days: estimatedTotalSpeed };
  };

  const setupEventListeners = () => {
    const inputs = document.querySelectorAll('input[name="page_count"], select[name="responsive_option"], select[name="complexity_level"], select[name="delivery_speed"]');
    inputs.forEach(input => {
      input.addEventListener('change', calculateEstimate);
      input.addEventListener('input', calculateEstimate);
    });
  };

  const handleFormSubmit = () => {
    const contactForm = $('#form-contact');
    contactForm.on('submit', function (e) {
      e.preventDefault();

      const name = contactForm.find('[name="name"]').val()?.trim();
      const email = contactForm.find('[name="email"]').val()?.trim();
      const message = contactForm.find('[name="message"]').val()?.trim();

      let isValid = true;
      let errorMessage = '';

      if (!name || name.length <= 0) {
        isValid = false;
        errorMessage += 'Please enter a valid name\n';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        isValid = false;
        errorMessage += 'Please enter a valid email address\n';
      }

      if (!message || message.length <= 0) {
        isValid = false;
        errorMessage += 'Please enter a message\n';
      }

      if (!isValid) {
        alert(errorMessage);
        return;
      }

      const formData = $(this).serialize();
      contactForm.addClass('is-loading');

      $.ajax({
        url: '/api/send-email',
        type: 'POST',
        data: formData,
        success: () => {
          contactForm.hide(0, () => {
            $('.section-top-contact .wrapper').append('<p class="form-message">Message sent successfully!</p>');
            contactForm.remove();
          });
        },
        error: () => {
          alert('Error sending message');
          contactForm.removeClass('is-loading');
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
  });

  window.addEventListener('load', () => {
    handleModal();
    setupEventListeners();
    if (window.location.pathname === '/' || window.location.pathname === '') {
      calculateEstimate();
      handleFormSubmit();
    }


    document.querySelectorAll('.browser-simulator').forEach(resizable => {
      const resizer = resizable.querySelector('.simulator-resizer');
      const isLiquid = resizable.classList.contains('is-liquid');
      let isResizing = false;

      resizer.addEventListener('mousedown', () => {
        isResizing = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        function onMouseMove (event) {
          if (!isResizing) { return; }
          let newWidth = event.clientX - resizable.offsetLeft;
          newWidth = Math.max(320, Math.min(590, newWidth));
          resizable.style.width = `${newWidth}px`;
          if (isLiquid) {
            resizable.style.fontSize = `${100 * (newWidth - 4) / 375}px`;
          }
        }

        function onMouseUp () {
          isResizing = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }
      });
    });

  });
})();
