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

//Uploads
$("#uploadmore").click(function() {
  location.href = "/uploads";
});

$("#home").click(function() {
  location.href = "/home";
});

$("#file").click(function() {
  if ($("form")[0].checkValidity()) {
    $("#file").addClass("disabled");
    var form = $("#form")[0];
    var formData = new FormData(form);
    $.ajax({
      url: "/save/",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      xhr: function() {
        $("#alert").html("");
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              $(".progress-bar").css("width", percentComplete + "%");
              $("#progress").html(percentComplete + "%");
              $("#progress-msg").html("Uploading is now in progress...");
            }
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4 && xhr.status === 200) {
                $("#modal").modal({ backdrop: "static", keyboard: false });
              }
            };
          },
          false
        );
        return xhr;
      }
    })
      .done(function(data) {
        if (data["message"] == "success") {
        }
      })
      .fail(function(XMLHttpRequest, textstatus, errorThrown) {
        $("#alert").html("*Error ocurred.");
        $(".progress-bar").css("width", "0");
        $("#file").removeClass("disabled");
        $("#progress").html("");
        $("#progress-msg").html("");
      });
  } else {
    alert = "<div>*Please fill out a form.</div>";
    $("#alert").html(alert);
  }
});

function round(number, precision) {
  var shift = function(number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    var numArray = ("" + number).split("e");
    return +(
      numArray[0] +
      "e" +
      (numArray[1] ? +numArray[1] + precision : precision)
    );
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
}

function convertByteSize(size) {
  var sizes = [" B", " KB", " MB", " GB", " TB", " PB", " EB"];
  var ext = sizes[0];
  if (typeof size === "number") {
    for (var i = 1; i < sizes.length; i += 1) {
      if (size >= 1024) {
        size = size / 1024;
        ext = sizes[i];
      }
    }
  }
  return round(size, 2) + ext;
}

var object = document.getElementById("id_uploadfile");
object.addEventListener("change", function(event) {
  $("#alert").html("");
  filename = event.target.files[0].name;
  filesize = event.target.files[0].size;
  size = convertByteSize(filesize);
  $("#id_size").val(size);
  $("#id_filename").val(filename);
  $.ajax({
    url: "/checkfile/",
    type: "POST",
    data: { filename: filename, csrfmiddlewaretoken: "{{ csrf_token }}" }
  })
    .done(function(data) {
      if (data["message"] == "fail") {
        $("#alert").html("*This file already exists.");
        $("#id_uploadfile").val("");
      }
    })
    .fail(function() {});
});

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
