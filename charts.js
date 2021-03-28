function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

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
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    console.log(sampleData);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chosenID = sampleData.filter(selcID => selcID.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var resultSampleID = chosenID[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleValues = resultSampleID.sample_values;
    var otuID = resultSampleID.otu_ids;
    var otuLables = resultSampleID.otu_labels;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var yticks = otuID.sort((a,b) => a.otu_ids - b.otu_ids).reverse();
    // var yticksValues = yticks.slice(0,10);
    // console.log(yticksValues);
    // 8. Create the trace for the bar chart. 
   
    // bar chart
    var trace1 = {
      x: (Object.values((sampleValues.slice(0,10)).sort((a,b)=> a-b))
                          .map(num => parseInt(num))),
      y: (Object.values((otuID.slice(0,10)).reverse())
                          .map(str => String('OTU ' + str))),
      mode: 'markers',
      type: 'bar',
      name: 'bacterium IDs',
      text: ((otuLables.slice(0,10)).sort((a,b)=> a-b)),
      orientation:'h'
    };
   
    var barData = [trace1];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      xaxis: {
        title: 'Count of Unique Bacteria',
      },
      yaxis: {
        title: 'OTU ID',
        standoff: 60,
        type: 'category'
      },
      title:('Top 10 Bacteria Culture Found')
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // Use Plotly to plot the data with the layout. 
   
    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otuID,
      y: sampleValues,
      text: otuLables,
      mode: 'markers',
      marker: {
        color: otuID,
        size: (Object.values(sampleValues.map(num => parseInt(num)))),
        sizeref: 2.0 * Math.max(...sampleValues) / (20**2),
        sizemode: 'diameter'
      }
    };
    
  var bubbleData = [trace2];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    xaxis: {
      title: 'Bacteria Culture Per Sample',
      },
     yaxis: {
      title: 'Amount of Bacteria',
     },
    title: ('Relative Frequency of Bacterial Species'),
    showlegend: false,
    height: 600,
    width: 1200
    };
  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);


  
  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    xaxis: {
      title: 'Bacteria Culture Per Sample',
      },
     yaxis: {
      title: 'Amount of Bacteria',
     },
    title: ('Relative Frequency of Bacterial Species'),
    showlegend: false,
    height: 600,
    width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
   //Guage Chart
    // 4. Create the trace for the gauge chart.
    var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wfreqValue = result.wfreq;
    console.log("Inside Build Chart:"+wfreqValue)

    var guageData = [
      {
        domain: { 
          x: [0,1],
          y: [0,1]
        },
        title: {
          text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
          font:{
            color: "black"
          }
        },
        type: "indicator",
        mode: "gauge+number",
        value: wfreqValue,
        gauge: {
          shape: "angular",
          bar: {
            color: "black",
            thickness: .2
            },
          // bgcolor: "greenyellow",
          axis: {
            range: [0,10],
            tickmode: "linear",
            tick0: 0,
            dtick: 2,
            ticklen: 10,
            tickcolor: "black", 
            },
          steps:[
            {range:[0,2], color: 'rgb(255,0, 0)'},
            {range:[2,4], color: 'rgb(255,140,0)'},
            {range:[4,6], color: 'rgb(255,215,0)'},
            {range:[6,8], color: 'rgb(154,205,50)'},
            {range:[8,10], color: 'rgb(0,128,0)'},
          ],
        }
      }
    ];
// 5. Create the layout for the gauge chart.
var gaugeLayout = {width: 500,
      height: 350, 
      margin: { t: 0, b: 0 }
      };
// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot('gauge', guageData, gaugeLayout);
  });
}
