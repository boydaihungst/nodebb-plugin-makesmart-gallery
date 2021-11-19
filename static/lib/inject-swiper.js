'use strict';

$(window).on('action:ajaxify.end', function (data) {
  require(['swiper'], function (Swiper) {
    var swiper = new Swiper('.makesmart-image-gallery', {
      autoHeight: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  });
});
