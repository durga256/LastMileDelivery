# LastMileDelivery[In-Debug]
Extending Travelling Salesman Problem to accomodate returns: View it <a href="https://durga256.github.io/LastMileDelivery/">here</a>(Better viewed on desktop)

Given that there is two deliveries to points B and C and one heavy pickup at point B. What is the optimised route? 
<p align="center"><img src="https://drive.google.com/uc?export=view&id=1Qix3zSGtDBBICePh27ds-SzUakDr3_i0" alt="OptimisedRoute1"></p>
<ul>
  <li>Can we send an empty truck to pickup returns at point B?(2 trucks Covering B, C nodes)
  <p align="center"><img src="https://drive.google.com/uc?export=view&id=1P10xVVFz2AXJhl8lpvt0zMQCen8XcrnJ" alt="Route1"></p>
  <p align="center"><img src="https://drive.google.com/uc?export=view&id=13QqXj6XJIwKZAD_t3y_gZQgt60m3emm-" alt="Route2"></p>
  </li>
  <li>Can we introduce a new lighter delivery to point D such that the truck can cover points B and D?(2 trucks covering B, C, and D)
  <p align="center"><img src="https://drive.google.com/uc?export=view&id=1VWZaSUqT9HTOXQYBqCfP3tkzoNmjpOQk" alt="Route2"></p>
  <p align="center"><img src="https://drive.google.com/uc?export=view&id=13QqXj6XJIwKZAD_t3y_gZQgt60m3emm-" alt="Route2"></p>
  </li>
 </ul>

Obviously option 2 is more optimised because it covers more nodes with the same number of trucks. This project handles this problem. 

Looking at an example below<br>
Given the points: 
<table class="center">
  <tr>
    <th>Address</th>
    <th>Weight to add to truck</th>
  </tr>
  <tr>
    <td>183 E Houston St, NY 10002</td>
    <td>-2</td>
  </tr>
  <tr>
    <td>Midtown Manhattan, NY 10010</td>
    <td>5</td>
  </tr>
  <tr>
    <td>Allen Malls, Allen st, NY 10002</td>
    <td>-1</td>
  </tr>
  <tr>
    <td>158e E 23rd St, NY 10010</td>
    <td>6</td>
  </tr>
  <tr>
    <td>223 1st Ave, NY 10003</td>
    <td>9</td>
  </tr>
</table>

The optimised routes given a truck can carry only 10 tonnes is given below:
<br>
<b>Route 1</b>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=1elTLCjqTXnIq4_Sh091XQRRBZor9Gwz6" alt="OptimisedPath1"></p>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=1CVsWriWKOR6qXdZC_3wPbk5fT9Q7TUyj" alt="OptimisedRoute1"></p>
<b>Route 2</b>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=1xY7sS5tstnQBThdEiUj2UroMUnMw1y43" alt="OptimisedPath2"></p>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=18U6O_CfobOVXqTEiZhLk7NxV2i1Qc2NX" alt="OptimisedRoute1"></p>



