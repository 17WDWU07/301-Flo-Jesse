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
                    dataFromJSON[i].firstName + ' ' + dataFromJSON[i].lastName,
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

            var scatterChart = new google.visualization.ChartWrapper({
                title: 'Class age vs height',
                chartType: 'ScatterChart',
                containerId: 'scatterChart',
                legend: 'none',
                view: { columns: [4, 7]},
                options:{
                    colors: ['black'],
                    backgroundColor: { fill: 'transparent' },
                    width: '100%',
                    height: '100%',
                    hAxis: { 
                        title: 'Age' 
                    },
                    vAxis: { 
                        title: 'Height' 
                    }
                }
                
            });

            var agePicker = new google.visualization.ControlWrapper({
                controlType: 'NumberRangeFilter',
                containerId: 'barChart',

                options: {
                    filterColumnLabel: 'Age',
                    ui: {
                        labelStacking: 'vertical'
                    }
                }
            });

            console.log(data);

            //Binding all charts/dashboard/controls
            dashboard.bind([agePicker], [scatterChart]);
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



