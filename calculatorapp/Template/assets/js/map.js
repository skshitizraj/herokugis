
$(document).ready(function () {
    
    console.log("thissss");

    var map = L.map('map',{
        minZoom:7,
        preferCanvas:true,
        // drawControl: true,
    });
    
    map.setView([28.2957487, 83.8123341], 8);
    
    
    
    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    var options = {
        edit: {
            featureGroup: editableLayers
        },
        draw: {
        polyline: false,
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#FF0000', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#2653d4'
            }
        },
        circle: false, // Turns off this drawing tool
        rectangle: {
            allowIntersection: false,
            shapeOptions: {
                color: '#2653d4',
                clickable: true
            }
        },
        marker: false,
        }
    };
    
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    
    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;

    
        if (type === 'marker') {
            layer.bindPopup('A popup!');
        }
    
        editableLayers.addLayer(layer);
    });

    map.on('draw:edited', function (e) {
        var layers = e.layers;
        layers.eachLayer(function (layer) {
            //do whatever you want; most likely save back to db
        });
    });
    
    // var url="../../../../data/elevation1.tif";
    // console.log(url);
    

    // var layer = L.leafletGeotiff(url, options).addTo(map);

    osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var dem = L.tileLayer.wms('http://localhost:9090/geoserver/raster/wms/',{
        layers: "raster:nepal250",
        format: 'image/png',
        transparent: true,
        request:"GetMap",
    }).addTo(map);
  
    
                
    
    googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map);
    // mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/skshitiz1/cjvosths00oqu1cln1v7765pf/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2tzaGl0aXoxIiwiYSI6ImNqcmJ2czBjODBhMTgzeWxwM2t1djJuaXUifQ.wlFktg-soH3B_pqVyJj2Ig')
    var baseLayers = {
                    "OpenStreetMap": osm,
                    "Google Streets": googleStreets,
                    "Google Hybrid": googleHybrid,
                    "Google Satellite": googleSat,
                    "Google Terrain": googleTerrain,
                    "Nepal Dem":dem
                    // "Mapbox Tiles": mapboxTiles
                };
                
    layerswitcher = L.control.layers(baseLayers, {}, {collapsed: true}).addTo(map);
    // var i=0;
    
    var json;
    var stringreceived;

    
    var dataLayer;
    function loadreceiveddata(receive){
        var x = document.getElementById('export');
        // var y = document.getElementById('deleteshape');
        x.style.display = "block";
        // y.style.display = "block";
            



        // editableLayers.clearLayers();
        if(map.hasLayer(dataLayer)){
            map.removeLayer(dataLayer);
            // console.log(i);
        }
        
        // if(i>0){
        //     // map.removeLayer(dataLayer);
        //     // dataLayer.clearLayers();

        // }
       
        // var data ={"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[83.78683, 28.384756], [83.78683, 28.417372], [83.814289, 28.417372], [83.814289, 28.384756], [83.78683, 28.384756]]]}, "properties": {FID: 0, min: 1654}}]}
        stringreceived=receive;
        console.log(stringreceived);
        json=JSON.parse(receive);
        dataLayer=L.geoJson(json,{
            style:{
                fillColor: " #172f76 ",
                fillOpacity: 0.9,
                color:"#ffffff",
                opacity: 1,
                weight: 2,
            },
            onEachFeature:function(feature, layer) {
                layer._leaflet_id = feature.properties.FID;
                
                layer.on({
                    mouseover: function () {
                        this.setStyle({
                            'fillOpacity':0.3,
                        });
                    },
                    mouseout: function () {
                        this.setStyle({
                            // 'fillColor': ' #ffff01 ',
                            'fillColor': ' #172f76 ',
                            'fillOpacity':0.9,
                        });
                    },
                    click: function (event) {
                        console.log("clicked");
                        // openNav();
                    
                    }
                });
                var pushcontent = "";
                pushcontent += '<table  style="width:250px" id="CHAL-popup" class="table  table table-hover table-bordered ">';
                for (data in layer.feature.properties) {        
                    pushcontent += "<tr>" + "<td>" + data + "</td>" + "<td>" + "  " + layer.feature.properties[data] + "</td>" + "</tr>";
                 }
                pushcontent += '</table>';
                layer.bindPopup(pushcontent);
                // var maintable= document.getElementById("maintable");
                // maintable.innerHTML="<table><thead class=\"text-left\"><tr></tr></thead><tbody><tr><td>District</td><td>"+feature.properties.district+"</td></tr><tr><td>Area (sq.km.)</td><td>"+area+"</td></tr></tbody></table>";
                layer.bindTooltip(String(feature.properties.FID), {permanent:true,direction:'center',opacity: 0.5});
            },
        });
        // dataLayer.addTo(map);
        map.addLayer(dataLayer);
        // i++;
        // document.getElementById('export').setAttribute('href', 'data:' + json);
        // document.getElementById('export').setAttribute('download','data.geojson');

    }
       
    // on click, clear all layers
    document.getElementById('delete').onclick = function(e) {
        // if(editableLayers.hasLayer==true){
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover your drawn geometry",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    editableLayers.clearLayers();
                    // if(map.hasLayer(dataLayer)){
                    //     map.removeLayer(dataLayer);
                    //     console.log(i);
                    // }
                    if(map.hasLayer(province)){
                        map.removeLayer(province);
                        // console.log(i);
                    }
                    var x = document.getElementById('export');            
                    x.style.display = "none";
                  
                } else {
                  
                }
              });

        // }
        
        
        
    }
    document.getElementById('deleteshape').onclick = function(e) {
        if(map.hasLayer(dataLayer)){
            map.removeLayer(dataLayer);
            // console.log(i);
        } 
    }
    // document.getElementById('closehist').onclick = function(e) {
    //     closenav();
    // }

    var k=0;
    document.getElementById('histogram').onclick = function(e) {
        
        k=k+1;
        $.ajax( 
            { 
                type:"GET", 
                url: "histogram", 
                data:{ 
                            parameter: k
                }, 
                
            success: function( data ) 
            { 
                console.log(data);

                swal({
                    title: "Histogram Generated !",
                    text: "Histogram can be analyzed with single Geometry, Having multiple geometry will create average of them",
                    icon: "success",
                    buttons: true,
                    dangerMode: false,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        console.log("from inside delete")
                        showhist();
                        
                    } else {
                    //   swal("Your Geometry is not deleted!");
                    }
                  });


                
                },
            error: function() 
            { 
                swal ( "Oops" ,  "Please do calculation first" ,  "error" );
    
                } 
        }) 
        
    }
    function showhist(){
        modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
        // img = document.getElementById("myImg");
        
        // modalImg = document.getElementById("img01");
        modalImg = document.getElementById("img01");
        modalImg.src = "static/img/histogram"+k+".png";
        captionText =document.getElementById("caption");
        
        modal.style.display = "block";
        // modalImg.src = "static/img/histogram.png";
        captionText.innerHTML = "Digital Elevation Histogram";
        
        
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() { 
        modal.style.display = "none";
        
        delete modalImg.src;
        delete modalImg;
        delete captionText;
        console.log("deleted")
        }
    }

    
    document.getElementById('export').onclick = function(e) {
        download(JSON.stringify(json), 'json.geojson', 'text/json');
        
    }
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    
    document.getElementById('sum').onclick = function(e) {
        
        $.ajax( 
            { 
                type:"GET", 
                url: "call", 
                data:{ 
                            parameter: "sum"
                }, 
                
            success: function( data ) 
            { 
                loadreceiveddata(data);
                },
            error: function() 
            { 
                swal ( "Oops" ,  "Please load data First!" ,  "error" );
    
                } 
        })  
    }
    document.getElementById('province').onclick = function(e) {
        
        province = new L.geoJson.ajax("static/data/province.geojson", {
        }).addTo(map);
    }
   
    document.getElementById('min').onclick = function(e) {
        
        $.ajax( 
            { 
                type:"GET", 
                url: "call", 
                data:{ 
                            parameter: "min"
                }, 
                
            success: function( data ) 
            { 
                loadreceiveddata(data);
                },
            error: function() 
            { 
                
                swal ( "Oops" ,  "Please load data First!" ,  "error" );
    
                }  
        })  
    }
    document.getElementById('max').onclick = function(e) {
        
        $.ajax( 
            { 
                type:"GET", 
                url: "call", 
                data:{ 
                            parameter: "max"
                }, 
                
            success: function( data ) 
            { 
                loadreceiveddata(data);
                },
            error: function() 
            { 
                swal ( "Oops" ,  "Please load data First!" ,  "error" );
    
                }  
        })  
    }
    document.getElementById('mean').onclick = function(e) {
        
        $.ajax( 
            { 
                type:"GET", 
                url: "call", 
                data:{ 
                            parameter: "mean"
                }, 
                
            success: function( data ) 
            { 
                loadreceiveddata(data);
                },
            error: function() 
            { 
                swal ( "Oops" ,  "Please load data First!" ,  "error" );
    
                } 
        })  
    }
    document.getElementById('majority').onclick = function(e) {
        
        $.ajax( 
            { 
                type:"GET", 
                url: "call", 
                data:{ 
                            parameter: "count"
                }, 
                
            success: function( data ) 
            { 
                
                loadreceiveddata(data);
                
                }, 
            error: function() 
            { 
                swal ( "Oops" ,  "Please load data First!" ,  "error" );
    
                } 
        })  
    }
 
    
    
    document.getElementById('load').onclick = function(e) {
        // Extract GeoJson from featureGroup
        if(map.hasLayer(province)){
           
            console.log("i am from inside");
            
                $.ajax( 
                    { 
                        type:"GET", 
                        url: "data", 
                        data:{ 
                                vector: "province" 
                                
                    }, 
                    success: function( data ) 
                    {                     
                        swal("Next Step to Calculation !", "Data Loaded Succesfully !", "success");
                        console.log(data);
                        } 
                })
           
            

        }  else {

        

        
        var data = editableLayers.toGeoJSON();
        console.log(data);
        
        
    
        // Stringify the GeoJson
        
        console.log(JSON.stringify(data));
        if(JSON.stringify(data)=='{"type":"FeatureCollection","features":[]}'){
            // alert("Data is null !");
            swal ( "Oops" ,  "Please load data First!" ,  "error" );
        }else{
                $.ajax( 
                { 
                    type:"GET", 
                    url: "data", 
                    data:{ 
                            vector: JSON.stringify(data) 
                            
                }, 
                success: function( data ) 
                {                     
                    swal("Next Step to Calculation !", "Data Loaded Succesfully !", "success");
                    console.log(data);
                    } 
            })
    
        }

        }
        
        
    }
    document.getElementById('receive').onclick = function(e) {
        
        $.ajax( 
            { 
                type:"GET", 
                url: "call", 
                data:{ 
                            parameter: "all"
                }, 
                
            success: function( data ) 
            { 
                loadreceiveddata(data);
                },
            error: function() 
            { 
                swal ( "Oops" ,  "Please load data First!" ,  "error" );
    
                }  
        })  
    }

});
