$(document).ready(function () {
    $('button').on('click', function () {
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
        
        /* New Stuff */
        var width = 100 / gridRC + '%';
        var height = 100 / gridRC + 'vh';
        $('.square').css({'width': width, 'height': height});
    });
});
