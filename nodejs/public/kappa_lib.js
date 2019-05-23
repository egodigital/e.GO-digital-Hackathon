

function setMap(parentId, mapId) {
    $('#'+parentId).append(
        '<ons-card class="MapCard">'+
            '<div class="title">'+
                '<div class="center">Simple Map View</div>'+
            '</div>'+
            //<!-- add map here -->
            '<div id="'+mapId+'" class="map" style="height: 70vh"></div>'+
        '</ons-card>'
    )

        //set Map size
        var width = $("ons-card").width();
        $("#"+mapId).width(width); 

        var map = new L.Map(mapId);

        // create the tile layer with correct attribution
        var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});		

        // start the map in South-East England
        map.setView(new L.LatLng(50.784411, 6.047544), 14.5);
        map.addLayer(osm);

        var heat = L.heatLayer([
            [50.7841, 6.0471, 0.2], // lat, lng, intensity
            [50.7842, 6.0472, 0.5],
            [50.7843, 6.0473, 0.5],
            [50.7844, 6.0474, 0.5],
        ], {radius: 25}).addTo(map);
        
    }

function setMiniTripCard(parent, id) {
    $('#'+parent).append(
        '<ons-card id="'+id+'" class = "MiniCard">' +
            '<div class="title">' +
                '<i class="fas fa-user-alt" style="border: solid; border-radius: 50%; padding:3%; margin-right:5%"></i>'+
                'Justus'+
            '</div>' +
            '<div>'+
                '<ons-button class="right">'+
                    '<i class="fas fa-share-alt"></i>'+
                '</ons-button>'+
                '<ons-button class="right" style="margin-left:5%">'+
                    '<i class="fas fa-ellipsis-v"></i>'+
                '</ons-button>'+
            '</div>'+
            '<div style="margin-top:5%;display:flex;flex-flow: row wrap;">'+
                '<div class="MiniCardLeft">'+
                    '<p class="center">Distance</p>'+
                '</div>'+
                '<div class="MiniCardCenter center">'+
                    '<p class="center">Speed</p>'+
                '</div>'+
                '<div class="MiniCardRight">'+
                    '<p class="center">Stress</p>'+
                '</div>'+
            '</div>'+
        '</ons-card>'
    );
}

function setChart(parent, Id, title) {
    $('#'+parent).append(
        '<ons-card>'+
            '<div class="title">'+
                title+
            '</div>'+
                '<div id="'+Id+'chart"></div>'+
        '</ons-card>'+
    '</ons-page>'
    );

    var options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
            enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        grid: {
            row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
            }
        }
    }
  
    var chart = new ApexCharts(
    document.querySelector("#"+Id+"chart"),
    options
    );

    chart.render();
}