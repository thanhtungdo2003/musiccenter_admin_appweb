const uri = "https://localhost:7058/api/";

$(document).ready(function () {
    $("#logo").click(function () {
        open("index", "_parent");
    });
    $(".edit-form-backgound").click(function () {
        $(this).addClass("off");
        $(this).removeClass("on");
    });
    $(".edit-form-container").click(function (event) {
        event.stopPropagation();
    });
});
document.getElementById('posterUpload').addEventListener('change', function (event) {
    const picturePreview = document.getElementById('posterPreview');
    picturePreview.innerHTML = '';
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = "100%";
            picturePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});
document.getElementById('coverImgUpload').addEventListener('change', function (event) {
    const picturePreview = document.getElementById('coverImgPreview');
    picturePreview.innerHTML = '';
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = "100%";
            picturePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});
document.getElementById('recordUpload').addEventListener('change', function (event) {
    const audioPreview = document.getElementById('record-autido');
    audioPreview.innerHTML = '';
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const src = document.createElement('source');
            src.src = e.target.result;
            audioPreview.appendChild(src);
        };
        reader.readAsDataURL(file);
    }
});
function SetFile(folder, fileName, container) {
    fetch(uri + "File/get/folder=" + folder + "&file=" + fileName)
        .then(response => {
            const contentType = response.headers.get("Content-Type");
            return response.blob().then(blob => ({ blob, contentType }));
        }).then(({ blob, contentType }) => {
            const fileUrl = URL.createObjectURL(blob);
            if (contentType.startsWith("image/")) {
                container.attr("src", fileUrl);
            } else {
                container.attr("src", fileUrl);
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            return null;
        });

}
function GetIMGUrl(folder, fileName) {
    fetch(uri + "File/get/folder=" + folder + "&file=" + fileName)
        .then(response => {
            const contentType = response.headers.get("Content-Type");
            return response.blob().then(blob => ({ blob, contentType }));
        }).then(({ blob, contentType }) => {
            const fileUrl = URL.createObjectURL(blob);
            return fileUrl;
        })
        .catch(error => {
            console.error('Lỗi:', error);
            return null;
        });
}