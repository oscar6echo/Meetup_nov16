
// utilities --------------------------------------------------------------------

window.nl = '<br/>';



// Primes --------------------------------------------------------------------

function getFactor(n) {
    if (n<1) throw "Argument error";
    if (n%4==0) return 4; // modif for nicer plots
    if (n%2==0) return 2;
    for (var i=3; i<=Math.floor(Math.sqrt(n)); i+=2) {
        if (n%i==0) return i;
    }
    return n;
}

function primeFactors(n) {
    if (n==1) return [1];
    var result = [];
    while (n>1) {
        var factor = getFactor(n);
        result.push(factor);
        n /= factor;
    }
    return result;
}

function printFactors(factors) {
    var string = "";
    if (factors.length==1) {
         string = factors[0]==4 ? "2 × 2" : "prime";
         return string;
    }
    factors.forEach(function(factor) {
        string += factor==4 ? "2 × 2" : factor;
        string += " × ";
    });
    return string.slice(0, -2);
 }


window.getFactor = getFactor;
window.primeFactors = primeFactors;
window.printFactors = printFactors;



// Draw Points --------------------------------------------------------------------


function createPoint(r, x, y) {
    var point = { r: r, x: x, y: y };
  return point;
}

function radius_max(n) {
    return 0.5*Math.sqrt(Math.pow(Math.cos(2*Math.PI/n)-1, 2)
                         +Math.pow(Math.sin(2*Math.PI/n), 2));
}

function generatePoints(factors) {
    var parentPoints = [];
    var points = [];
    var a, x, y, phi, point;
    var n = 1;
    var rs = 2.0,
        ru, rc, rm;
    var fs = 0.95,
        fc = 0.90;
    var theta;
//     ru = 1.0;
     
    if ((factors.length==1) && (factors[0]==1)) {
        return [createPoint(1.5, 0, 0)];
    }
        
    while (factors.length) {
        //ru *= 1/n;
        //r *= 1/n;
        
        n = factors.pop();
        theta = 2*Math.PI/n;
        
        rc = fc*rs;
        rm = radius_max(n);
        ru = rc/(1+rm);
        rs = fc*ru*rm;

        phi = n===4 ? Math.PI/4 : n===2 ? 0 : Math.PI/2;

        if (!points.length) {
            d3.range(n).forEach(function(i) {
                a = i*theta+phi;
                x = Math.cos(a)*ru;
                y = Math.sin(a)*ru;
//                 console.log('x='+x+', y='+y+', r='+rs);
                points.push(createPoint(rs, x, y));
            });
            //console.table(points);
        }
        
        else {
            parentPoints = points.slice();
            points = [];
            parentPoints.forEach(function(parentPoint) {
                d3.range(n).forEach(function(i) {
                    a = i*theta+phi;
                    x = parentPoint.x+Math.cos(a)*ru;
                    y = parentPoint.y+Math.sin(a)*ru;
//                     console.log('x='+x+', y='+y+', r='+rs);
                    point = createPoint(rs, x, y);
                    points.push(point);
                });
            })
        }
    }
    
    return points;
}

window.generatePoints = generatePoints;




// Update --------------------------------------------------------------------


function update(pos) {
    pos==1 ? vis.number ++ : vis.number > 1 ? vis.number-- : vis.number;
    vis.factors = primeFactors(vis.number);

    vis.trackerNumber.text(vis.number);
    vis.trackerFactors.text(printFactors(vis.factors));

    vis.points = generatePoints(vis.factors); // create new points
    var point = vis.svg.selectAll(".point").data(vis.points);
    
    
    vis.colorScale = d3.scale.linear()
//         .domain([0, vis.points.length])
//         .range(["#1f77b4", "#d62728"]);
        .domain([0, vis.points.length/2, vis.points.length])
        .range(["#1f77b4", "#756bb1", "#d62728"]);
             
    point.enter()
        .append("svg:circle").classed("point", true)
        .attr("r", 0)
        .transition().duration(vis.speed*vis.ratio)
        .attr("r", function(d) { return vis.scaleR(d.r); })
        .attr("cx", function(d) { return vis.scaleX(d.x); })
        .attr("cy", function(d) { return vis.scaleY(d.y); })
        .attr("fill", function(d, i) { return vis.colorScale(i); });
 
    point.transition().duration(vis.speed*vis.ratio)
        .attr("r", function(d) { return vis.scaleR(d.r); })
        .attr("cx", function(d) { return vis.scaleX(d.x); })
        .attr("cy", function(d) { return vis.scaleY(d.y); })
        .attr("fill", function(d, i) { return vis.colorScale(i); });
 
    point.exit()
        .transition().duration(vis.speed*vis.ratio)
        .attr("r", 0)
        .remove();
}

window.update = update;




// Update --------------------------------------------------------------------


function zoom() {
    vis.svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function init() {
    vis.factors = primeFactors(vis.number);
    vis.points = generatePoints(vis.number);
    vis.scaleR = d3.scale.linear().domain([0, 2]).range([0, vis.size/2]);
    vis.scaleX = d3.scale.linear().domain([-2, 2]).range([0, vis.size]);
    vis.scaleY = d3.scale.linear().domain([-2, 2]).range([vis.size, 0]);
 
    vis.svg_number = d3.select("#number")
        .append("svg")
        .attr("width", vis.size)
        .attr("height", 60)
        .append("g")
        .attr("transform", "translate(" + [vis.size/2, 60/2] + ")");

    vis.trackerNumber = vis.svg_number
        .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", "30px")
        .attr("fill", "gray");
 
    vis.trackerFactors = vis.svg_number
        .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 20)
        .attr("font-size", "14px")
        .attr("fill", "gray");
    
    vis.svg = d3.select("#vis")
        .append("svg")
        .attr("width", vis.size)
        .attr("height", vis.size)
        .attr("style", "border: 1px solid gray; fill: none; pointer-events: all;")
        .call(d3.behavior.zoom().scaleExtent([1.0, 100]).on("zoom", zoom))
        .append("g");
        
    d3.select("#forward").on("click", function() {
        vis.way = +1;
        clearInterval(window.interval);
        window.interval = setInterval(update, vis.speed, vis.way);
    });
    
    d3.select("#backward").on("click", function() {
        vis.way = -1;
        clearInterval(window.interval);
        window.interval = setInterval(update, vis.speed, vis.way);
    });
        
    d3.select("#stop").on("click", function() {
        clearInterval(window.interval);
    });
        
    d3.select("#slower").on("click", function() {
        vis.speed /= 0.7; 
        clearInterval(window.interval);
        window.interval = setInterval(update, vis.speed, vis.way);
    });
        
    d3.select("#faster").on("click", function() {
        clearInterval(window.interval);
        vis.speed *= 0.7; 
        window.interval = setInterval(update, vis.speed, vis.way);
    });
        
    d3.select("#resetspeed").on("click", function() {
        clearInterval(window.interval);
        vis.speed = vis.speedinit; 
        window.interval = setInterval(update, vis.speed, vis.way);
    });
        
    d3.select("#search").on("click", function() {
        console.log(document.getElementById("inputNumber").value);
        vis.number = eval(document.getElementById("inputNumber").value) - 1;
        clearInterval(window.interval);
        update(+1);
    });
}

window.init = init;

