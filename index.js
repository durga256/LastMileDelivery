class Tsp {
    constructor() {
        this.pointDist = [];
        this.pointLocations = [];
        this.bestOrder = [];
        this.record = Number.MAX_SAFE_INTEGER;
        this.totalpoints = null;
        this.population = [];
        this.populationDensity = 500;
        this.desirability = [];
        this.chartBestRecords = [];
    }

    getShortestRoute(points) {
        // Sets the this.pointDist array to the passed in value and the total number
        // of points / collection point this.pointDist = points;

        /* Run the create points if you are calculating as the crow flies distance
        from long/lat to generate the required 2d array of distances */
        this.pointLocations = points;
        this.createpoints(points);
        this.totalpoints = this.pointDist[0].length;

        this.initialSetup();

        /* Produces the desired number of generations. For now having it equal the this.population
        density seems to work well. May be changed at a later date to a more optimal solution */
        for (let i = 0; i < (this.totalpoints * 6); i += 1) {
            this.getDesirability();
            this.normalizeDesirability();
            this.nextGeneration();

            this.chartBestRecords[i] = [];
            this.chartBestRecords[i][0] = (`Generation ${i}`);
            this.chartBestRecords[i][1] = this.record * -1;
        }
        this.chartBestRecords.splice(0, 0, ['Generation', 'Record in Meters']);
        // Return the best found order when all the generations have completed
        return (this.bestOrder);
    }

    initialSetup() {
        // Creates a default initial linear order - 0, 1, 2, 3..
        const order = this.createLinearArray(this.totalpoints-1);

        // Shuffles the linear order into the required amount of random arrays to initially
        // fill our this.population with
        for (let i = 0; i < this.populationDensity; i += 1) {
            this.population[i] = order.slice();
            this.population[i] = this.shufflePop(this.population[i], 100);
        }
        return order;
    }

    createLinearArray(size) {
        return Array.from(Array(size + 1).keys());
    }

    /* to create a 2d array, each array element representing a point's location using Lat/Long (as
    the crow flies) and this distance between itself and every point in the order, inclusively. */
    createpoints() {
        for (let i = 0; i < this.pointLocations.length; i += 1) {
            this.pointDist[i] = [];
            for (let j = 0; j < this.pointLocations.length; j += 1) {
                this.pointDist[i][j] = this.latDist(
                    this.pointLocations[i][0],
                    this.pointLocations[i][1],
                    this.pointLocations[j][0],
                    this.pointLocations[j][1],
                );
            }
        }
    }

    // Finds the total distance of a given order
    findTotalDistance(points, order) {
        // // Steps through the array of points adding distance between each point based on the order

        let totalDistance = 0;
        for (let i = 0; i < order.length; i += 1){
            let startPoint = 0;
            let endPoint = 0;
            if(i == order.length - 1){
                startPoint = order[i];
                endPoint = order[0];
            }else{
                startPoint = order[i];
                endPoint = order[i+1];
            }
            
            let distance = Number(points[startPoint][endPoint]);
            totalDistance += distance;
        }
        // Return the total distance
        let tempOrder = order;
        tempOrder.push(order[0]);
        //console.log('Shortest Path: ', tempOrder, 'Totaldistance: ', totalDistance);
        return totalDistance;
    }

    /* Credit to http:// www.movable-type.co.uk/scripts/latlong.html for the algorithm, slightly modified to fit our purposes
    Find the distance between two points given their lognitudinal and latitudinal coordinates */
    latDist(lat1, lon1, lat2, lon2) {
        const R = 6371; //  Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1); // Tsp.deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1))
            * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; //  Distance in meters
    }

    // Converts degrees to radians
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Simple shuffle to mix around the this.population
    shufflePop(pop, numTimes) {
        let shuffledPop = pop.slice();
        for (let i = 0; i < numTimes; i += 1) {
            const indexA = Math.floor(Math.random() * pop.length);
            const indexB = Math.floor(Math.random() * pop.length);
            shuffledPop = this.swap(shuffledPop, indexA, indexB);
        }
        return shuffledPop;
    }

    // Simple swap function
    swap(array, index1, index2) {
        if (array && array.length) {
            const swappedArray = array.slice();
            const temp = swappedArray[index1];
            swappedArray[index1] = swappedArray[index2];
            swappedArray[index2] = temp;
            return swappedArray;
        }
        return [];
    }

    setRecord(distance, index) {
        if (distance < this.record) {
            this.record = distance;
            this.bestOrder = this.population[index];
        }
    }

    //  Calculates the desirability for every population distribution
    getDesirability() {
        for (let i = 0; i < this.populationDensity; i += 1) {
            const distance = this.findTotalDistance(this.pointDist, this.initialSetup());
            // Sets record to the shortest distance and bestOrder to the population spwaned it
            this.setRecord(distance, i);
            // Puts number to the power 12 to exacerbate the difference between good and bad gens
            this.desirability[i] = 1 / ((distance ** 12) + 1);
        }
    }

    // Turns the desirability values into the percentage of the total desirability
    normalizeDesirability() {
        // Adds up all of the this.desirability values
        let sum = 0;
        for (let i = 0; i < this.populationDensity; i += 1) {
            sum += this.desirability[i];
        }
        // Transforms each value into it's relevant percentage of the total desirability
        for (let i = 0; i < this.populationDensity; i += 1) {
            this.desirability[i] = this.desirability[i] / sum;
        }
    }

    // Creates a cross over of two arrays of orders
    crossOver(orderA, orderB) {
        /* Generates a random start and end point, ensuring that the end is after the start. .slice
        makes it so we can go passed the last index of the order without getting an error. */
        const start = Math.floor(Math.random() * orderA.length);
        const end = Math.floor((Math.random() * orderA.length) + (start + 1));
        const newOrder = orderA.slice(start, end);
        // Add all the elements in from B as long as they're not already in A
        for (let i = 0; i < orderB.length; i += 1) {
            const point = orderB[i];
            if (!newOrder.includes(point)) {
                newOrder.push(point);
            }
        }
        // Return the newly created order
        return newOrder;
    }

    // Creates the next generation of the this.population
    nextGeneration() {
        const newPopulation = [];
        for (let i = 0; i < this.population.length; i += 1) {
            // Gets two of the best populations and then crosses them over
            const orderA = this.chooseDesirable(this.population, this.desirability);
            const orderB = this.chooseDesirable(this.population, this.desirability);
            let order = this.crossOver(orderA, orderB);
            // Mutate at a rate of 8.5%
            order = this.mutate(order, 0.085);
            newPopulation[i] = order;
        }
        this.population = newPopulation;
    }

    // Picks a random number 0 - 1 and starts subtracting desirability
    chooseDesirable(list) {
        let index = 0;
        let r = Math.random(1);
        // While r is still a positive number, keep subtracting the next this.desirability index
        while (r > 0) {
            r -= this.desirability[index];
            index += 1;
        }
        // Compensates for the final unnecessary index increment
        index -= 1;
        // Return the desirability that caused r to go negative
        return list[index].slice();
    }

    // Mutates a given order by a given % mutation rate
    mutate(order, mutationRate) {
        let mutatedOrder = order.slice();
        for (let i = 0; i < this.totalpoints; i += 1) {
            // in mutationRate % of cases this happens
            if (Math.random(1) < mutationRate) {
                // Swaps two random elements in the array
                const indexA = Math.floor(Math.random() * this.totalpoints);
                const indexB = (indexA + 1) % this.totalpoints;
                mutatedOrder = this.swap(mutatedOrder, indexA, indexB);
            }
        }
        return mutatedOrder;
    }
}
class SplitTSP{
    constructor() {

    }
    findPathWeight(shortestPath, arr_wts){
        console.log('Shortest path in finPathWeight: ',shortestPath,' Weights array: ', arr_wts);
        let totalWeight = 0;
        for (let i = 0; i < shortestPath.length; i += 1){
            totalWeight += arr_wts[shortestPath[i]];
        }
        console.log('Weight by findPathWeight: ',totalWeight);
        return totalWeight;
    }
    delete2HeaviestEdges(routeToSplit){
        console.log('Route to be split: ', routeToSplit, 'Split point: ',Math.floor(routeToSplit.length/2));
        let splitIndex = Math.ceil(routeToSplit.length / 2);
        global_splitRoute1 = routeToSplit.splice(0, splitIndex);
        global_splitRoute2 = routeToSplit.splice(-splitIndex);
        //console.log(global_splitRoute1, global_splitWtRoute1,global_splitRoute2, global_splitWtRoute2);
    }
}

