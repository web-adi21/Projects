
  
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: selectedListing.geometry.coordinates // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    const marker1 = new mapboxgl.Marker({color: "Red"})
        .setLngLat(selectedListing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>${selectedListing.location}</h4><p>Exact location provided after booking</p>`))
        .addTo(map);