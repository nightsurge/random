//////////////////////////////////////////////////////////////////
//export table to csv

function exportTableToCSV($table, filename) {
  var $rows = $table.find('tr:has(td)'),
      headers = [],
      // actual delimiter characters for CSV format
      colDelim = '","',
      rowDelim = '"\r\n"',
      // Temporary delimiter characters unlikely to be typed by keyboard
      // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character
      csv = '';

  $table.find('th').each(function() {
      var $th = $(this),
          text = $th.text(),
          header = '"' + text + '"';
      if(text != ""){ headers.push(header); }// actually datatables seems to copy my original headers so there ist an amount of TH cells which are empty
  });

  // Grab text from table into CSV formatted string
  csv += headers.join(',') + '\n"';
  csv += $rows.map(function (i, row) {
      var $row = $(row),
          $cols = $row.find('td');

      return $cols.map(function (j, col) {
          var $col = $(col),
              text = $col.text();

          return text.replace('"', '""'); // escape double quotes

      }).get().join(tmpColDelim);

  }).get().join(tmpRowDelim)
      .split(tmpRowDelim).join(rowDelim)
      .split(tmpColDelim).join(colDelim) + '"';


  // Data URI
  csvData = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csv);
  
  $(this)
    .attr({
    'download': filename,
      'href': csvData,
      'target': '_blank'
  });
}
// This must be a hyperlink
//// Modified for a search results table that is built with DataTables.js
$(".export-csv").on('click', function (event) {
  var tableObject,
      search = $(this).data("search");
  
  if(search === "account"){
    tableObject = account_search_results_table;
  }else if(search === "policy"){
    tableObject = policy_search_results_table;
  }else if (search === "quote"){
    tableObject = quote_search_results_table;
  }
  var oSettings = tableObject.fnSettings();
  oSettings._iDisplayLength = -1;
  tableObject.fnDraw();
  exportTableToCSV.apply(this, [$('#'+search+'_search_results_table'), ''+search+'_search_export.csv']);
  oSettings._iDisplayLength = 10;
  tableObject.fnDraw();
});