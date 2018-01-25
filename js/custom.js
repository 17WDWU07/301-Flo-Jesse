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

            // Invokation of Charts

            drawGeo(dataFromJSON);
            genderPie(dataFromJSON);
            eyeColorPie(dataFromJSON);
            workingPie(dataFromJSON);

            // genderPie chart w age slider
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
                console.log('age w pie test slider')
                genderPie(newData);
            });

            // eyeColorPie w age slider
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
                console.log(' eye colour test slider')
                eyeColorPie(newData);
            });

            // employmentPie w age slider
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
                console.log('employment slider')
                workingPie(newData);
            });

            // genderPie w height slider
            google.visualization.events.addListener(heightPicker, 'statechange', function(){
                var range = heightPicker.getState();
                var view = new google.visualization.DataView(data);
                view.setRows(data.getFilteredRows([
                {
                    column: 7,
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
                console.log(' eye colour test')
                genderPie(newData);
            });

            // eyeColorPie w height slider
            google.visualization.events.addListener(heightPicker, 'statechange', function(){
                var range = heightPicker.getState();
                var view = new google.visualization.DataView(data);
                view.setRows(data.getFilteredRows([
                {
                    column: 7,
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
                console.log(' eye colour test')
                eyeColorPie(newData);
            });

            // workingPie w height slider
            google.visualization.events.addListener(heightPicker, 'statechange', function(){
                var range = heightPicker.getState();
                var view = new google.visualization.DataView(data);
                view.setRows(data.getFilteredRows([
                {
                    column: 7,
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
                console.log(' eye colour test')
                workingPie(newData);
            });

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
        // pieSliceText: 'none',

        colors:[ 'white', '#FFB9F0'],
        pieHole: .9,
        backgroundColor: {
            fill: 'transparent'
        }
    };

var pie = new google.visualization.PieChart(document.getElementById('donutChart1'));

pie.draw(dataGender, options);

console.log('pie test')
}

// eyeColor pie chart
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
        pieHole: .9,
        colors:[ '#B9E9FF', '#F6BC4F', '#8BD055', '#D07928'],

        sliceVisibilityThreshold: .2,
        backgroundColor: {
            fill: 'transparent',

        }
    };

var pie = new google.visualization.PieChart(document.getElementById('donutChart2'));

pie.draw(dataColour, options);

console.log('eye test')
}

// Employment pie chart
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

    dataWork.addRow(["Unemployed", notWorking]);
    dataWork.addRow(["Casual", casual]);
    dataWork.addRow(["Part-time", partTime]);

    var options = {
        title: "Employment",
        // pieSliceText: 'label',
        pieHole: .9,
        backgroundColor: {
            fill: 'transparent'
        }
    };

var pie = new google.visualization.PieChart(document.getElementById('donutChart3'));

pie.draw(dataWork, options);

console.log('work test')
}



