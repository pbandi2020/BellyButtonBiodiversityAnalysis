function init() {
    var selector = d3.select("#selDataset");
    //load samples.json into the console
    d3.json("samples.json").then((data) => {
        console.log(data);
        
        var sampleNames = data.names;
        
        sampleNames.forEach(sample => {
            selector.append("option")
                    .text(sample)
                    .property("value", sample);
            
        });

    });
};

function optionChanged(newSample){
    console.log(newSample);
    buildMetadata(newSample);
    // buildCharts(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        console.log(result);

        PANEL.html("");
        // PANEL.append("h6").text("ID:" + result.id);

        Object.entries(result).forEach(value =>
            {console.log(value);});
       
        Object.entries(result).forEach(([k,v]) => 
           {PANEL.append("h6").text(k+":"+v)});

    });
};
init();