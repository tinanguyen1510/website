// <!-- 
// <!DOCTYPE html>
// <html lang="en">
//     <head>
//         <meta charset="utf-8">
//         <title>D3 Page Template</title>
//         <script src="https://d3js.org/d3.v5.js"></script>
//         <link rel="stylesheet" href="style.css">

//     </head>
// <body>
//   <select id="selectButton"></select>
//   <script type="text/javascript"> -->
          var margin = {top: 20, right: 50, bottom: 80, left: 100},
            width = 700 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var g = d3.select("#scatterplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

 var div1 = d3.select("#scatterplot").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0)
              .style("position", "absolute")
              .style("visibility", "hidden")
              .style("background-color", "white")
              .style("border", "solid")
              .style("border-width", "1px")
              .style("border-radius", "5px")
              .style("padding", "10px")
               .style("position", "absolute");


//Read the data
 d3.csv("riskdrop.csv").then(function(data) {

                //first format data by making the grades column into numeric value
                data.forEach(function(d) {
                        d.cvd = +d.cvd;
                        d.state = d.State;
                        d.pct = +d.pct;
                        });

    // List of groups (here I have one group per column)
    var allGroup = ["No Exercise","Few Fruit and Veg","Obesity","High Blood Pressure"];

    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);


 d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

    // Add X axis --> it is a date format
    var x_Scale = d3.scaleLinear()
       .domain([0, d3.max(data,function(d){ return d.pct;})])
      .range([ 0, width ]);

   x_Axis= g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_Scale));

      g.append("text")             
              .attr("transform","translate(" + ((width/2)) + " ," + (height + margin.top + 20) + ")")
              .style("text-anchor", "middle")
              .text("Value (%)")
              .attr("font-size",14); 

    // Add Y axis
    var y_Scale = d3.scaleLinear()
      .domain( [0,d3.max(data,function(d){ return d.cvd;})])
      .range([ height, 0 ]);
    y_Axis = g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y_Scale));

    g.append("text")
                .attr("text-anchor", "middle")  
                .attr("transform", "rotate(-90)")
                .attr("y", 0-margin.right)
                 .attr("x", 0 - (height / 2))
                .text("Death by CVD (%)")
                 .attr("font-size", 15);  


    // x.domain([0, d3.max(data,function(d){ return d.pct;})+1]);

    // Initialize dots with group a
    var dot = g
      .selectAll('circle')
      .data(data.filter(function(d){return d.risk==allGroup[0]}))
      .enter()
      .append('circle')
        .attr("cx", function(d) { return x_Scale(+d.pct) })
        .attr("cy", function(d) { return y_Scale(+d.cvd) })
        .attr("r", 7)
        .style("stroke",'black')
        .style("stroke-width",1)
        // .style("fill", "#69b3a2")
        .style("fill", function(d){ return myColor("valueA") })
        .on("mouseover", function(d) {    
                          // div1.transition()    
                          //     .duration(100)    
          div1.style("opacity", 1)
              .style("visibility", "visible"); 
          d3.select(this)
              .style("stroke", "black") 
              .style("stroke-width",2)
              .style("opacity", 1)  
              .attr("r",10)
              .style("fill","red")
              .style("cursor", "pointer")

          div1.html("State: " +'<strong>'+ (d.state)+"</strong>" + "<br/>"  + 
            "Death by CVD: "+"<strong>"+d.cvd+"%"+"</strong>"+ "<br/>"+
            "Population with No Exercise: " +'<strong>'+ (d.pct)+"%"+"</strong>")  
              .style("left", (d3.event.pageX) + "px")   
              .style("top", (d3.event.pageY - 10) + "px");  
            })
        .on("mousemove",function(d) {    
                // div1.transition()    
                //     .duration(100) 
          d3.select(this)
              .style("stroke", "black") 
              .style("stroke-width",2)
              .style("opacity", 1)  
              .attr("r",10)
              .style("fill","red") 
               .style("cursor", "pointer")  
              div1.style("opacity", 1)
             
              // .style("visibility", "visible"); 

          div1.html("State: " +'<strong>'+ (d.state)+"</strong>" + "<br/>"  + 
            "Death by CVD: "+"<strong>"+d.cvd+"%"+"</strong>"+ "<br/>"+
            "Population with No Exercise: " +'<strong>'+ (d.pct)+"%"+"</strong>")  
              .style("left", (d3.event.pageX) + "px")   
              .style("top", (d3.event.pageY -10) + "px");  
              })          
        .on("mouseout", function(d) {   
                // div1.transition()    
                //     .duration(500)    
          div1.style("opacity", 0)
          d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .attr("r",7)
            .style("stroke",'black')
            .style("stroke-width",1)
            .style("cursor", "default")
            .style("fill",function(d){ return myColor("valueA")})});

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
       var dataFilter = data.filter(function(d){return d.risk==selectedGroup})
       var xlim = d3.max(dataFilter,function(d){ return d.pct;})

    // Update X axis
      x_Scale.domain([3,xlim])
      x_Axis.transition().duration(1000).call(d3.axisBottom(x_Scale))
      

      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x_Scale(+d.pct) })
          .attr("cy", function(d) { return y_Scale(+d.cvd) })
          .style("fill", function(d){ return myColor(selectedGroup) });
          // .selectAll("circle")
      dot.on("mouseover", function(d) {    
                          // div1.transition()    
                          //     .duration(100)    
          div1.style("opacity", 1)
              .style("visibility", "visible"); 
          d3.select(this)
              .style("stroke", "black") 
              .style("stroke-width",2)
              .style("opacity", 1)  
              .attr("r",10)
              .style("fill","red")
              .style("cursor", "pointer")

          div1.html("State: " +'<strong>'+ (d.state)+"</strong>" + "<br/>"  + 
            "Death by CVD: "+"<strong>"+d.cvd+"%"+"</strong>"+ "<br/>"+
            "Population with Risk Factor: " +'<strong>'+ (d.pct)+"%"+"</strong>")  
              .style("left", (d3.event.pageX) + "px")   
              .style("top", (d3.event.pageY - 10) + "px");  
            })
        .on("mousemove",function(d) {    
                // div1.transition()    
                //     .duration(100) 
          d3.select(this)
              .style("stroke", "black") 
              .style("stroke-width",2)
              .style("opacity", 1)  
              .attr("r",10)
              .style("fill","red")  
              .style("cursor", "pointer") 
              div1.style("opacity", 1)

              // .style("visibility", "visible"); 

          div1.html("State: " +'<strong>'+ (d.state)+"</strong>" + "<br/>"  + 
            "Death by CVD: "+"<strong>"+d.cvd+"%"+"</strong>"+ "<br/>"+
             "Population with " + d.risk +": " +'<strong>'+ (d.pct)+"%"+"</strong>")  
              .style("left", (d3.event.pageX) + "px")   
              .style("top", (d3.event.pageY -10) + "px");  
              })          
        .on("mouseout", function(d) {   
                // div1.transition()    
                //     .duration(500)    
          div1.style("opacity", 0)
          d3.select(this)
            .style("stroke", "black")
            .style("stroke-width",1)
            .style("opacity", 0.8)
            .attr("r",7)
            .style("cursor", "default")
            .style("fill",function(d){ return myColor(selectedGroup)})});  
  }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})

