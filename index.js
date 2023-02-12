function clicked() {
    //openPage('News', this, 'green')
        //Logic goes here
        const p1 = [1,2];//this is our arr of arrs of driver nodes
	    var gridRC = Math.ceil(Math.sqrt(p1.length));
        var iframe = '<div class="h_iframe"><iframe class="container" frameborder="0" style="border:0" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyCYx3Pg-AjHgBYOwJ6LfXpBmuKGWwvH6k8 &origin=ChennaiAirport+India &destination=ChennaiCentral+India &waypoints=Nungambakkam+India|Kodambakkam+India &avoid=tolls|highways" allowfullscreen> </iframe></div>'
        var caption = '<div class="caption">driver';
        var $grid = $('.grid');
        var mapCount = 0;
        for (var i = 0; i < gridRC; i++) {
            var row = '<div>';
            for (var j = 0; j < gridRC; j++) {
                if (mapCount < p1.length){
                    row += '<div class = "square">'+iframe+caption+(mapCount+1)+'</div>'+'</div>';
                    mapCount += 1;
                }else{
                    row += '<div class = "square">'+'</div>';
                }
            }

	        row += '</div>';

	        $grid.append(row);
	        console.log(row);
            console.log($grid);
        }


        //trying to get the co-ordinates of the location entered using geo
        function codeAddress() {
            var address = document.getElementById('address').value;
            geocoder.geocode( { 'address': address}, function(results, status) {
              if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
          }
        

        /* New Stuff */
        var width = 100 / gridRC + '%';
        var height = 100 / gridRC + 'vh';
        $('.square').css({'width': width, 'height': height});

}
function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}


function generateInputForDestinations(){
    var num = document.getElementById('NumOfDestinations').value;
    var tempDiv = documen.getElementById('destinations');
    tempDiv.innerHTML="";
    for(let i = 0; i < num; i++){
        tempDiv.innerHTML += "<div class=\"row\">\n" +
            "            <div class=\"col-25\">\n" +
            "                <label for=\"frame\">Destination:</label>\n" +
            "\n" +
            "                <input class=\"form-control\" id=\"frame\" type=\"text\" required>\n" +
            "                <div class=\"valid-feedback\">Valid.</div>\n" +
            "                <div class=\"invalid-feedback\">Please fill out this field.</div>\n" +
            "            </div>\n" +
            "        </div>";
    }
}

