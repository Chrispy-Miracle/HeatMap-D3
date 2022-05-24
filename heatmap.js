// const dataset = [[1995, 1, 8.5],[1846, 3, 7.5],[1900, 5, 9.5]]
const h = 550;
const w = 1250;
const padding = 60;
const colors= ["blue", "lightblue", "orange", "red"]

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url)
  .then((data) => callback(data))
  .catch((err) => console.log(err));



function callback(data) {
//   console.log('data: ', data);

//   data.monthlyVariance.forEach(function (val) {
//     val.month -= 1;
//   });

d3.select("body")
    .style("background", "skyblue")
    .style("color", "darkblue")
    .append("h1")
    .attr("id", "title")
    .style("padding", "10px")
    .text("Monthly Global Land-Surface Temperature")
    .style("text-align", "center")
    .style("word-wrap", "breakword")
    .style("width", "100vw")
    .style("text-shadow", "1px 1px 1px white")

d3.select("body")
    .append("h2")
    .attr("id", "description")
    .text("1753 - 2015: base temperature 8.66℃")
    .style("text-shadow", "1px 1px 1px white")

    d3.select("body")
    .append("h3")
    .text("Legend: Degrees of Variation")    
    .style("margin-top", "30px")
    // .style("position", "absolute")
    // .style("top", "675px")
    // .style("left", "235px")
    .style("text-shadow", "1px 1px 1px white");

  const legend = d3.select("body")
    .append("svg")
    // .style("position", "absolute")
    // .style("top", "680px")
    // .style("left", "230px")
    .attr("id", "legend")
    .style("height", "90px")
    .style("width", "290px")
    .style("border", "1px solid black")
    .style("background", "beige");

    
  const legendScale = d3.scaleLinear(colors)
    .domain([-2,2])
    .range([40,165])
  
  const legendAxis = d3.axisBottom(legendScale).ticks(4);
    
  legend.append("g")
      .attr("transform", "translate(35, 60)")
      .call(legendAxis);

 

  legend.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("height", "30")
    .attr("width", "30")
    .attr("x", (d,i)=> (70+ i* 35) + "px")
    .attr("y", "30px")
    .attr("fill", (d)=> d)
    .style("stroke", "black")
    .style("border", "1px solid black")
    .append("title")
    .text((d, i)=>i== 0 ? "More than 1℃ less than average" : i==1 ? "Between 0 and 1℃ less than average" : i==2 ? "Between 0 and 1℃ degree more than average" : "More than 1℃ above average")


const svg = d3.select("body")
    .append("svg")
    .attr("id", "mainsvg")
    .style("background", "beige")
    .attr("height", h)
    .attr("width", w)
    .style("padding", padding)
    .style("margin", "30px")
    .style("border", "1px solid black")
    .style("border-radius", "10px")

const dataSlice = data.monthlyVariance

const xScale = d3.scaleTime(dataSlice)
  .domain([new Date(d3.min(dataSlice, (d)=>d.year),0), new Date(d3.max(dataSlice, (d)=> d.year),0)])
  .range([padding, w-padding]);

const yScale = d3.scaleTime(data)
    .domain([12, 1])
    .range([padding, h- 3*padding]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale).tickFormat(function (month) {
    var date = new Date(0);
    date.setUTCMonth(month);
    var format = d3.timeFormat('%B');
    return format(date);
  });

svg.append("g")
  .attr("transform", "translate(0, " + (h-2.8*padding) + ")")
  .attr("id", "x-axis")
  .style("padding-bottom", "100px")
  .call(xAxis);

  svg.append("g")
  .attr("transform", "translate(" + padding + ", -10)")
  .attr("id", "y-axis")
  .call(yAxis);


const tooltip = 
d3.select("body")
    .data(dataSlice)
    .enter()
    .append("div")
    .attr("id", "tooltip")
    .style("padding", " 10px")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "lightgrey")
    .style("border", "1px solid black")
    .style("border-radius", "10px")
    .attr("data-year", (d)=>d.year) 
    .attr("data-month", (d)=>d.month)
    .attr("data-temp", (d)=>d.variance + data.baseTemperature)
    .style("line-height", "1.5");

// function monthNums() { switch(num) {
//         case 1: return "January";
//         default: "none";
//     }}
console.log(dataSlice[0].month);
svg.selectAll("rect")
    .data(dataSlice)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", (d)=>d.year)
    .attr("data-month", (d)=>d.month-1)
    .attr("data-temp", (d)=>(d.variance + data.baseTemperature).toFixed(3))
    .attr("data-vari", (d)=>d.variance)
    .attr("height", "35px")
    .attr("width", w/(dataSlice.length/12))
    .attr("x", (d)=>xScale(new Date(d.year, 0)))
    .attr("y", (d)=> yScale(d.month+1))
    .attr("fill", function(d){if(d.variance>1){return "red"}else if (d.variance<=1 && d.variance >= 0){return"orange"}else if (d.variance < 0 && d.variance > -1){return "lightblue"}else {return "blue"}})
    .on("mouseover", function(d){
        var year = this.getAttribute('data-year');
        var monthNum = this.getAttribute("data-month");
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var temp = this.getAttribute("data-temp");
        var vari = this.getAttribute("data-vari")
        tooltip.style("visibility", "visible")
          .html(months[monthNum] + " of " + year + ":<br>" + temp + " ℃ <br> Variance: " + vari)
          .attr("data-year", year) 
          .attr("data-month", monthNum)
          .attr("data-temp", (d)=>d.variance + data.baseTemperature)})
    .on("mousemove", function(e){
      return tooltip.style('left', (e.pageX+10) + "px").style('top', (e.pageY+10) + 'px')
        ;})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");}); 
 


}
