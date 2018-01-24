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
           

            console.log(data);

            //Binding all charts/dashboard/controls
            dashboard.bind([namePicker, agePicker, heightPicker], [scatterChart, columnChart]);
            // Draw Dashboard
            dashboard.draw(data);

        },
        error: function (errorFromJSON) {
            console.log('Something went wrong, cannot connect to server!');
            console.log(errorFromJSON);
            alert('Something went wrong, cannot connect to server!');
        },
    })
};



