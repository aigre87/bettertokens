function init() {
	if (!google) return;

	$('.contact-map').each(function (index, Element) {
		let coords = $(Element).text().split(',');
		if (coords.length !== 3) return $(this).display = 'none';

		let latlng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));

		let mapOptions = {
			zoom:               parseFloat(coords[2]),
			center:             latlng,
			mapTypeId:          google.maps.MapTypeId.ROADMAP,
			disableDefaultUI:   false,
			mapTypeControl:     false,
			zoomControl:        false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},

			scrollwheel: false,
			styles:      require('./map.json')
		};

		let map = new google.maps.Map(Element, mapOptions);
		new google.maps.Marker({
			position: latlng,
			map:      map,
			icon:     '/images/map-marker.png'
		});
	});
}

module.exports = {init};