//variable to store the addresses
var myArr = [];
//variable to store the weights
var myWeights = [];
//keep track of num of addresses
var numOfAddresses = 0;
var global_splitRoute1;
var global_splitRoute2;
var global_final_route_coordinates;
var global_final_iframes;

function clicked() {
        console.log('Clicked');
        var truckLimit = 10; //hardcoded
        var arr_coordinates = global_coordiantes;
        var arr_wts = [6, -2, 5, -1,  9];
        var arr_routes = []; //stores the index of nodes in the shortest routes
        var arr_route_wt = [];
        var temp;
        var shortestPath;
        var tempSplitTSP;
        var routeWt;
        var routeToSplit;
        var routeWt1;
        var routeWt2;
        //do first iteration here
        temp = new Tsp();
        shortestPath = temp.getShortestRoute(arr_coordinates);//this is our arr of arrs of driver nodes
        arr_routes.push(shortestPath);
        do{
            tempSplitTSP = new SplitTSP();
            routeWt = tempSplitTSP.findPathWeight(arr_routes[0], arr_wts);
            if(arr_routes[0].length == arr_coordinates.length){
                arr_route_wt.push(routeWt);
            } 
            console.log('Array route wt after pushing first',arr_route_wt)
            if(arr_route_wt[0] > truckLimit){
                arr_route_wt.shift();
                console.log('Array route wt after shifting',arr_route_wt)
                routeToSplit = arr_routes.shift(); //pop first element of arr, optimize it, push the result to the back
                tempSplitTSP.delete2HeaviestEdges(routeToSplit);
                arr_routes.push(global_splitRoute1);
                arr_routes.push(global_splitRoute2);
                routeWt1 = tempSplitTSP.findPathWeight(global_splitRoute1, arr_wts);
                routeWt2 = tempSplitTSP.findPathWeight(global_splitRoute2, arr_wts);
                arr_route_wt.push(routeWt1);
                arr_route_wt.push(routeWt2);
                console.log('Array_route_wt after end of if: ', arr_route_wt);
                console.log("Route weights: ", arr_route_wt);
                console.log("Route", arr_routes);
            }
            
        }while(arr_route_wt.length > 0 && arr_route_wt[0] > truckLimit);
        console.log('Array of final routes', arr_routes);
        console.log('Final Route wt of each route', arr_route_wt);
        var arr_this_route;
        for(let i = 0; i < arr_routes.length; i+=1){
            arr_this_route = [];
            for(let j = 0; j < arr_routes[i].length; j += 1){
                arr_this_route.push(arr_coordinates[arr_routes[i][j]]);
            }
            console.log('Aarr of this route', arr_this_route)
            global_final_route_coordinates.push(arr_this_route);
        }
        console.log('global final arr', global_final_route_coordinates);
	    // var gridRC = Math.ceil(Math.sqrt(arr_routes.length));
        global_final_iframes = [];
        var iframestring;
        for(let i =0; i < global_final_route_coordinates; i +=1){
                iframestring ='<div class="h_iframe"><iframe class="container" frameborder="0" style="border:0" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyCYx3Pg-AjHgBYOwJ6LfXpBmuKGWwvH6k8 &origin='
                +global_final_route_coordinates[i][0][0]+','+global_final_route_coordinates[i][0][1]
                +'&destination='+ global_final_route_coordinates[i][0][0] +','+global_final_route_coordinates[i][0][1]+'&waypoints=';
                for (let j = 1; j < global_final_route_coordinates[i]; j+= 1){
                    iframestring += global_final_route_coordinates[i][j][0] + ',' + global_final_route_coordinates[i][j][1];
                    if(j!=global_final_route_coordinates[i]-1){
                        iframestring += '|';
                    }
                }
                iframestring += '&avoid=tolls|highways" allowfullscreen> </iframe></div>';
                global_final_iframes.push(iframestring);
        }

        var iframe = '<div class="h_iframe"><iframe class="container" frameborder="0" style="border:0" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyCYx3Pg-AjHgBYOwJ6LfXpBmuKGWwvH6k8 &origin=ChennaiAirport+India &destination=ChennaiCentral+India &waypoints=Nungambakkam+India|Kodambakkam+India &avoid=tolls|highways" allowfullscreen> </iframe></div>';
        // var caption = '<div class="caption">driver';
        // var $grid = $('.slideshow-container');
        // var mapCount = 0;
        // for (var i = 0; i < gridRC; i++) {
        //     var row = '<div>';
        //     for (var j = 0; j < gridRC; j++) {
        //         if (mapCount < shortestPath.length){
        //             row += '<div class = "square">'+iframe+caption+(mapCount+1)+'</div>'+'</div>';
        //             mapCount += 1;
        //         }else{
        //             row += '<div class = "square">'+'</div>';
        //         }
        //     }
	    //     row += '</div>';
	    //     $grid.append(row);
        // }
        /* New Stuff */
        //var width = 100 / gridRC + '%';
        //var height = 100 / gridRC + 'vh';
        //$('.square').css({'width': width, 'height': height});

}
document.getElementById("home-btn").addEventListener('click',  function(evt) {

        return openPage("Home", evt)
    }
)

