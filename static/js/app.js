function init() {

  var selector = d3.select("#selDataset");
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample)
    buildMetadata(firstSample);
  });
}


function buildCharts(sample) {
    
    var url = `/samples/${sample}`;
    d3.json(url).then(function(data)
    {
        var xvalue=data.otu_ids;
        var yvalue=data.sample_values;
        var tvalue=data.otu_labels;
        var msize=data.sample_values;
        var mcolors=data.otu_ids;
                      
                      
        var trace_bubble={
            x: xvalue,
            y: yvalue,
            text: tvalue,
            mode: 'markers',
            marker:{
                size: msize,
                color: mcolors
                }
        };

            
        var trace_bubble_data= [trace_bubble];        
        var bubblelayout={axis:{title:"OTU ID"}};
        Plotly.newPlot('bubble',trace_bubble_data,bubblelayout);
        d3.json(url).then(function(data){

            var data= [{
                        values:data.sample_values.slice(0,10),
                        labels:data.otu_ids.slice(0,10),
                        hovertext:data.otu_labels.slice(0,10),
                        type: 'pie'
                        }];
            Plotly.newPlot('pie',data);
        
        });
    });
}

function buildMetadata(sample) {
   var url =  "/metadata/"+ sample;
    d3.json(url).then(function(sample){
        var sample_metadata= d3.select("#sample-metadata");
        sample_metadata.html(" ");
        Object.entries(sample).forEach(([key,value]) => {
            var row = sample_metadata.append("p");
            row.text(`${key}: ${value}`);
        });
    });
}

function optionChanged(newSample) {
  buildCharts(firstSample);
  //buildPieChart(newSample);
  //buildBubbleChart(newSample); 
  buildMetadata(newSample);
}   

init();
