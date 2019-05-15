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
  