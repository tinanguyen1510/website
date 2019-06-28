var div = d3.select("text").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
            // add a header
            // d3.select("#timeseries").append("h2").text("Top 10 Causes of death from 1999 to 2016");
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

            var timeParser = d3.timeParse("%Y");
            var formatDate = d3.timeFormat("%Y");
            // get the data
            d3.csv("causesbyyear.csv").then(function(data) {

                //first format data by making the grades column into numeric value
                data.forEach(function(d) {
                        d.year = (d.Year);
                        d.cause = d.Cause_name;
                        d.death = +d.Deaths;
                        // console.log(d.year);
                        });

    // var color = d3.scaleOrdinal()
    // .domain(10)
    // .range(d3.schemeSet2);
var color = d3.scaleOrdinal()
    .domain(10)
    .range([' #c06666','#1a1a1a',' #36627c','#4d1414','#b40d0d','#7e3674','#454085',' #005f04',
      ' #ab83ae','#686b00']);


    var svg = d3.select("#timeseries").append("svg")
    
    
    var x = d3.scaleBand()
                    .domain(data.map(function(d) { return d.year;}))
                    .range([0,width])
                    .padding(0.2);

   svg.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(" + margin.left + "," + height + ")")
              .call(d3.axisBottom(x));  
    svg.append("text")             
              .attr("transform","translate(" + (margin.left + (width/2)) + " ," + (height + margin.top + 16) + ")")
              .style("text-anchor", "end")
              .text("Years")
              .attr("font-size",14); 

    var y = d3.scaleLinear()
                  .domain([0, d3.max(data,function(d){ return d.death;})])
                  .rangeRound([height, 0]);  

    svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(d3.axisLeft(y).ticks(null, "s"));

    svg.append("text")
                .attr("text-anchor", "middle")  
                .attr("transform", "rotate(-90)")
                .attr("y", "3em")
                 .attr("dx", "-13em") 
                .text("Number of Deaths")
                 .attr("font-size", 15);     

    var line = d3.line()
                      .x(function(d) { return x(d.year); }) 
                      .y(function(d) { return y(d.death); });


    var svg = svg.append("g")
                  // .attr("class", "line")
                  .attr("transform", "translate(" + margin.left +", 0)");  

        dataNest = d3.nest()
        .key(function(d) {return d.cause;})
        .entries(data);

    legendSpace = width/dataNest.length+8; // space for legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {

        path = svg.append("path")
            .attr("class", "line")
            .style("stroke", function() {
                return d.color = color(d.key); })
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", line(d.values))
            // .style("stroke-dasharray", "10,3")
            .style("stroke-width", 2)
            .style("opacity",0.7)
            .on("click", function(){
              // Determine if current line is visable
              var active = d.active ? false : true,
              newOpacity = active ? 1 : 0;
              // Hide or show the elements based on the ID
              d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
                .transition().duration(200)
                .style("opacity", newOpacity);
              // Update whether or not the elements are active
              d.active = active
           })
          
            .on("mouseover", function(d) {
              d3.select(this).style("cursor", "pointer");},
            "mouseout", function(d) {
              d3.select(this).style("cursor", "default"); 
            });
            

        svg.append("rect")
              .attr("x", (legendSpace/2) + i*legendSpace-75)
              .attr("y",height + (margin.bottom/2) +35)
              .attr("width", 10)
              .attr("height", 10)
              .attr("fill",function() {
              return d.color = color(d.key); })
               .on("click", function(){
              // Determine if current line is visable
              var active = d.active ? false : true,
              newOpacity = active ? 1 : 0;
              // Hide or show the elements based on the ID
              d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
                .transition().duration(200)
                .style("opacity", newOpacity);
              // Update whether or not the elements are active
              d.active = active
           })
              .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer");},
              "mouseout", function(d) {
                d3.select(this).style("cursor", "default"); 
              });

   svg.append("text")
           .attr("x", (legendSpace/2) + i*legendSpace-60) // spacing
           .attr("y", height + (margin.bottom/2) + 45)
           .text(d.key)
           .attr("class", "legend")
           .attr("font-size",12)
           .on("click", function(){
              // Determine if current line is visable
              var active = d.active ? false : true,
              newOpacity = active ? 1 : 0;
              // Hide or show the elements based on the ID
              d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
                .transition().duration(200)
                .style("opacity", newOpacity);
                d3.select(this)
                .style("font-weight", function() {
                  if (active) {return "bolder"}
                })
              d.active = active})
           .on("mouseover", function(d) {
              d3.select(this).style("cursor", "pointer");},
            "mouseout", function(d) {
              d3.select(this).style("cursor", "default"); 
            });
           })

          //  .on("mouseover", function(){
          //     if (d.active != true) {
          //       d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
          //         .transition()
          //         .duration(50)
          //         .style("opacity", 1)
          //       d3.select(this)
          //         .transition()
          //         .duration(50)
          //         .style("font-size", function() {
          //           if (d.active != true) {return "20px"} 
          //         })
          //         ;
          //     }
          // //Get this bar's x/y values, then augment for the tooltip
          // var xPosition =  legendSpace/2 + i*legendSpace // spacing
          // var yPosition = height + (margin.bottom/2) + 5;
          // //Update the tooltip position and value
          // d3.select("#tooltip")
          //   .style("left", xPosition + "px")
          //   .style("top", yPosition - 30 + "px")
          //   .select("#value")

          //   .text( d.key ) ;

          // //Show the tooltip
          // d3.select("#tooltip").classed("hidden", false);

          // })
          // .on("mouseout", function() {
          //   if(d.active != true) {
          //       d3.selectAll("#tag"+d.key.replace(/\s+/g, ''))
          //         .transition()
          //         .duration(1000)
          //         .style("opacity", 0)
          //       d3.select(this)
          //         .transition()
          //         .duration(1000)
          //         .style("font-size", function() {
          //           return "16px"
          //         }
          //         )}
          // //Hide the tooltip
          // d3.select("#tooltip").classed("hidden", true);

          // })
          // .text(d.key);

    });

 

   
