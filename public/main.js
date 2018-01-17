var imageData;
var didRotate = false;

var fr = new FileReader();
fr.onload = function (e) {
  $(".ImageSelect__preview").attr("src", e.target.result);
  imageData = e.target.result;
};

$(document).ready(function () {
  $(".ImageSelect__input").change(function () {
    fr.readAsDataURL($(this).prop("files")[0]);
  });

  $(".Options__rotateButton").click(function () {
    post_rotate_img({ auto_crop: $(".Options__autoCrop").is(":checked") });
  });

  $(".Options__retryButton--none").click(function () {
    post_rotate_img({
      auto_crop: $(".Options__autoCrop").is(":checked"),
      threshold: 50,
    });
  });

  $(".Options__retryButton--incorrect").click(function () {
    post_rotate_img({
      auto_crop: $(".Options__autoCrop").is(":checked"),
      threshold: 200,
    });
  });
});

var post_rotate_img = function (data) {
  data.image_data = imageData.substring(imageData.indexOf(",") + 1);

  $.ajax({
    url: "/rotate",
    type: "POST",
    data: JSON.stringify(data),
  }).done(function (result) {
    var data = JSON.parse(result);
    if (data.success) {
      $(".Output__image").attr("src", "data:image/png;base64," + data.imageData.trim());
      $(".Options__retryButton").show();
    } else {
      console.log("Error", data.error);
    }
  }).fail(function (xhr, ajaxOptions, thrownError) {
    console.log("Error", thrownError);
  });
}
