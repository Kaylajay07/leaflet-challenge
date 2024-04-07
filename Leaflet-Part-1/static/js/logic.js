 url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


 // Create the tile layer that will be the background of our map.
 let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

   // Create the map object with options.
   let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 2,
    layers: [streetmap]
  });



  d3.json(url).then(function(data){
    function chooseColor(depth){
        if (depth > 90 ){return "#d73027"}
        if (depth > 70 ){return "#fc8d59"}
        if (depth > 50 ){return "#fee08b"}
        if (depth > 30 ){return "#d9ef8b"}
        if (depth > 10 ){return "#91cf60"}
        return "#1a9850"

     };

     function getRadius(magnitude){
        return magnitude * 4
     }

     //Add earthquakes and style formatting
    L.geoJson(data, {
        style: function(feature) {
          return {
            color: "black",
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            fillOpacity: 1,
            weight: 0.5
          };
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(
                "<b>" + "Location: " + feature.properties.place + "</br>" + "</b>" +
                "Magnitude: " + feature.properties.mag + "</br>" +
                "Depth: " + feature.geometry.coordinates[2]
             )
            //layer.bindPopup("<h3>"+ "Magnitude: " + feature.properties.mag + "</h3> <hr> <h2>" + feature.geometry.coordinates[2] + "</h2>"); 
        },
        pointToLayer: function (feature,latlng){return L.circleMarker(latlng)} 
      }).addTo(map);

      //Add legend functionality
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function () {
      
          var div = L.DomUtil.create('div', 'info legend'),
              depths = [0,10,30,50,70,90],
              color = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < depths.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + color[i] + '"></i> ' +
                  depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
          }
      
          return div;
      };
      
      legend.addTo(map);
  })