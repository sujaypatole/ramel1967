//To start node js use -- npm run http-server from E:\NiSh_Data_Solutions\Projects\Fiverr\Ramal_02_Feb_2021\repo
(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "countryname",
            alias: "Country name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "regionname",
            alias: "Region",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "projectfinancialtype",
            alias: "Project financial type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "project_name",
            alias: "Project name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "location",
            alias: "Project link",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "boardapprovaldate",
            alias: "Board Approval Date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "idacommamt",
            alias: "IDA commitment",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "url",
            alias: "Project URL",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "WorldDataBankTab",
            alias: "Pull data from World Data Bank using API",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http:/search.worldbank.org/api/v2/projects?format=json&qterm=COVID-19&fl=id,regionname,countryname,project_name,boardapprovaldate,idacommamt,url&source=IBRD&projectfinancialtype_exact=IDA&rows=500&srt=score&order=desc&frmYear=2020&toYear=2021", function(resp) {
            var feat = resp.projects,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "countryname": feat[i].countryname,
                    "regionname": feat[i].regionname,
                    "projectfinancialtype": feat[i].projectfinancialtype,
                    "project_name": feat[i].project_name,
                    "location": feat[i].location,
                    "boardapprovaldate": feat[i].boardapprovaldate,
                    "idacommamt": feat[i].idacommamt,
                    "url": feat[i].url
                });
            }

            // table.appendRows(tableData);
            // add the data
            chunkData(table, tableData);
            doneCallback();
        });
    };

    // add the data in manageable chunks
    function chunkData(table, tableData){
       var row_index = 0;
       var size = 100;
       while (row_index < tableData.length){
            table.appendRows(tableData.slice(row_index, size + row_index));
            row_index += size;
            tableau.reportProgress("Getting row: " + row_index);
        }
    }

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "World Bank Data Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
