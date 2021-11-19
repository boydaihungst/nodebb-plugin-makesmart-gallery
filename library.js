'use strict';

const cheerio = require('cheerio');

const plugin = {};

plugin.parse = function (data, callback) {
  if (!data) callback(null, data);
  let postHTML = data;
  if (data.postData && data.postData.content) {
    postHTML = data.postData.content;
  } else if (data.userData && data.userData.signature) {
    postHTML = data.userData.signature;
  }
  // cheerio >< null, false to not add <html> overhead
  var $ = cheerio.load(postHTML, null, false);

  $('p').each(function () {
    const elm = this;
    var isImageGallery = containImageGallery($(this).text());

    if (isImageGallery) {
      var galleryParagraph = $(this);
      var imageSrcs = [];
      var imageAlt = [];

      galleryParagraph.find('img').each(function () {
        imageSrcs.push($(this).attr('src'));
        imageAlt.push($(this).attr('alt'));
      });

      if (imageSrcs.length != 0) {
        var index = 0;
        galleryParagraph.html(
          '<div class="swiper-container makesmart-image-gallery"><div class="swiper-wrapper" style="padding-bottom: 40px;"></div><div class="swiper-pagination"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>',
        );
        var collectionContainer = $(this).find('div.swiper-wrapper');

        imageSrcs.forEach(function (src) {
          collectionContainer.append(
            '<div class="swiper-slide makesmart-image-gallery-image">' +
              '<img src="' +
              src +
              '" alt="' +
              imageAlt[index] +
              '" class="img-responsive img-markdown" style="display: block; margin-left: auto; margin-right: auto; -webkit-box-shadow: 0px 19px 24px -15px rgba(0,0,0,0.75); -moz-box-shadow: 0px 19px 24px -15px rgba(0,0,0,0.75); box-shadow: 0px 19px 24px -15px rgba(0,0,0,0.75);">' +
              '</div>',
          );
          index++;
        });
      }

      /*
				imageSrcs.forEach(function(src){
					galleryParagraph.append(baseUrl + src);
				})
			*/
    }
  });
  const parsedContent = $.html();
  if ('string' === typeof data) {
    data = parsedContent;
  } else if (data.postData && data.postData.content) {
    data.postData.content = parsedContent;
  } else if (data.userData && data.userData.signature) {
    data.userData.signature = parsedContent;
  }
  callback(null, data);
};

module.exports = plugin;

function containImageGallery(text) {
  var isImageGallery = text.includes('[[gallery]]');

  return isImageGallery;
}
