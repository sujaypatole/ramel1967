(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "last_update",
            alias: "last_update",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "new_cases",
            alias: "new_cases",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "new_deaths",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "new_recovered",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "new_cases_percentage",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "new_deaths_percentage",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "new_recovered_percentage",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "worldCovidFeed",
            alias: "World COVID-19 Feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        //$.getJSON("https://search.worldbank.org/api/v2/projects?format=json&fl=regionname,countryname,location,projectfinancialtype&source=IBRD&rows=10", function(resp) {
        $.getJSON("https://covid19-api.org/api/diff", function(resp) {
            var feat = resp.data,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "country": feat[i].country,
                    "last_update": feat[i].last_update,
                    "new_cases": feat[i].new_cases,
                    "new_deaths": feat[i].new_deaths,
                    "new_recovered": feat[i].new_recovered,
                    "new_cases_percentage": feat[i].new_cases_percentage,
                    "new_deaths_percentage": feat[i].new_deaths_percentage,
                    "new_recovered_percentage": feat[i].new_recovered_percentage
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            // tableau.connectionName = "World Bank Data API"; // This will be the data source name in Tableau
            tableau.connectionName = "COVID 19 API"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
