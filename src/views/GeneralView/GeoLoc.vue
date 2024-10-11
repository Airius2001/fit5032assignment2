<template>
    <div id="app">
      <h1>Map View</h1>
      <div id="search" style="position: absolute; top: 10px; left: 10px; z-index: 1;"></div> <!-- Search bar -->
      <div id="map" style="height: 500px; width: 100%"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
  
  export default {
    name: "App",
    data() {
      return {
        map: null,
      };
    },
    mounted() {
      
      mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyaXVzIiwiYSI6ImNtMjJvZWRlbTA5YTIycXB0cTBodjZ4bngifQ.THt_BKITbJyK_BkHaSjFRQ'; 
      this.map = new mapboxgl.Map({
        container: 'map', 
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [144.9631, -37.8136], //Location of Melbourne center
        zoom: 12, 
      });

      
    new mapboxgl.Marker({ color: '#ff5733', scale: 1.5 })
      .setLngLat([144.9631, -37.8136])
      .setPopup(new mapboxgl.Popup().setText('Melbourne City Center'))
      .addTo(this.map);

    this.map.on('load', () => {
      this.isLoading = false; 
    });
  
      
      this.addSearchFeature();
      
      
      this.addNavigationFeature();
    },
    methods: {
      
      addSearchFeature() {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false, 
          proximity: {
            longitude: -74.0060,
            latitude: 40.7128
          } 
        });
  
        
        document.getElementById('search').appendChild(geocoder.onAdd(this.map));
  
        
        geocoder.on('result', (event) => {
          const coordinates = event.result.geometry.coordinates;
  
          
          this.clearMarkers();
  
          
          new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setText(event.result.place_name)) 
            .addTo(this.map);
  
          
          this.map.flyTo({
            center: coordinates,
            zoom: 14
          });
        });
      },
  
      
      clearMarkers() {
        const markers = document.getElementsByClassName('mapboxgl-marker');
        while (markers[0]) {
          markers[0].parentNode.removeChild(markers[0]);
        }
      },
  
      
      addNavigationFeature() {
        const start = [-74.0060, 40.7128]; 
        const end = [-73.935242, 40.730610];
  
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
  
        fetch(directionsUrl)
          .then(response => response.json())
          .then(data => {
            const route = data.routes[0].geometry;
  
            this.map.addLayer({
              id: 'route',
              type: 'line',
              source: {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: route
                }
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          })
          .catch(error => console.error('Error fetching route:', error));
      }
    }
  };
  </script>
  
  <style>
  #map {
    height: 100vh;
    width: 100%;
  }
  </style>
  