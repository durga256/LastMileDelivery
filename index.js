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
        console.log('Shortest Path: ', tempOrder, 'Totaldistance: ', totalDistance);
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
        let totalWeight = 0;
        console.log('Shortest Path: ', shortestPath);
        console.log('Array weights: ', arr_wts);
        for (let i = 0; i < shortestPath.length; i += 1){
            totalWeight += arr_wts[shortestPath[i]];
            console.log('wt, totalWt', arr_wts[shortestPath[i]], totalWeight);
        }
        console.log('Total weight',totalWeight);
        return totalWeight;
    }
}
function clicked() {
        var arr_coordinates = [[40.738967, -73.983748], [40.722868, -73.988469], [40.736853, -73.978427], [40.717598, -73.991130], [40.730934, -73.983019]];
        var arr_wts = [6, -3, 5, 9,  9];
        var truckLimit = 10;
        
        let temp = new Tsp();
        let shortestPath = temp.getShortestRoute(arr_coordinates);//this is our arr of arrs of driver nodes
        console.log('Shortest Path main: ', shortestPath);
        let tempSplitTSP = new SplitTSP();
        let routeWt = tempSplitTSP.findPathWeight(shortestPath, arr_wts);
        console.log('Route Weight main: ', routeWt);
        
	    var gridRC = Math.ceil(Math.sqrt(shortestPath.length));
        var iframe = '<div class="h_iframe"><iframe class="container" frameborder="0" style="border:0" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyCYx3Pg-AjHgBYOwJ6LfXpBmuKGWwvH6k8 &origin=ChennaiAirport+India &destination=ChennaiCentral+India &waypoints=Nungambakkam+India|Kodambakkam+India &avoid=tolls|highways" allowfullscreen> </iframe></div>'
        var caption = '<div class="caption">driver';
        var $grid = $('.grid');
        var mapCount = 0;
        for (var i = 0; i < gridRC; i++) {
            var row = '<div>';
            for (var j = 0; j < gridRC; j++) {
                if (mapCount < shortestPath.length){
                    row += '<div class = "square">'+iframe+caption+(mapCount+1)+'</div>'+'</div>';
                    mapCount += 1;
                }else{
                    row += '<div class = "square">'+'</div>';
                }
            }

	        row += '</div>';

	        $grid.append(row);
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

