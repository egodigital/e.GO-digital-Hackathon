data = {}; // data of current drive in page2


// set up heatmap and append to parent with specific mapId 
function setMap(parentId, mapId) {
    $('#'+parentId).append(
        '<ons-card class="MapCard">'+
            '<div class="title">'+
                '<div class="center">Map View</div>'+
            '</div>'+
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

        //Calculate intensity:
        var intens = [];
        //find max, min
        var max=-1000;
        var min=1000;
        for(var i=0; i<data.S.length; i++) {
            if(max<data.S[i]) max = data.S[i];
            if(min>data.S[i]) min = data.S[i];
        }

        // format S to intensity -> 0 <= intensity <= 1
        for(var i=0; i<data.S.length; i++) {
            intens.push((data.S[i]-min)/max);
        }

        //Format data
        series = [];
        for(var i=0; i<data.S.length; i++) {
            var lat = data.lat[i];
            var long = data.lon[i];
            var int = intens[i];
            series.push([lat, long, int]); // lat, lng, intensity
        }

        var heat = L.heatLayer(series, {radius: 25}).addTo(map);
        
    }

// append MiniTripCard to parent on page1
function setMiniTripCard(parent, id, title) {
    $('#'+parent).append(
        '<ons-card id="'+id+'" class = "MiniCard">' +
            '<div class="title">' +
                '<i class="fas fa-car-side" style="border: solid; border-radius: 50%; padding:3%; margin-right:5%"></i>'+
                title+
                '<ons-button style="margin-right:5px; float:right">'+
                    '<i class="fas fa-ellipsis-v"></i>'+
                '</ons-button>'+
                '<ons-button style="margin-right:10px;float:right;">'+
                    '<i class="fas fa-share-alt"></i>'+
                '</ons-button>'+
            '</div>' +
            '<div class="centeredCardContend">'+
                '<div class="MiniCardLeft">'+
                    '<p align="center">Duration</p>'+
                    '<p align="center" id="'+id+'_duration"></p>'+
                '</div>'+
                '<div class="MiniCardCenter center">'+
                    '<p align="center">&Oslash; Speed</p>'+
                    '<p align="center" id="'+id+'_speed"></p>'+
                    '</div>'+
                '<div class="MiniCardRight">'+
                    '<p align="center">&Oslash; Stress</p>'+
                    '<p align="center" id="'+id+'_stress"></p>'+
                '</div>'+
            '</div>'+
        '</ons-card>'
    );

    //update values on socket event
    socket.on('singleValues_'+title, function(data) {
        var minutes = data.duration/60;
        $('#'+id+'_duration').html((minutes.toFixed(1))+" min");
        $('#'+id+'_speed').html(data.meanV+" km/h");
        $('#'+id+'_stress').html(data.meanS);
    });
    // request data for this card
    socket.emit('getSignleValues', title);

    // Go to details if clicked:
    $('#'+id).click(function () {
        page_title = title;
        document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: title}});
    });
}

// append chart to parent on page2 with unique id and chart-title
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

    //Set up data:
    series = []
    avg = 0;
    for(var i=0; i<data.t.length; i++) {
        var data_y;
        if(title==="Speed") data_y=data.V[i]*3.6; // convert m/s to km/h
        else if(title==="Stress") data_y=data.S[i];
        else console.log("title not found (setChart()).");
        series.push({x: data.t[i], y: data_y});
        avg+=data_y;
    }
    avg/=data.t.length;

    // configure chart
    var y_label = "";
    if(title==="Speed") y_label="km/h";

    var options = {
        chart: {
            height: 200,
            type: 'line',
            zoom: {
            enabled: false
            }
        },
        annotations: { // add avg-line
            yaxis: [{
                y: avg,
                borderColor: '#969696',
                label: {
                    borderColor: '#969696',
                    style: {
                        color: '#fff',
                        background: '#969696',
                    },
                    text: 'Avg',
                }
            }]
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        series: [{
            name: title,
            data: series
        }],
        grid: {
            row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
            }
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                  return val.toFixed(1);
                }
            },
            title: {
                text: y_label
            }
        },
        xaxis: {
            labels: {
                formatter: function (val) {
                  return (val / 60).toFixed(1);
                }
            },
            title: {
                text: 'Time [min]'
            }
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#"+Id+"chart"),
        options
    );[10, 41, 35, 51, 49, 62, 69, 91, 148]

    chart.render();
}

// append SpeedStressCard to parent on page2 with unique id
function setSpeedStressCard(parent, id) {
    $('#'+parent).append(
        '<ons-card>'+
            '<div id="'+id+'" class="centeredCardContend">'+
                '<div class="SpeedStressCardLeft">'+
                    '<p align="center">&Oslash; Speed</p>'+
                    '<p id="'+id+'_speed" align="center"></p>'+
                '</div>'+
                '<div class="SpeedStressCardRight">'+
                    '<p align="center">&Oslash; Stress</p>'+
                    '<p id="'+id+'_stress" align="center"></p>'+
                '</div>'+
            '</div>'+
        '</ons-card>'
    );

    //update values on socket event
    socket.on('singleValues_'+page_title, function(data) {   
        $('#'+id+'_speed').html(data.meanV+" km/h");
        $('#'+id+'_stress').html(data.meanS);
    });
    //request data for this card
    socket.emit('getSignleValues', page_title);
}

// first: loadt JSON-File, then: setup page elements
function loadPage(title) {
    $.getJSON(title+".json", function(msg) {
        data = msg;
    }).done(function() {
        setMap("page2_body", "map1");
        setSpeedStressCard("page2_body", "card");
        setChart("page2_body", "speed_chart", "Speed");
        setChart("page2_body", "stress_chart", "Stress");
    });
}