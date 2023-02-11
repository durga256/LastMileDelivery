
$(document).ready(function () {
    $('button').on('click', function () {
        //Logic goes here
        var x = document.getElementById('grid');
        x.innerHTML="";
        const p1 = [1,2,3,4,5,6,7,8,9,10];//this is our arr of arrs of driver nodes
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
        //function codeAddress() {
        //    var address = document.getElementById('address').value;
        //    geocoder.geocode( { 'address': address}, function(results, status) {
        //      if (status == 'OK') {
        //        map.setCenter(results[0].geometry.location);
        //        var marker = new google.maps.Marker({
        //            map: map,
        ///            position: results[0].geometry.location
        //        });
        //      } else {
        //        alert('Geocode was not successful for the following reason: ' + status);
        //      }
        //    });
        //  }
        
        //codeAddress()
        /* New Stuff */
        var width = 100 / gridRC + '%';
        var height = 100 / gridRC + 'vh';
        $('.square').css({'width': width, 'height': height});
    });
});



openInfo(event,'bookService');
function openInfo(evt, tabName) {

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function generateDestinationInputs(){
    var form = document.getElementById("theDestinations");
    var val = document.getElementById("numOfDestinations").value;
    form.innerHTML = "";
    for(let i = 0; i < val; i++){
        var newElement = document.create
        form.innerHTML+="<div class=\"row\">\n" +
            "            <div class=\"col-25\">\n" +
            "                <label for=\"numOfDestinations\">"+i+"th desination</label>\n" +
            "\n" +
            "                <input class=\"form-control\" id=\"thDestination\" type=\"text\"  required>\n" +
            "                <div class=\"valid-feedback\">Valid.</div>\n" +
            "                <div class=\"invalid-feedback\">Please fill out this field.</div>\n" +
            "            </div>\n" +
            "        </div>";
    }
    form.innerHTML += "<div class = \"row\">\n" +
        "            <div class=\"col-25\">\n" +
        "                <input class=\"form-control\" id=\"in6\" type=\"submit\" onclick =\"openInfo(event,'grid')\"/>\n" +
        "            </div>\n" +
        "        </div>"
}