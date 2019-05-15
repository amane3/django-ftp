
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
  
  // Downloading
  $(document).ready(function() {
    var file = $("#filepath").val();
    var filename = $("#filename").val();
    file2 = file
      .replace(/"/g, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/'/g, "");
    filename2 = filename
      .replace(/"/g, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/'/g, "");
    file2 = file2.split(",");
    filename2 = filename2.split(",");
    filenum = filename2.length;
    for (i = 0, l = file2.length; i < l; i++) {
      var xhr = [],
        i;
      (function(i) {
        xhr[i] = new XMLHttpRequest();
        var object;
        xhr[i].addEventListener("readystatechange", function(e) {
          if (this.readyState == 4) {
            object = URL.createObjectURL(this.response);
            downloadlink = filename2[i].replace(/^\s+|\s+$/g, "").slice(1);
            document.querySelector("#save").setAttribute("href", object);
            document
              .querySelector("#save")
              .setAttribute("download", downloadlink);
            document.querySelector("#save").click();
            $("#progress-msg").append(downloadlink + "...completed!<br>");
            num = document.getElementById("number");
            num.stepUp(1);
            numval = num.value;
            numval = parseInt(numval);
            if (numval == filenum) {
              home();
            }
          }
        });
        xhr[i].responseType = "blob";
        xhr[i].addEventListener("progress", function(e) {
          var percent = (e.loaded / e.total) * 100;
          $(".progress-bar").css("width", percent + "%");
          $("#progress").html(parseInt(percent) + "%");
        });
        xhr[i].open("get", file2[i]);
        xhr[i].send();
      })(i);
    }
  
    function home() {
      window.location.href = "/home";
    }
  });
  