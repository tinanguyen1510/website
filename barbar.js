// <!DOCTYPE html>
// <meta charset="utf-8">
// <style> 

// .bar { fill: steelblue; }

// </style>
// <body>    	
// <script src="https://d3js.org/d3.v5.min.js"></script>
// <script>

// set the dimensions and margins of the graph
// d3.select("#topbottom").append("h2").text("States with the most and least death by CVD 2016")
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);

 var div = d3.select("#topbottom").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0)
              .style("position", "absolute")
              .style("visibility", "hidden")
              .style("background-color", "white")
              .style("border", "solid")
              .style("border-width", "1px")
              .style("border-radius", "5px")
              .style("padding", "10px");

var color = d3.scaleOrdinal()
    .domain(10)
    .range([
      '#b7b7ff','#a6a6ff','#8282ff','#5e5eff','#4d4dff','#4545e5','#3d3dcc','#3535b2','#2e2e99','#26267f']);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#topbottom").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
   d3.csv("topbottom.csv").then(function(data) {
    data.forEach(function(d) {
                          d.state = d.State;
                          d.value = +d.Deaths;
                          // d.cause = d.Cause_name
                          // console.log(d.year);
                          });

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.value; })])
  y.domain(data.map(function(d) { return d.state; }));
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  svg.selectAll("rect")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x",0)
      .attr("width", function(d) {return x(d.value); } )
      .attr("y", function(d) { return y(d.state); })
      .attr("height", y.bandwidth()-3)
      .style("fill",function(d){return color(d.state)})
       .on("mouseover", function(d) {    
                          // div.transition()    
                          //     .duration(100)    
                              div.style("opacity", 1)
                              .style("visibility", "visible"); 
                          d3.select(this)
                              .style("stroke", "black") 
                              .style("stroke-width",2)
                              .style("opacity", 1)  
                          div.html("State: " +'<strong>'+ (d.state)+"</strong>" + "<br/>"  + 
                            "Death by CVD: "+"<strong>"+d.value+"%"+"</strong>")  
                              .style("left", (d3.event.pageX+20) + "px")   
                              .style("top", (d3.event.pageY - 20) + "px");  
                          })
                      .on("mousemove",function(d) {    
                          // div.transition()    
                          //     .duration(100) 
                          d3.select(this)
                              .style("stroke", "black") 
                              .style("stroke-width",2)
                              .style("opacity", 1)     
                              div.style("opacity", 1)
                              // .style("visibility", "visible"); 

                          div.html("State: " +'<strong>'+ (d.state)+"</strong>" + "<br/>"  + 
                            "Death by CVD: "+"<strong>"+d.value+"%"+"</strong>" ) 
                              .style("left", (d3.event.pageX+20) + "px")   
                              .style("top", (d3.event.pageY -20) + "px");  
                          })          
                      .on("mouseout", function(d) {   
                          // div.transition()    
                          //     .duration(500)    
                              div.style("opacity", 0)
                            d3.select(this)
      .style("stroke", "none")
    .style("opacity", 0.8)}); 

  // add the x Axis
  svg.append("g")
  .attr("class", "axis")
      .attr("transform", "translate(0," + (height + margin.top + 25)+ ")")
      .call(d3.axisBottom(x));

  svg.append("text")             
              .attr("transform","translate(" + (margin.left + (width/2)) + " ," + (height + margin.bottom) + ")")
              .style("text-anchor", "middle")
              .text("Death by CVD (%)")
              .attr("font-size",14); 

  // add the y Axis
  svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y));
})

// </script>
// </body>