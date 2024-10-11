<template>
    <div id="app">
      <h1>Map View</h1>
      <div id="search-container">
        <div id="search"></div> <!-- Search bar under the title -->
      </div>
      <div id="map-container">
        <div id="map"></div>
        <button id="reset-btn" @click="resetMap">Reset Map</button> <!-- Reset button -->
      </div>
      <div v-if="isLoading" class="loader"></div> <!-- Loader -->
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
        isLoading: true, // Add loading state
      };
    },
    mounted() {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyaXVzIiwiYSI6ImNtMjJvZWRlbTA5YTIycXB0cTBodjZ4bngifQ.THt_BKITbJyK_BkHaSjFRQ';
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [144.9631, -37.8136], 
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
      this.addZoomControl();
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
                'line-width': 4,
                'line-opacity': 0.8
              }
            });
          })
          .catch(error => console.error('Error fetching route:', error));
      },
      addZoomControl() {
        const zoomInButton = document.createElement('button');
        zoomInButton.className = 'zoom-button';
        zoomInButton.innerHTML = '<span>+</span><div class="zoom-label">Zoom In</div>';
        
        const zoomOutButton = document.createElement('button');
        zoomOutButton.className = 'zoom-button';
        zoomOutButton.innerHTML = '<span>-</span><div class="zoom-label">Zoom Out</div>';
        
        zoomInButton.onclick = () => this.map.zoomIn();
        zoomOutButton.onclick = () => this.map.zoomOut();

        const navContainer = document.createElement('div');
        navContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        navContainer.appendChild(zoomInButton);
        navContainer.appendChild(zoomOutButton);
        
        this.map.addControl({
            onAdd: () => {
            return navContainer;
            },
            onRemove: () => {
            navContainer.parentNode.removeChild(navContainer);
            }
        }, 'top-right');
        },
      resetMap() {
        this.map.flyTo({
          center: [144.9631, -37.8136],
          zoom: 12
        });
      }
    }
  };
  </script>
  
  <style>
  #map-container {
    position: relative;
  }
  
  #map {
    height: 80vh;
    width: 100%;
  }
  
  #search-container {
    margin: 10px 0; /* Adds margin between the title and search bar */
  }
  
  #search {
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 4px;
  }
  
  #reset-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    background-color: #3887be;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
  }
  
  .zoom-button {
    position: absolute; 
    right: 10px; 
    z-index: 1; 
    background-color: #3887be;
    border: none;
    padding: 10px; 
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}


.zoom-button:nth-of-type(1) { 
    top: 60px; /* (zoom in) */
}

.zoom-button:nth-of-type(2) { 
    top: 135px; /*  (zoom out) */
}
  
  .zoom-label {
    font-size: 12px;
    margin-top: 4px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  