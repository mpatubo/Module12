function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log (data)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var sampleArrays = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredsampleArray = sampleArrays.filter (sampleObj => sampleObj.id === sample)

    //  5. Create a variable that holds the first sample in the array.
    var result = filteredsampleArray[0]; 
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels
    var sample_values =  result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    

  // var top10 = sample.slice(0,10);
    //var top10_otu_ids = top10.map(sample=> 'OTU ${sample.otu_ids}');
    //var top10_otu_labels = top10.map(sample=>sample.otu_labels);
    //var top10_sample_values= top10.map(sample=>sample.sample_values);
    //var yticks = top10_otu_ids;

    //Bar Charts

    var yticks = otu_ids.slice(0,10).map(id=> `OTU ${id}`).reverse();
    // 8. Create the trace for the bar chart. 
    var trace = {
      //x: top10_sample_values,
      x: sample_values.slice(0,10).reverse(),
      y: yticks, 
      text: otu_labels.slice(0.10).reverse(),
      type: "bar",
      orientation: 'h'
    };
    var barData = [trace];
      
    
    // 9. Create the layout for the bar chart. 
    //hover text is the otu_labels in descending order.
    var layout = {
      tite: "Top 10 Bacteria Cultures Found", 
      margin: {t: 20, l: 110}
      //xaxis: [title: "sample_values"]
      //yaxis: [tite: "otu_ids"],
      //text: "otu_labels",
    
    };
     
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, layout); 


   

   // Bubble Chart

    // 1. Create the trace for the bubble chart.
   
    var trace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      marker: {  
        size: sample_values,
        colors: otu_ids},
    mode: "markers"
      
    }];
  
    


    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      tite: "Bacteria Culture Per Sample",
      text: otu_labels,
      yaxis: {title: "sample_values"},
      xaxis: {title: "otu_ids"},
      height: 500,
      width: 850
      
    };
    Plotly.newPlot("bubble", trace, bubbleLayout); 


    // 3. Use Plotly to plot the data with the layout.
    //Plotly.newPlot("bar-plot", data, layout); 
    
    //Gauge Chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.

// 4. Create the trace for the gauge chart.

    var frequency = result.wfreq
    var degree = (18 * frequency)
    var radius = 1.5
    var radians = degree*Math.PI/180
    var x = radius - (radius*Math.cos(radians))
    var y = radius * Math.sin(radians)
    

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1]},
        value: frequency, 
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
  
        mode: "gauge+number",
        axis: {range: [null, 9]}

    }]; 
     
      
      
      
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {shapes: [{type: "line", 
      x0:.5, 
      y0: .1, x1: x, y1:y,
      line: {color: "red", 
      width: 3}}],
      width: 600, height: 500, margin: { t: 0, b: 0 }, 
      xaxis: {visible: false, range: [-1, 1]},
      yaxis: {visible: false, range: [-1, 1]}
     
    };

//gauge---var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
//Plotly.newPlot('myDiv', data, layout);


   // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

   

//   });
// }