document.getElementById("news-btn").addEventListener('click',  function(evt) {

        return openPage("News", evt)
    }
)

document.getElementById("contact-btn").addEventListener('click',  function(evt) {

        return openPage("Contact", evt)
    }
)

document.getElementById("about-btn").addEventListener('click',  function(evt) {

        return openPage("About", evt)
    }
    )

function openPage(pageName,evt) {

    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    //console.log(tabcontent)
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    //console.log(tablinks)
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";
}



function generateInputForDestinations(){
    var num = document.getElementById('NumOfDestinations').value;
    var tempDiv = document.getElementById('destinations');
    tempDiv.innerHTML="";
    numOfAddresses = num;
    for(let i = 1; i <= num; i++){
        var temp = i+"frame";
        var temp1 = i+"weight";
        //alert(temp);
        tempDiv.innerHTML +=
            "                <label for=\"frame\"> Destination "+i+" :</label>\n" +
            "\n" +
            "                <input class=\"form-control\" id="+temp +" class = \"destinations\" type=\"text\" required>\n" +
            "                <label for=\"frame\"> Weight "+i+":</label>\n" +
            "                <input class=\"form-control\" id="+temp1 +" class = \"weights\" type=\"text\" required>\n";

    }
    tempDiv.innerHTML+="<button type=\"button\" onclick = \"collect(),clicked(),openPage('News',event)\">Generate Grid</button>";

}

var global_coordiantes = []
var global_weights = []

async function collect()
{
    console.log('submit is called');
    for(let i = 0; i < numOfAddresses; i++){
        var temp = i+"frame";
        myArr.push(document.getElementById(temp).value);
    }
    for(let i = 1; i <= numOfAddresses; i++){
        var temp = i+"weight";
        myWeights.push(document.getElementById(temp).value);
    }
    for (let i = 0 ; i < myArr.length ; i+=1 ){
    console.log('For is working');
    var str = myArr[i];
    var nospclchar = str.replace(/[^\w ]/g, '');
    console.log(nospclchar+'this is the seperated string');
    await fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+nospclchar+'&components=country:CA&key=AIzaSyCYx3Pg-AjHgBYOwJ6LfXpBmuKGWwvH6k8')
    .then(response => 
      response.json()
    ).then(data=>{
        console.log(data);
        const lat = data.results[0].geometry.location.lat;
        const long = data.results[0].geometry.location.lng;
        global_coordiantes.push([lat, long]);
      //  console.log(data);
      //  console.log(lat, long);

    })
    .catch(error => {
        console.log(error)
    });
    console.log(global_coordiantes)
    }//for ends
}


let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}



