function initialize() {
  cyprusMap();
}

var map,
    marker,
    markerArray = [];

function cyprusMap() {

  if (document.documentElement.clientWidth < 600) {
    var map = new google.maps.Map(document.getElementById('cyprus-map'), {
        center: new google.maps.LatLng(34.907479, 32.726683),
        zoom: 9,
        mapTypeControl: false,
        scrollwheel: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {'featureType': 'administrative.neighborhood', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'landscape', 'stylers': [{'saturation': '-70'}, {'lightness':'60'}]},
          {'featureType': 'landscape.natural', 'elementType': 'labels', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'poi.business', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'road', 'stylers': [{'weight': '1'}]},
          {'featureType': 'road', 'elementType': 'geometry.stroke', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road', 'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road.local', 'elementType': 'labels.text', 'stylers': [{'color': '#d5d5d5'}]},
          {'featureType': 'road.local', 'elementType': 'labels.text.stroke', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit.station.airport', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#38a9e0'}, {'lightness':'60'}]}
        ]
    });
  } else if (document.documentElement.clientWidth < 980) {
    var map = new google.maps.Map(document.getElementById('cyprus-map'), {
        center: new google.maps.LatLng(34.907479, 32.676683),
        zoom: 10,
        mapTypeControl: false,
        scrollwheel: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {'featureType': 'administrative.neighborhood', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'landscape', 'stylers': [{'saturation': '-70'}, {'lightness':'60'}]},
          {'featureType': 'landscape.natural', 'elementType': 'labels', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'poi.business', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'road', 'stylers': [{'weight': '1'}]},
          {'featureType': 'road', 'elementType': 'geometry.stroke', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road', 'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road.local', 'elementType': 'labels.text', 'stylers': [{'color': '#d5d5d5'}]},
          {'featureType': 'road.local', 'elementType': 'labels.text.stroke', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit.station.airport', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#38a9e0'}, {'lightness':'60'}]}
        ]
    });
  } else {
    var map = new google.maps.Map(document.getElementById('cyprus-map'), {
        center: new google.maps.LatLng(34.9525147, 32.7525704),
        zoom: 10,
        mapTypeControl: false,
        scrollwheel: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {'featureType': 'administrative.neighborhood', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'landscape', 'stylers': [{'saturation': '-70'}, {'lightness':'60'}]},
          {'featureType': 'landscape.natural', 'elementType': 'labels', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'poi.business', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'road', 'stylers': [{'weight': '1'}]},
          {'featureType': 'road', 'elementType': 'geometry.stroke', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road', 'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road.local', 'elementType': 'labels.text', 'stylers': [{'color': '#d5d5d5'}]},
          {'featureType': 'road.local', 'elementType': 'labels.text.stroke', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit.station.airport', 'stylers': [{'visibility': 'on'}]},
          {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#38a9e0'}, {'lightness':'60'}]}
        ]
    });
  }

  var infoWindow = new google.maps.InfoWindow({
      maxWidth: 250
  });

  downloadUrl('[[~[[BabelTranslation? &resourceId=`10`]]]]', function(data) {
    var xml = data.responseXML;
    var markers = xml.documentElement.getElementsByTagName('marker');
    var selectedMarker;
    var hoveredMarker;
    var iconMarker;
    Array.prototype.forEach.call(markers, function(markerElem) {
      var objectId = markerElem.getAttribute('id');
      var title = markerElem.getAttribute('title');
      var price = markerElem.getAttribute('price');
      var link = markerElem.getAttribute('link');
      var img = markerElem.getAttribute('img');
      var type = markerElem.getAttribute('type');
      var lat = markerElem.getAttribute('lat');
      var lng = markerElem.getAttribute('lng')
      var point = new google.maps.LatLng(
          parseFloat(markerElem.getAttribute('lat')),
          parseFloat(markerElem.getAttribute('lng'))
      );

      var infowincontent = document.createElement('div');
      infowincontent.className = 'map-info-window';

      var imgBlock = document.createElement('div');
      imgBlock.className = 'map-info-window__img';
      infowincontent.appendChild(imgBlock);

      var thumb = document.createElement('img');
      thumb.setAttribute('src',img);
      thumb.setAttribute('alt',title);
      imgBlock.appendChild(thumb);

      var favBlock = document.createElement('div');
      favBlock.className = 'catalog__thumb-fav';
      imgBlock.appendChild(favBlock);

      var favLink = document.createElement('a');
      favLink.className = 'msfavorites';
      favLink.setAttribute('data-click','');
      favLink.setAttribute('data-data-id',objectId);
      favLink.setAttribute('data-data-list','default');
      favBlock.appendChild(favLink);

      var favIcon = document.createElement('i');
      favIcon.className = 'icon-fav-catalog';
      favLink.appendChild(favIcon);

      var titleBlock = document.createElement('div');
      titleBlock.className = 'map-info-window__title';
      infowincontent.appendChild(titleBlock);

      var titleLink = document.createElement('a');
      titleLink.setAttribute('href',link);
      titleLink.textContent = title;
      titleBlock.appendChild(titleLink);

      var priceblock = document.createElement('div');
      priceblock.className = 'map-info-window__price';
      infowincontent.appendChild(priceblock);

      var priceText = document.createElement('span');
      priceText.textContent = price;
      priceblock.appendChild(priceText);

      var icon = {
        url: '/tpl/img/iconMapSimilar.svg',
        scaledSize: new google.maps.Size(34, 50)
      };

      var activeIcon = {
        url: '/tpl/img/iconMapSimilarActive.svg',
        scaledSize: new google.maps.Size(34, 50)
      };

      var focusIcon = {
        url: '/tpl/img/iconMapSimilarFocus.svg',
        scaledSize: new google.maps.Size(34, 50)
      };

      var marker = new google.maps.Marker({
        map: map,
        position: point,
        icon: icon,
        zIndex: 1,
        title: lng
      });

      $('.catalog').on({
        mouseenter: function() {
          var itemLat = $(this).data('lat');
          var itemLng = $(this).data('lng');
          var merkerLat = marker.getPosition().lat();
          var merkerLng = marker.getPosition().lng();
          var latDif = Math.abs(itemLat - merkerLat);
          var lngDif = Math.abs(itemLng - merkerLng);

          if (lngDif <= 0.000001 && lngDif <= 0.000001) {
            iconMarker = marker.getIcon();
            marker.setIcon(focusIcon);
            hoveredMarker = marker;
          }
        },
        mouseleave: function() {
          if (hoveredMarker) {
            hoveredMarker.setIcon(iconMarker);
          }
        }
      }, '.catalog__item');

      marker.addListener('click', function() {
        if (selectedMarker) {
          selectedMarker.setIcon(icon);
        }

        marker.setIcon(activeIcon);
        selectedMarker = marker;

        if ($('.current-object').length === 0) {
          $('#cyprus-map').after('<div class="catalog current-object" />');
        }

        var data = {
                     action:'pdoResources',
                     parents:[[BabelTranslation? &resourceId=`25`]],
                     resources: objectId,
                     tpl:'tpl.mapObjectsItem',
                     includeTVs: 'objectStatus,objectCity,objectArea,objectPriceMin,objectAreaBuildingMin,objectAreaBuildingMax,objectRoomsBed'
                   };

        $.post('/ajax/', data, function(data) {
          $('.current-object').empty().prepend(data).addClass('active');
          $('.current-object').append('<span class="desktop-view btn current-object__close"><i class="icon-catalog-filters-left"></i>К списку объектов</span><div class="mobile-view current-object__close"></div>');
          $('.fotorama_catalog').fotorama();
          $('.fotorama_catalog')
            .on('fotorama:ready', function(e, fotorama, extra) {
              if ($(window).width() < 980) {
                fotorama.setOptions({width: '100%', ratio: '16/10', fit: 'cover', nav: false, click: false, swipe: true, loop: true});
              } else {
                fotorama.setOptions({width: '100%', ratio: '16/10', fit: 'cover', nav: false, click: false, swipe: false, loop: true});

                var link = $(this).closest('.catalog__item').data('link');
                $(this).find('.fotorama__stage__shaft').wrap('<a href="' + link + '" />');
              }

              if ($(window).width() >= 1200) {
                $('.fotorama__wrap').addClass('fotorama__wrap--no-controls');
              }

              if (fotorama.size >= 2) {
                $(this).find('.fotorama__arr--next').after('<div class="fotorama__slide-number">' + (fotorama.activeIndex + 1) + ' / ' + fotorama.size + '</div>');
              }
            })
            .on('fotorama:show', function(e, fotorama) {
              $(this).find('.fotorama__slide-number').text((fotorama.activeIndex + 1) + ' / ' + fotorama.size);
            });
        })
      });

      $(document.body).on('click', '.current-object__close', function() {
        $('.current-object').removeClass('active');

        setTimeout(function() { 
          $('.current-object').remove();
          selectedMarker.setIcon(icon);
        }, 400);
      });

      markerArray.push(marker);
    });


  });
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}

function doNothing() {}
