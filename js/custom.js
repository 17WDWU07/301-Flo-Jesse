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
                    title: 'Age vs Height',
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
                    title: 'Height Differences',
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

            var namePicker = new google.visualization.ControlWrapper({
                controlType: 'CategoryFilter',
                containerId: 'control1',
                options: {
                    filterColumnLabel: 'Name',
                    ui: {
                        allowMultiple: false,
                        allowTyping: false,
                        labelStacking: "vertical"
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
            dashboard.bind([namePicker, agePicker, heightPicker], [scatterChart, columnChart]);
            // Draw Dashboard
            dashboard.draw(data);
            genderPie(dataFromJSON);
            eyeColorPie(dataFromJSON);
            workingPie(dataFromJSON);

            // gender pie chart w age slider
            google.visualization.events.addListener(agePicker, 'statechange', function(){
                var range = agePicker.getState();
                var view = new google.visualization.DataView(data);
                view.setRows(data.getFilteredRows([
                {
                    column: 4,
                    minValue: range.lowValue, 
                    maxValue: range.highValue
                }
                ]));
                console.log(view);

                var filteredRows = view.ol;
                var newData = [];
                for (var i = 0; i < filteredRows.length; i++) {
                    newData.push(dataFromJSON[filteredRows[i]]);
                };
                console.log('age w pie test')
                genderPie(newData);
            });


        },
        error: function (errorFromJSON) {
            console.log('Something went wrong, cannot connect to server!');
            console.log(errorFromJSON);
            alert('Something went wrong, cannot connect to server!');
        },
    })
};

// Gender pie chart
function genderPie(data){
    var dataGender = new google.visualization.DataTable();
    dataGender.addColumn('string', 'Gender');
    dataGender.addColumn('number', 'Count');

    var male = 0, female = 0;
    for (var i = 0; i < data.length; i++) {
        if(data[i].gender == "male"){
            male++;
        } else if (data[i].gender == "female"){
            female++;
        }
    }

    console.log(male);
    console.log(female);

    dataGender.addRow(["Male", male]);
    dataGender.addRow(["Female", female]);

    var options = {
        title: "Gender",
        // pieSliceText: 'label',
        colors:[ 'white', '#FFB9F0'],
        pieHole: .7,
        backgroundColor: {
            fill: 'transparent'
        }
    };

var pie = new google.visualization.PieChart(document.getElementById('donutChart1'));

pie.draw(dataGender, options);

console.log('pie test')
}

function eyeColorPie(data){
    var dataColour = new google.visualization.DataTable();
    dataColour.addColumn('string', 'Eye Colour');
    dataColour.addColumn('number', 'Count');

    var blue = 0, hazel = 0, green = 0, brown = 0;
    for (var i = 0; i < data.length; i++) {
        if(data[i].eyeColor == "blue"){
            blue++;
        } else if (data[i].eyeColor == "hazel"){
            hazel++;
        } else if (data[i].eyeColor == "green"){
            green++;
        } else if (data[i].eyeColor == "brown"){
            brown++;
        }
    }

    console.log(blue);
    console.log(hazel);
    console.log(green);
    console.log(brown);

    dataColour.addRow(["blue", blue]);
    dataColour.addRow(["hazel", hazel]);
    dataColour.addRow(["green", green]);
    dataColour.addRow(["brown", brown]);

    var options = {
        title: "Eye colour",
        // pieSliceText: 'label',
        pieHole: .5,
        colors:[ '#B9E9FF', '#F6BC4F', '#8BD055', '#D07928'],
        // backgroundColor.strokeWidth: 0,
        // pieSliceBorderColor: 'transparent',
        sliceVisibilityThreshold: .2,
        backgroundColor: {
            fill: 'transparent',
            // strokeWidth: 1
        }
    };

var pie = new google.visualization.PieChart(document.getElementById('donutChart2'));

pie.draw(dataColour, options);

console.log('eye test')
}

function workingPie(data){
    var dataWork = new google.visualization.DataTable();
    dataWork.addColumn('string', 'workingStatus');
    dataWork.addColumn('number', 'Count');

    var notWorking = 0, casual = 0, partTime = 0;
    for (var i = 0; i < data.length; i++) {
        if(data[i].workingStatus == "not working"){
            notWorking++;
        } else if (data[i].workingStatus == "Casual"){
            casual++;
        } else if (data[i].workingStatus == "Part-time"){
            partTime++;
        }
    }

    console.log(notWorking);
    console.log(casual);
    console.log(partTime);

    dataWork.addRow(["not working", notWorking]);
    dataWork.addRow(["Casual", casual]);
    dataWork.addRow(["Part-time", partTime]);

    var options = {
        title: "Employment",
        // pieSliceText: 'label',
        pieHole: .7,
        backgroundColor: {
            fill: 'transparent'
        }
    };

var pie = new google.visualization.PieChart(document.getElementById('donutChart3'));

pie.draw(dataWork, options);

console.log('work test')
}



