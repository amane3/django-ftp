//Index
function deletelist() {
    var list = [];
    var list2 = [];
    $(".deleteitem").remove();
    $(".selected").each(function() {
      val = $(this)
        .children("td")
        .eq(1)
        .text();
      val2 = $(this)
        .children("td")
        .eq(5)
        .text();
      list.push(val);
      list2.push(val2);
      deleteItem = "<div class='deleteitem'>" + val + "</div>";
      $(".modal-body").append(deleteItem);
    });
    delval = "";
    delval2 = "";
    for (i = 0, l = list.length; i < l; i++) {
      delval += list[i];
      delval2 += list2[i];
      delval += "?";
      delval2 += "?";
    }
    delval = delval.slice(0, -1);
    delval2 = delval2.slice(0, -1);
    $(".delete").val(delval);
    $(".user").val(delval2);
  }
  
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
    $(document).on("click", "#select-all", function() {
      if (this.checked) {
        $(".listval").addClass("selected");
      } else {
        $(".listval").removeClass("selected");
      }
    });
  });
  $(document).ready(function() {
    $(document).on("click", ".listval, .select-checkbox", function() {
      var list = [];
      var list2 = [];
      $(".selected").each(function() {
        val = $(this)
          .children("td")
          .eq(1)
          .text();
        val2 = $(this)
          .children("td")
          .eq(5)
          .text();
        list.push(val);
        list2.push(val2);
      });
      valstr = "";
      valstr2 = "";
      for (i = 0, l = list.length; i < l; i++) {
        valstr += list[i];
        valstr2 += list2[i];
        valstr += "?";
        valstr2 += "?";
      }
      valstr = valstr.slice(0, -1);
      valstr2 = valstr2.slice(0, -1);
      $("#filename").val(valstr);
      $("#username").val(valstr2);
  
      if ($(".select-info").length) {
        $(".submit").removeClass("disabled");
        $(".delete").removeClass("disabled");
      } else {
        $(".submit").addClass("disabled");
        $(".delete").addClass("disabled");
      }
    });
  
    $(".upload").click(function() {
      window.location.href = "/uploads";
    });
  });
  