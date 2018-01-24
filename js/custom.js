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

            data.addColumn('string', 'Name');
 

            for (var i = 0; i < dataFromJSON.length; i++) {
                data.addRow([
                    dataFromJSON[i].first_name + ' ' + dataFromJSON[i].last_name,
 
                ]);
            };
            var dashboard = new google.visualization.Dashboard(
                document.getElementById('dashboard')
            );


            //Binding all charts/dashboard/controls
            dashboard.bind([]);
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


