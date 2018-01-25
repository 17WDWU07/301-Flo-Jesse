//Load chart packages and controls
google.charts.load('current', { 'packages': ['corechart', 'controls'] });
//Run the function drawDashboard
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard() {

    $.ajax({
        url: 'js/data.json',
        dataType: 'json',
        success: function (dataFromJSON) {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Id');
            data.addColumn('string', 'Name');
            data.addColumn('string', 'Gender');
            data.addColumn('string', 'Country');
            data.addColumn('number', 'Age');
            data.addColumn('string', 'Working Status');
            data.addColumn('string', 'Eye Colour');
            data.addColumn('number', 'Height');
            data.addColumn('number', 'Multilingual');
            data.addColumn('number', 'Siblings');
 

            for (var i = 0; i < dataFromJSON.length; i++) {
                data.addRow([
                    dataFromJSON[i].id,
                    dataFromJSON[i].firstName,
                    dataFromJSON[i].gender,
                    dataFromJSON[i].countryVisit,
                    dataFromJSON[i].age,
                    dataFromJSON[i].workingStatus,
                    dataFromJSON[i].eyeColor,
                    dataFromJSON[i].height,
                    dataFromJSON[i].multilingual,
                    dataFromJSON[i].siblings
                ]);
            };

            var dashboard = new google.visualization.Dashboard(
                document.getElementById('dashboardContainer')
            );

            // Scatter Chart 
            var scatterChart = new google.visualization.ChartWrapper({
                chartType: 'ScatterChart',
                containerId: 'scatterChart',

                options:{
                    // title: 'Age vs Height',
                    width: '95%',
                    height: '95%',
                    legend: 'none',
                    colors: ['#cfe4f8'],
                    backgroundColor: { 
                        fill: 'transparent' 
                    },
                    hAxis: { 
                        title: 'Age',
                        gridlines: {
                            color: '#fff'
                        },
                        textStyle: {
                            color: 'white'
                        },
                    },
                    vAxis: { 
                        title: 'Height',
                        gridlines: {
                            color: '#fff'
                        },
                        textStyle: {
                            color: 'white'
                        },
                    }
                },
                view: {
                    columns: [4, 7]
                }   
            });

            // Column Chart
            var columnChart = new google.visualization.ChartWrapper({
                chartType: 'ColumnChart',
                containerId: 'columnChart',

                options: {
                    // title: 'Height Differences',
                    width: '95%',
                    height: '95%',
                    legend: 'none',
                    colors: ['#cfe4f8'],
                    backgroundColor: {
                        fill: 'transparent'
                    },
                    hAxis: {
                        title: 'Age',
                        gridlines: {
                            color: '#fff'
                        },
                        textStyle: {
                            color: 'white'
                        },
                    },
                    vAxis: {
                        title: 'Height',
                        gridlines: {
                            color: '#fff'
                        },
                        textStyle: {
                            color: 'white'
                        },
                    }
                },
                view: {
                    columns: [1, 7]
                }
            });

            
            
            var countryPicker = new google.visualization.ControlWrapper({
                controlType: 'CategoryFilter',
                containerId: 'control1',
                options: {
                    filterColumnLabel: 'Country',
                    ui: {
                        allowMultiple: false,
                        allowTyping: false,
                        labelStacking: "vertical",
                        allowNone: true
                    }
                }
            });

            var agePicker = new google.visualization.ControlWrapper({
                controlType: 'NumberRangeFilter',
                containerId: 'control2',
                options:{
                    filterColumnLabel: 'Age',
                    ui: {
                        labelStacking: "vertical"
                    }
                }
            });
            
            var heightPicker = new google.visualization.ControlWrapper({
                controlType: 'NumberRangeFilter',
                containerId: 'control3',
                options: {
                    filterColumnLabel: 'Height',
                    ui: {
                        labelStacking: "vertical"
                    }
                }
            });

            //Binding all charts/dashboard/controls
            dashboard.bind([countryPicker, agePicker, heightPicker], [scatterChart, columnChart]);
            // Draw Dashboard
            dashboard.draw(data);

            // Invokation of GeoChart
            drawGeo(dataFromJSON);

            // Geo Chart Filter Interactions
            google.visualization.events.addListener(countryPicker, 'statechange', function () {
                prepareData();
            });
            google.visualization.events.addListener(agePicker, 'statechange', function () {
                prepareData();
            });
            google.visualization.events.addListener(heightPicker, 'statechange', function () {
                prepareData();
            });

            function prepareData(){
                var countryChoices = countryPicker.getState();
                var value = countryChoices.selectedValues[0];
                var ageRange = agePicker.getState();
                var heightRange = heightPicker.getState();

                var view = new google.visualization.DataView(data);

                var filters = [
                    {
                        column: 4,
                        minValue: ageRange.lowValue,
                        maxValue: ageRange.highValue
                    },
                    {
                        column: 7,
                        minValue: heightRange.lowValue,
                        maxValue: heightRange.highValue
                    }
                ];

                if (countryChoices.selectedValues.length > 0) {
                    filters.push({
                        column: 3,
                        value: value
                    })
                }

                view.setRows(data.getFilteredRows(filters));
                var filteredcountry = view.ol;
                var newcountryData = [];


                for (let i = 0; i < filteredcountry.length; i++) {
                    newcountryData.push(dataFromJSON[filteredcountry[i]]);
                }

                drawGeo(newcountryData);
            }



        },
        error: function (errorFromJSON) {
            alert('Something went wrong, cannot connect to server!');
        },
    })
};

// Geo Chart Function
function drawGeo(data) {
    var geoChart = new google.visualization.DataTable();
    geoChart.addColumn('string', 'Country');
    geoChart.addColumn('number', 'Count');

    var countryArray = [];
    var count = [];
    
    for (var i = 0; i < data.length; i++) {
        var key = data[i].countryVisit;
        if (countryArray.indexOf(key) >= 0) {
            count[countryArray.indexOf(key)]++;
        } else {
            countryArray.push(key);
            count.push(1);
        }
    }

    for (var i = 0; i < countryArray.length; i++) {
        geoChart.addRow([countryArray[i], count[i]])
    };

    var options = {
        // title: "Counrtry Most Wanted to Visit",
        colorAxis: { 
            colors: ['#96b7d8', '#1e76ce'] 
        },
        backgroundColor: {
            fill: 'transparent',
            color: 'white'
        }
    };

    var Geo = new google.visualization.GeoChart(document.getElementById('geoChart'));
    Geo.draw(geoChart, options);
}
   




