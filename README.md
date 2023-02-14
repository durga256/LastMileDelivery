# LastMileDelivery[In-Debug]
Extending Travelling Salesman Problem to accomodate returns

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

Looking at an example below
Given the points: 
<ul>
  <li>183 E Houston St, NY 10002</li>
  <li>NY 10010</li>
  <li>Allen Malls, Allen st, NY 10002</li>
  <li>158e E 23rd St, NY 10010</li>
  <li>223 1st Ave, NY 10003 </li>
</ul>


<p align="center"><img src="https://drive.google.com/uc?export=view&id=1elTLCjqTXnIq4_Sh091XQRRBZor9Gwz6" alt="OptimisedPath1"></p>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=1CVsWriWKOR6qXdZC_3wPbk5fT9Q7TUyj" alt="OptimisedRoute1"></p>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=1xY7sS5tstnQBThdEiUj2UroMUnMw1y43" alt="OptimisedPath2"></p>
<p align="center"><img src="https://drive.google.com/uc?export=view&id=18U6O_CfobOVXqTEiZhLk7NxV2i1Qc2NX" alt="OptimisedRoute1"></p>



