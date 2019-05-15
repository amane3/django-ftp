// Downloads
jQuery(function($) {
    $("#download-table").DataTable({
      columnDefs: [
        {
          orderable: false,
          className: "select-checkbox",
          targets: 0,
          checkboxes: {
            selectRow: true
          }
        }
      ],
      select: {
        style: "multi+shift",
        selector: ".listval"
      },
      order: [[1, "asc"]]
    });
  });
  $(document).ready(function() {
    $(document).on("click", ".listval", function() {
      var list = [];
      $(".selected").each(function() {
        val = $(this)
          .children("td")
          .eq(1)
          .text();
        list.push(val);
      });
      valstr = "";
      for (i = 0, l = list.length; i < l; i++) {
        valstr += list[i];
        valstr += "?";
      }
      $("#filename").val(valstr);
      if ($(".select-info").length) {
        $(".submit").prop("disabled", false);
      } else {
        $(".submit").prop("disabled", true);
      }
    });
  });
  