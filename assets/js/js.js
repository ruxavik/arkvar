
var globalProp = {
    windowHeight: $(window).height(),
    currentSectionId: 1,
    isAnimation: false,
    sections: $('.main-section'),
    siteNav: $('.site-nav'),
    currentPosition: 0
};

var allBlocks = $('[data-scroll-block]');
var bodyEl = $('body');


var isSmall = $(window).width() < 768;
var slickExperts;
var slickBlog;

function toggleModalWindowVisibility(el) {

    if ( !$(el).hasClass('close-button') ) {
        globalProp.currentPosition = $(window).scrollTop();
    }

    $('.site-nav').toggleClass('hidden');
    $('body').toggleClass('fixed');
    $('.main-wrapper').toggleClass('blured');

    if ( $(el).hasClass('close-button') ) {
        event.preventDefault();
        $(window).scrollTop(globalProp.currentPosition);
    }
}


$(window).on('scroll', function (event) {
    if ($(window).width() <= '1020') {
        if ($(window).scrollTop() <= 0) {
            $('.site-nav').removeClass('site-nav--scrolled');
        } else {
            $('.site-nav').addClass('site-nav--scrolled');
        }
    }
});

$( window ).resize(function() {
    globalProp.windowHeight = $(window).height();
    $('.site-nav').removeClass('fixed-nav');

    if ($(window).width() >= 768 && isSmall) {
        if(slickExperts.length) {
            slickExperts.off('beforeChange');
            slickExperts[0].slick.unslick();
        }

        if (slickBlog.length) {
            slickBlog.off('beforeChange');
            slickBlog[0].slick.unslick();
        }

        isSmall = false;
    } else if ( $(window).width() < 768 && !isSmall) {
        initExpertsSlick();
        initBlogSlick();


        isSmall = true;
    }

    //    others
});

var navMobileItems = $('.mobile-nav__list');

$('.nav-trigger').on('click touch', function(event) {
    event.preventDefault();
    var isVisible = $('.mobile-nav').hasClass('mobile-nav--showed');
    $('.mobile-nav').toggleClass('mobile-nav--showed');
    toggleModalWindowVisibility(this);

    if (!isVisible) {
        $('.mobile-nav').addClass('animated fadeInLeft');

        if (isSmall) {
            navMobileItems.find('.mobile-nav__link--current').removeClass('mobile-nav__link--current');
            var currentItem = navMobileItems.find('[data-block="' + window.location.hash.split('#')[1] + '"]');
            currentItem.addClass('mobile-nav__link--current');
        }
    }
});


$('.mobile-nav__list').on('click touch', '.mobile-nav__link', function(event) {
    event.preventDefault();
    $('.mobile-nav').removeClass('mobile-nav--showed');
    toggleModalWindowVisibility(this);

    var blockName = $(this).data('block');
    var scrollPosition = $('[data-scroll-block="' + blockName + '"]').offset().top;
    $(window).scrollTop(scrollPosition - 74);
});


function initExpertsSlick() {
    slickExperts = $('.experts-grid-row').slick({
        prevArrow: '.experts-mobile-arrows .clients-carousel-prev',
        nextArrow: '.experts-mobile-arrows .clients-carousel-next'
    });

     slickExperts.on('beforeChange', function (event, slick, cur, next) {
        $('.experts-mobile-arrows .clients-carousel-number--selected').text(next + 1);
    });
}

function initBlogSlick() {
    slickBlog = $('.blog-row').slick({
        prevArrow: '.blog-mobile-arrows .clients-carousel-prev',
        nextArrow: '.blog-mobile-arrows .clients-carousel-next'
    });

    slickBlog.on('beforeChange', function (event, slick, cur, next) {
        $('.blog-mobile-arrows .clients-carousel-number--selected').text(next + 1);
    });
}

function initClientsSlick() {
    $('.clients-carousel-wrapper .clients-carousel').slick({
    prevArrow: '.clients-carousel-wrapper .clients-carousel-prev',
    nextArrow: '.clients-carousel-wrapper .clients-carousel-next'
    });

    var clientsMobileSlick = $('.clients-carousel-mobile .clients-carousel').slick({
        prevArrow: '.clients-mobile-arrows .clients-carousel-prev',
        nextArrow: '.clients-mobile-arrows .clients-carousel-next'
    });

    clientsMobileSlick.on('beforeChange', function (event, slick, cur, next) {
        $('.clients-mobile-arrows .clients-carousel-number--selected').text(next + 1);
    });
}

if (isSmall) {
    initExpertsSlick();
    initBlogSlick();
}

initClientsSlick();

function checkVisible(elm, threshold, mode) {
  threshold = threshold || 0;
  mode = mode || 'visible';

  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  var above = rect.bottom - threshold < 0;
  var below = rect.top - viewHeight + threshold >= 0;

  return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}


var scrollHandler = function () {
    if (bodyEl.hasClass('fixed')) return;
    var el = [].find.call(allBlocks, function(item) {
        return checkVisible(item, isSmall ? 75 : 0);
    });

    if (document.body.scrollTop < 100) {
        window.location.hash = '';
        return;
    }
    window.location.hash = el ? $(el).attr('data-scroll-block') : '';
};

$(document).on('scroll', $.throttle(400, true, scrollHandler));