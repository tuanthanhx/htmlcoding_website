(function () {

  var app = app || {};

  var spBreak = 767.98;

  app.init = function () {

    gsap.registerPlugin(ScrollTrigger);

    app.detectBrowsers();
    app.detectView();
    app.tabletViewport();
    app.toggleMobileMenu();
    app.smoothScroll();
    app.customScrollbar();
    app.animateFade();
    app.animateValue();
    app.fullpageFeatures();
    app.animateFeatureMobile();

  };

  app.isMobile = function () {
    return window.matchMedia('(max-width: ' + spBreak + 'px)').matches;
  };

  app.detectBrowsers = function () {
    var html = $('html');
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('mac') >= 0) {
      html.addClass('is-mac');
    }
    if (ua.indexOf('safari') != -1) {
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

  app.detectView = function () {
    window.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaY) < 10) {
        window.isScrollingBy = 'trackpad';
      } else {
        window.isScrollingBy = 'others';
      }
    });
    var currentView = window.matchMedia('(max-width: 767.98px)').matches ? 'mobile' : 'desktop';
    $(window).on('resize', function () {
      var newView = window.matchMedia('(max-width: 767.98px)').matches ? 'mobile' : 'desktop';
      if (currentView !== newView) {
        location.reload();
      }
    });
  };

  app.tabletViewport = function () {

    var viewport = document.getElementById('viewport');

    var viewportSet = function () {
      var portrait = window.matchMedia('(orientation: portrait)').matches;
      if (screen.width < 375 && portrait) {
        viewport.setAttribute('content', 'width=375, user-scalable=0');
      } else if (screen.width >= 768 && screen.width <= 1199 || screen.width < 768 && screen.height >= 768 && !portrait) {
        viewport.setAttribute('content', 'width=1600, user-scalable=0');
        var ua = navigator.userAgent.toLowerCase();
        if ((/macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) || (ua.match(/(iphone|ipod|ipad)/) && !app.isMobile()) || (ua.indexOf('android') > -1 && !app.isMobile())) {
          $('html').addClass('is-tablet');
        }
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0');
        $('html').removeClass('is-tablet');
      }
    };

    viewportSet();

    window.onload = function () {
      viewportSet();
    };

    window.onresize = function () {
      viewportSet();
    };

  };

  app.toggleMobileMenu = function () {

    $('.js-toggle-menu').on('click', function () {
      $(this).toggleClass('is-active');
      if ($(this).hasClass('is-active')) {
        app.disableScroll(true);
        $('.js-navigation').stop().fadeIn();
      } else {
        $('.js-navigation').stop().fadeOut();
        app.disableScroll(false);
      }
      return false;
    });

  };

  app.smoothScroll = function () {
    var anchors = $('a[href*="#"]:not([href="#"])');
    var headerHeight = 0;
    var speed = 500;

    var triggerScroll = function (context) {
      var href = typeof context == 'string' ? context : '#' + $(context).attr('href').split('#')[1];
      if ($(context).hasClass('no-scroll')) return;
      if (!$(href).length) return;
      var position = $(href).offset().top - headerHeight;
      $('body, html').animate({ scrollTop: position }, speed, 'swing');
      return false;
    };

    setTimeout(function () {
      scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);

    if (window.location.hash) {
      scroll(0, 0);
      var timeout = 500;
      if (navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1) {
        timeout = 0;
      }
      setTimeout(function () {
        triggerScroll(window.location.hash);
      }, timeout);
    }

    anchors.on('click', function () {
      return triggerScroll(this);
    });
  };

  app.customScrollbar = function () {

    if (app.isMobile()) return;

    var tlCategory = new TimelineMax({ paused: true });
    gsap.utils.toArray('.page-section-category .list-category li').forEach(function (valueItem, index) {
      tlCategory.fromTo(valueItem, 1, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0,
        ease: Power1.easeOut,
      }, index * 0.25);
    });

    var tlMethod = new TimelineMax({ paused: true });
    tlMethod.fromTo('.method-title', 1, {
      opacity: 0,
      y: 100
    }, {
      opacity: 1,
      y: 0,
      ease: Power1.easeOut,
    }, 0);
    gsap.utils.toArray('.page-section-method .col-logo').forEach(function (valueItem, index) {
      tlMethod.fromTo(valueItem, 1, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0,
        ease: Power1.easeOut,
      }, 0.25 + index * 0.25);
    });
    gsap.utils.toArray('.page-section-method .col-title').forEach(function (valueItem, index) {
      tlMethod.fromTo(valueItem, 1, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0,
        ease: Power1.easeOut,
      }, 0.5 + index * 0.25);
    });
    gsap.utils.toArray('.page-section-method .list-method').forEach(function (valueItem, index) {
      tlMethod.fromTo(valueItem, 1, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0,
        ease: Power1.easeOut,
      }, 0.75 + index * 0.25);
    });

    $('.panel-page').mCustomScrollbar({
      callbacks: {
        whileScrolling: function () {
          if (window.offsetCategory && this.mcs.top - window.innerHeight / 3 <= -window.offsetCategory) {
            tlCategory.play();
          }
          if (window.offsetMethod && this.mcs.top - window.innerHeight / 3 <= -window.offsetMethod) {
            tlMethod.play();
          }
        }
      }
    });
  };

  app.animateFade = function () {

    gsap.from('header .wrapper', {
      opacity: 0,
      duration: 2,
      delay: 1
    });

    var tlKeyVisual = new TimelineMax({
      delay: 1.5
    });
    tlKeyVisual.from('.keyvisual-title', 1.5, {
      opacity: 0,
      y: 100
    }, 0);
    tlKeyVisual.from('.keyvisual-text', 1.5, {
      opacity: 0,
      y: 100
    }, 0.25);
    tlKeyVisual.from('.keyvisual-button', 1.5, {
      opacity: 0,
      top: 100
    }, 0.5);

    if (!app.isMobile()) return;

    var tlFeatureHeading = new TimelineMax({ paused: true });
    var tlFeatureHeadingDelay = 0.5;
    tlFeatureHeading.fromTo('.feature-title-mobile .feature-title', 1, {
      opacity: 0,
      y: 100
    }, {
      opacity: 1,
      y: 0,
      ease: Power1.easeOut,
    }, tlFeatureHeadingDelay + 0);

    tlFeatureHeading.fromTo('.feature-title-mobile .feature-description', 1, {
      opacity: 0,
      y: 100
    }, {
      opacity: 1,
      y: 0,
      ease: Power1.easeOut,
    }, tlFeatureHeadingDelay + 0.5);

    ScrollTrigger.create({
      trigger: '.feature-title-mobile',
      start: 'top 65%',
      onEnter: function () {
        tlFeatureHeading.play();
      },
    });

  };

  app.animateValue = function () {
    if (app.isMobile()) return;
    jQuery.fn.reverse = [].reverse;
    gsap.utils.toArray('.value-item').forEach(function (item) {
      var roundedBG = new TimelineMax({ paused: true });
      $(item)
        .find('.bg-rounded circle')
        .reverse()
        .each(function (index) {
          roundedBG.to($(this), 0.02, { ease: Circ.easeOut, opacity: 1 }, index * 0.02);
        });
      $(item).hover(function () {
        roundedBG.play();
      }, function () {
        roundedBG.reverse();
      });
    });

  };

  app.animateFeatureMobile = function () {
    if (!app.isMobile()) return;
    $('.panel-button').on('click', function () {
      if ($(this).attr('href') !== '#page-education') return;
      app.disableScroll(true, '.panel-page');
      $('.panel-modals.panel-02').find('.panel-page').css('opacity', 1).fadeIn();
      $('.js-close-panel').fadeIn(function () {
        $('.panel-modals.panel-02').find('.page-section-cover video').get(0).play();
      });
      return false;
    });
    $('.js-close-panel').on('click', function () {
      $('.js-close-panel').fadeOut();
      $('.panel-page').fadeOut(function () {
        app.disableScroll(false);
        $('.panel-modals.panel-02').find('.page-section-cover video').get(0).load();
      });
      return false;
    });
  };

  app.fullpageFeatures = function () {

    gsap.set('.panel-object .object', {
      y: 100
    });
    gsap.set('.panel-content .panel-title', {
      x: -500,
      y: 300,
      opacity: 0
    });
    gsap.set('.panel-content .panel-description', {
      x: -500,
      y: 300,
      opacity: 0
    });
    gsap.set('.panel-number .number', {
      y: 200,
      opacity: 0
    });
    gsap.set('.panel-button', {
      x: 300,
      y: 300,
      opacity: 0
    });

    var instances = [];
    var instancesOpen = [];
    gsap.utils.toArray('.panel').forEach(function (panel) {

      var tlPanel = new TimelineMax({ paused: true });
      tlPanel.to(panel.querySelector('.card'), 1, {
        rotateX: 55,
        duration: 1
      }, 0);
      tlPanel.to(panel.querySelector('.card img'), 1, {
        rotateY: -30,
        duration: 1
      }, 0);
      tlPanel.to(panel.querySelector('.object'), 1, {
        y: 0,
        rotate: 3.5,
        duration: 1
      }, 0);
      tlPanel.to(panel.querySelector('.panel-title'), 1, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1
      }, 0);
      tlPanel.to(panel.querySelector('.panel-description'), 1, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1
      }, 0);
      tlPanel.to(panel.querySelector('.number'), 1, {
        y: 0,
        opacity: 1,
        duration: 1
      }, 0);
      tlPanel.to(panel.querySelector('.panel-button'), 1, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1
      }, 0);
      instances.push(tlPanel);

      var tlPanelOpen = new TimelineMax({ paused: true });
      tlPanelOpen.to(panel.querySelector('.panel-button'), 0.5, {
        rotate: -45,
        x: 100
      }, 0);
      tlPanelOpen.to(panel.querySelector('.panel-button .bubble'), 0.5, {
        width: '100%',
        height: '100%',
        background: '#00B1FF',
        left: 0
      }, 0);
      tlPanelOpen.to(panel.querySelector('.panel-card'), 1, {
        width: 918,
        height: 516
      }, 0);
      tlPanelOpen.to(panel.querySelector('.card'), 1, {
        rotateX: 0
      }, 0);
      tlPanelOpen.to(panel.querySelector('.card img'), 1, {
        rotateY: 0
      }, 0);
      tlPanelOpen.to(panel.querySelector('.object'), 1, {
        x: -15,
        y: 190,
        rotate: 0,
        scale: .77,
      }, 0);
      tlPanelOpen.to(panel.querySelector('.panel-content'), 1, {
        x: -220,
        y: 270
      }, 0);
      tlPanelOpen.to(panel.querySelector('.number'), 1, {
        y: -400
      }, 0);
      tlPanelOpen.to(panel.querySelector('.object'), 0, {
        opacity: 0
      }, 1);
      tlPanelOpen.to(panel.querySelector('.panel-button'), 0.5, {
        rotate: 90,
        x: 500,
        opacity: 0
      }, 1);
      tlPanelOpen.to(panel.querySelector('.number'), 1, {
        x: -1000,
        opacity: 0
      }, 1);
      tlPanelOpen.to(panel.querySelector('.panel-title'), 0.75, {
        x: -80,
        y: -550,
        opacity: 0,
        ease: Linear.easeNone
      }, 1);
      tlPanelOpen.to(panel.querySelector('.panel-description'), 1, {
        y: 800,
        opacity: 0
      }, 1);
      tlPanelOpen.to(panel.querySelector('.panel-number'), 1, {
        opacity: 0
      }, 1);
      tlPanelOpen.to('.feature-heading', 1, {
        opacity: 0
      }, 1);
      tlPanelOpen.to('.feature-line', 1, {
        opacity: 0
      }, 1);
      tlPanelOpen.to(panel.querySelector('.panel-inner'), 1, {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        transform: 'none'
      }, 1);
      tlPanelOpen.to(panel.querySelector('.panel-card'), 1, {
        width: '100vw',
        height: '100vh',
        onComplete: function () {
          setTimeout(function () {
            tlPanelOpen.progress(0).pause();
            $('.js-close-panel').fadeIn();
          }, 1000);
        }
      }, 1);
      instancesOpen.push(tlPanelOpen);

    });

    var tlEducation = new TimelineMax({ paused: true });
    var panelEducation = document.querySelector('.panel-modals.panel-02');
    if (!app.isMobile()) {
      tlEducation.to(panelEducation.querySelector('.panel-page'), 0, {
        display: 'block'
      }, 1);
      tlEducation.to(panelEducation.querySelector('.panel-page'), 2, {
        opacity: 1
      }, 1);
      tlEducation.from(panelEducation.querySelector('.panel-page .cover-education-title'), 1, {
        rotate: -360
      }, 1);
      tlEducation.from(panelEducation.querySelector('.panel-page .cover-education-map'), 1, {
        scale: 4
      }, 1);
      tlEducation.to(panelEducation.querySelector('.panel-page .page-section-cover video'), 0, {
        opacity: 1,
        onComplete: function () {
          panelEducation.querySelector('.panel-page .page-section-cover video').play();
          window.offsetCategory = $('.page-section-category').offset().top;
          window.offsetMethod = $('.page-section-method').offset().top;
        }
      }, 2);
    }

    var tlValue = new TimelineMax({ paused: true });
    var tlValueDelay = app.isMobile() ? 0 : 0.5;
    tlValue.fromTo('.section-top-value .sec-title', 1, {
      opacity: 0,
      y: 100
    }, {
      opacity: 1,
      y: 0,
      ease: Power1.easeOut,
    }, tlValueDelay + 0);
    gsap.utils.toArray('.section-top-value .list-value .value-item').forEach(function (valueItem, index) {
      tlValue.fromTo(valueItem, 1, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0,
        ease: Power1.easeOut,
      }, tlValueDelay + 0.5 + index * 0.25);
    });

    var tlFooter = new TimelineMax({ paused: true });
    var tlFooterDelay = app.isMobile() ? 0 : 0.5;
    tlFooter.fromTo('footer .footer-content', 1, {
      opacity: 0,
      y: 100
    }, {
      opacity: 1,
      y: 0,
      ease: Power1.easeOut,
    }, tlFooterDelay + 0);
    tlFooter.fromTo('footer .footer-sns', 1, {
      opacity: 0,
      y: 100
    }, {
      opacity: 1,
      y: 0,
      ease: Power1.easeOut,
    }, tlFooterDelay + 0.5);

    if (app.isMobile()) {
      gsap.utils.toArray('.panel').forEach(function (panel) {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 65%',
          end: 'center top',
          onEnter: function () {
            var panelIndex = parseInt($(panel).attr('data-index'), 10);
            instances.forEach(function (tlPanel, index) {
              if (index === panelIndex) {
                tlPanel.play();
              }
            });
          },
        });
      });

      ScrollTrigger.create({
        trigger: '.section-top-value',
        start: 'top 65%',
        onEnter: function () {
          tlValue.play();
        },
      });

      ScrollTrigger.create({
        trigger: 'footer',
        start: 'top 65%',
        onEnter: function () {
          tlFooter.play();
        },
      });

      return;
    }

    $('#fullpage').fullpage({
      scrollOverflow: false,
      autoScrolling: true,
      fitToSection: false,
      scrollDelay: 1000,
      scrollingSpeed: 1300,
      credits: {enabled: false},
      licenseKey: '2L4L9-ZLJ88-KW416-RMJ4J-RFKJN',
      beforeLeave: function (origin, destination) {
        if ($(destination.item).is('.section-top-wrap')) {
          fullpage_api.setAllowScrolling(false);
          setTimeout(function () {
            fullpage_api.setAllowScrolling(true);
          }, window.isScrollingBy == 'trackpad' ? 2000 : 1000);
        }
        if ($(destination.item).is('.section-top-value')) {
          fullpage_api.setAllowScrolling(false);
          setTimeout(function () {
            fullpage_api.setAllowScrolling(true);
          }, window.isScrollingBy == 'trackpad' ? 2000 : 1000);
        }
      },
      onLeave: function (origin, destination) {
        if ($(destination.item).is('.section-top-keyvisual')) {
          $(destination.item).find('video').get(0).play();
        }
        if ($(destination.item).is('.section-top-wrap')) {
          tlMission.play();
          tlAbout.play();
        }
        if ($(destination.item).is('.section-top-value')) {
          tlValue.play();
          $(destination.item).find('video').get(0).play();
        }
        if ($(destination.item).is('.section-top-generation')) {
          tlGeneration.play();
        }
        if ($(destination.item).is('footer')) {
          tlFooter.play();
        }
        if ($(destination.item).is('.section-top-generation') || $(destination.item).is('footer')) {
          $('header').addClass('is-dark');
        } else {
          $('header').removeClass('is-dark');
        }
        if ($(destination.item).hasClass('panel')) {
          var panelIndex = parseInt($(destination.item).attr('data-index'), 10);
          instances.forEach(function (tlPanel, index) {
            if (index === panelIndex) {
              tlPanel.play();
            } else {
              tlPanel.reverse();
            }
          });
        } else {
          instances[0].reverse();
          instances[instances.length - 1].reverse();
          if (app.isMobile()) return;
          $('.panel-heading').fadeOut();
        }
      },
      afterLoad: function (origin, destination) {
        if (!window.isScrollingBy || window.isScrollingBy === 'trackpad') {
          fullpage_api.setScrollingSpeed(1300);
        } else {
          fullpage_api.setScrollingSpeed(700);
        }
        if ($(destination.item).hasClass('panel')) {
          if (app.isMobile()) return;
          $('.panel-heading').css('visibility', 'visible').fadeIn();
        }
      },

    });

    $('.panel-button').on('click', function () {
      if (app.isMobile()) return;
      var button = $(this);
      if (button.attr('href') === '#page-education') {
        $.fn.fullpage.setAllowScrolling(false);
        instancesOpen[1].play();
        tlEducation.play();
      }
      return false;
    });

    var closePanel = function () {
      if (app.isMobile()) return;
      window.isPanelOpen = false;
      $('.js-close-panel').fadeOut();
      $('.panel-page').each(function () {
        var panel = $(this);
        if (panel.is(':visible')) {
          panel.fadeOut(500, function () {
            if (panel.closest('.panel-02').length) {
              panelEducation.querySelector('.panel-page .page-section-cover video').load();
              tlEducation.progress(0).pause();
              $.fn.fullpage.setAllowScrolling(true);
            }
          });
        }
      });
    };

    $('.js-close-panel').on('click', function () {
      closePanel();
      return false;
    });

  };

  app.disableScroll = (function () {
    var _selector = false,
      _element = false,
      _clientY;
    if (!Element.prototype.matches)
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    if (!Element.prototype.closest)
      Element.prototype.closest = function (s) {
        var ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return el;
      };
    var preventBodyScroll = function (event) {
      if (_element === false || !event.target.closest(_selector)) {
        event.preventDefault();
      }
    };
    var captureClientY = function (event) {
      if (event.targetTouches.length === 1) {
        _clientY = event.targetTouches[0].clientY;
      }
    };
    var preventOverscroll = function (event) {
      if (event.targetTouches.length !== 1) {
        return;
      }
      var clientY = event.targetTouches[0].clientY - _clientY;
      if (_element.scrollTop === 0 && clientY > 0) {
        event.preventDefault();
      }
      if (
        _element.scrollHeight - _element.scrollTop <= _element.clientHeight &&
        clientY < 0
      ) {
        event.preventDefault();
      }
    };
    return function (allow, selector) {
      _selector = selector;
      _element = document.querySelector(selector);
      if (allow === true) {
        document.querySelector('html').style['overflow'] = 'hidden';
        if (_element !== null) {
          _element.addEventListener('touchstart', captureClientY, false);
          _element.addEventListener('touchmove', preventOverscroll, { passive: false });
        }
        document.body.addEventListener('touchmove', preventBodyScroll, { passive: false });
      } else {
        document.querySelector('html').style['overflow'] = '';
        document.querySelector('html').removeAttribute('style');
        if (_element !== null) {
          _element.removeEventListener('touchstart', captureClientY, false);
          _element.removeEventListener('touchmove', preventOverscroll, { passive: false });
        }
        document.body.removeEventListener('touchmove', preventBodyScroll, { passive: false });
      }
    };
  })();

  $(function () {

    app.init();

  });

})();
