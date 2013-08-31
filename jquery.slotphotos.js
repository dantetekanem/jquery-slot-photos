/*
* SlotPhotos Plugin for jQuery
* Created by Leonardo Pereira (www.imagineware.com.br - contato@leonardopereira.com)
* Free to use
*/

(function($){

	$.fn.slotPhotos = function(options) {
		// Default options
		var settings = $.extend({
			slices: 3,
			photos: [],
			direction: "horizontal", // vertical or horizontal
			time: 3000,
			speed: 500,
			maintainRatio: true // ratio of the image with the frame size
		}, options);

		var frame 	= $(this),
				frameW 	= frame.width(),
				frameH 	= frame.height();
		frame.css('overflow', 'hidden');

		// the frame must have a minimum width and height
		if((frameW == 0 || !frameW) || (frameH == 0 || !frameH))
		{
			alert("SlotPhotos error, the frame must have a minimum width and height.");
			return false;
		}

		// append images
		var appendImages = function(mask)
		{
			for(var k = 0; k < settings.photos.length; ++k)
			{
				var photo = settings.photos[k];
				var img = $('<img />').attr('src', photo).css('float', 'left');

				img.load(function(){
					if(settings.maintainRatio === true)
					{
						var imgW, imgH;
						if(settings.direction == "vertical")
						{
							imgH = frame.height();
							imgW = Math.floor(imgH * $(this).width() / $(this).height());
						}
						else
						{
							imgW = frame.width();
							imgH = Math.floor(imgW * $(this).height() / $(this).width());
						}
						$(this).width(imgW);
						$(this).height(imgH);
					}
				})
				//
				mask.find('.images').append(img);
			}
		}

		// get the sizes
		var mask_w, mask_h, masks = [];
		if(settings.direction == "vertical")
		{
			mask_w = (frameW / settings.slices).toFixed(2);
			mask_h = frameH;
		}
		else if(settings.direction == "horizontal")
		{
			mask_w = frameW;
			mask_h = (frameH / settings.slices).toFixed(2);
		}
		// create the masks
		for(var i = 0; i < settings.slices; ++i)
		{
			var mask, images;
			//
			mask = $('<div />').addClass('mask').attr('rel', 'mask_'+i).width(mask_w).height(mask_h);
			images = $('<div />').addClass('images');
			mask.css({
				float: 'left',
				clear: 'none',
				overflow: 'hidden'
			})

			if(settings.direction == "vertical")
			{
				images.height(mask_h * settings.photos.length);
				images.css('margin-left', -(i*mask_w));
			}
			else
			{
				images.width(mask_w * settings.photos.length);
				images.css('margin-top', -(i*mask_h));
			}

			mask.append(images);
			appendImages(mask, settings.maintainRatio, settings.photos);

			frame.append(mask);
			masks.push(mask);
		}

		// set slide
		var sliderSlots = window.setInterval(function(){
			for(var m = 0; m < frame.find('.mask').length; ++m)
			{
				var mask  = masks[m];
				var pos 	= Math.floor(Math.random()*settings.photos.length);
				var direction;
				//
				if(settings.direction == "vertical")
				{
					direction = { marginTop: -(pos*frame.height()) };
				}
				else
				{
					direction = { marginLeft: -(pos*frame.width()) };
				}
				//
				mask.find('.images').animate(direction, settings.speed);
			}
		}, settings.time);
	}

}(jQuery));