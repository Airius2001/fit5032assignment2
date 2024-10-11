<template>
    <div>
      <div id="map" style="height: 500px; width: 100%"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  
  export default {
    name: "MapboxMap",
    data() {
      return {
        map: null,
        markers: [],
      };
    },
    mounted() {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyaXVzIiwiYSI6ImNtMjJvZWRlbTA5YTIycXB0cTBodjZ4bngifQ.THt_BKITbJyK_BkHaSjFRQ';
  
      
      this.map = new mapboxgl.Map({
        container: 'map', 
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [-74.0060, 40.7128], 
        zoom: 12, 
      });
  
      this.addMapFeatures();
    },
    methods: {
      addMapFeatures() {
        // Search function
        this.addSearchFeature();
  
        // guide function
        this.addNavigationFeature();
      },
  
      // Search function
      addSearchFeature() {
        const query = 'restaurant';
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=-74.0060,40.7128&access_token=${mapboxgl.accessToken}`;
  
        fetch(url)
          .then(response => response.json())
          .then(data => {
            data.features.forEach(feature => {
              
              const marker = new mapboxgl.Marker()
                .setLngLat(feature.geometry.coordinates)
                .setPopup(new mapboxgl.Popup().setText(feature.place_name)) 
                .addTo(this.map);
              this.markers.push(marker);
            });
          })
          .catch(error => console.error('Error fetching POI:', error));
      },
  
      // Guide
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
  