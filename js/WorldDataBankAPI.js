(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "countryname",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "regionname",
            alias: "regionname",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "projectfinancialtype",
            alias: "projectfinancialtype",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "location",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "worldBankFeed",
            alias: "World Bank Feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://search.worldbank.org/api/v2/projects?format=json&fl=regionname,countryname,location,projectfinancialtype&source=IBRD&rows=100", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "countryname": feat[i].countryname,
                    "regionname": feat[i].regionname,
                    "projectfinancialtype": feat[i].projectfinancialtype,
                    "location": feat[i].location
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
            tableau.connectionName = "World Bank Data API"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
