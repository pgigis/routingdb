$(document).ready(function() {
  'use strict';

  $('form').submit(function () {
    asn = $('#asn').val();
    if (asn) {
      let index = (asn % 1000);
      $.get('data/file_' + index + '.json', function(result) {
        // show html blocks
        $('#alert').hide();
        $('#results').show();

        let data = result[asn];

        // stats
        console.log(data.probes);
        let total_probes = 0;
        $.each(data.probes, function() {
          total_probes += 1;
        });
        $('#probes').text(total_probes);
        $('#tr-out-v4').text(data.traceroutes.stats.out_going_v4);
        $('#tr-in-v4').text(data.traceroutes.stats.in_going_v4);
        $('#tr-out-v6').text(data.traceroutes.stats.out_going_v6);
        $('#tr-in-v6').text(data.traceroutes.stats.in_going_v6);

        let ixps = data.ixps;
        $('#ixp').text(data.ixps.length + ' ' + ixps);

        if (!data.traceroutes.results.v4.interesting.length && !data.traceroutes.results.v6.interesting.length) {
          $('#interesting').hide();
        }

        if (!data.traceroutes.results.v4.normal.length && !data.traceroutes.results.v6.normal.length) {
          $('#normal').hide();
        }

        let aspaths_interesting = ``;
        let aspaths_normal = ``;

        // v4 interesting
        if (data.traceroutes.results.v4.interesting.length) {
          $.each(data.traceroutes.results.v4.interesting, function(key, val) {
            aspaths_interesting += `<tr><td>`;
            let total = val.as_path.length;
            let dest;
            $.each(val.as_path, function(key, val) {
              let name = data.traceroutes.results.meta.full_names[val.name];
              if (!key) {
                aspaths_interesting += `
                  <span title="${name}" data-toggle="tooltip">
                    ${val.name}
                  </span></td><td>
                `;
              }
              if (val.common) {
                let ixps = data.traceroutes.results.meta.common_ixps[val.name];
                aspaths_interesting += `
                  <span class="text-danger" title="<div>${name}</div><u>Commons IXPS</u><br>${ixps}" data-html="true" data-toggle="tooltip">
                  ${val.name}
                  </span> &nbsp;
                `;
              } else {
                aspaths_interesting += `
                  <span title="${name}" data-toggle="tooltip">
                    ${val.name}
                  </span> &nbsp;
                `;
              }
              if (key == (total - 1)) {
                aspaths_interesting += `</td><td>
                <span title="${name}" data-toggle="tooltip">
                  ${val.name}
                </span></td></tr>
                `;
              }
            });
          });
          $('#aspaths-interesting').append(aspaths_interesting);
        }

        // v6 interesting

        // v4 normal
        if (data.traceroutes.results.v4.normal.length) {
          $.each(data.traceroutes.results.v4.normal, function(key, val) {
            aspaths_normal += `<tr><td>`;
            let total = val.as_path.length;
            let dest;
            $.each(val.as_path, function(key, val) {
              if (!key) {
                aspaths_normal += `${val.name}</td><td>`;
              } else if (key == (total - 1)) {
                dest = val.name;
              } else {
                aspaths_normal += `${val.name} &nbsp;`;
              }
            });
            aspaths_normal += `</td>`;
            aspaths_normal += `<td>${dest}</td></tr>`;
          });
          $('#aspaths-normal').append(aspaths_normal);
        }

        // v6 normal
        if (data.traceroutes.results.v6.normal.length) {
          $.each(data.traceroutes.results.v6.normal, function(key, val) {
            aspaths_normal += `<tr><td>`;
            let total = val.as_path.length;
            let dest;
            $.each(val.as_path, function(key, val) {
              if (!key) {
                aspaths_normal += `${val.name}</td><td>`;
              } else if (key == (total - 1)) {
                dest = val.name;
              } else {
                aspaths_normal += `${val.name} &nbsp;`;
              }
            });
            aspaths_normal += `</td>`;
            aspaths_normal += `<td>${dest}</td></tr>`;
          });
          $('#aspaths-normal').append(aspaths_normal);
        }
        $('[data-toggle="tooltip"]').tooltip();

      });
    } else {
      $('#alert').show();
      $('#results').hide();
    }
    return false;
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('#datetimepicker1').datetimepicker({
    'format': 'DD-MM-YYYY, HH:00'
  });
});
