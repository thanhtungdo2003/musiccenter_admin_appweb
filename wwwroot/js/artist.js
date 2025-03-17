let current_page_artist = 1;
var artist_next_page = false;
$(document).ready(function () {
    loadArtistDatas(1);
    $("#page-next").click(function () {
        if (!artist_next_page) return;
        loadArtistDatas(++current_page_artist);
    });
    document.getElementById('avtArtistUpload').addEventListener('change', function (event) {

        const picturePreview = document.getElementById('avtArtistPreview');
        picturePreview.innerHTML = '';
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');      
                img.id = "img-avt-artist-preview";
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = "100%";
                img.crossOrigin = "anonymous"
                picturePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
            //
           
        }
    });
    $("#artist-sumbit").click(function () {
        var stageName = $("#stageName").val();
        if (stageName === "") {
            alert("Nghệ danh không được trống!");
            return;
        }
        uploadArtist(stageName);

    });
    async function uploadArtist(stageName) {
        const fileInput = document.getElementById("avtArtistUpload");
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('stageName', stageName); // Tên nghệ sĩ
            formData.append('avataFile', file); 
            try {
                const response = await fetch(uri+'Artist?stageName='+stageName, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Lấy nội dung phản hồi lỗi
                    console.error('Response from API:', errorData); // In ra lỗi chi tiết
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorData)}`);
                } else {
                    alert("Cập nhật thành công!")
                    fileInput.value = '';
                    $("#stageName").val('');
                    $("#avtArtistPreview img").attr("src", "");
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                alert("Có lỗi sảy ra khi cập nhật, Lỗi: "+error)
                console.error('Error:', error);
            }
        } else {
            alert("Ảnh đại diện đang để trống")
        }
    }
  
});

async function loadArtistDatas(page) {
    $.ajax({
        url: uri + "Artist/page/" + page+"&"+10,
        type: 'GET',
        success: function (datas) {
            if (datas.length > 9) {
                artist_next_page = true;
            } else if (datas.length <= 10){
                artist_next_page = false;
            }
            const container = $("#table-artist-list");
            var colorRGB = ""

            for (var i = 0; i < datas.length; i++) {
                if (i % 2 == 0) {
                    colorRGB = "rgb(150,150,150)";
                } else {
                    colorRGB = "rgb(200,200,200)";

                }
                container.append(`<tr class="data-field" style="color: ${colorRGB}">
                                    <th><input class="checkbox-data" type="checkbox" /></th>
                                    <th class="data-cell"><img style='width: 70px; height: 70px; object-fit: cover; border-radius: 10px' id='artist-avata-${datas[i].ArtistUid}'/></th>
                                    <th class="data-cell" style="font-size:13px"><input class='data-id' style="color: ${colorRGB}" type="text" readonly value="${datas[i].ArtistUid}" /></th>
                                    <th class="data-cell"><input class="record-name-cell" type="text" style="color: ${colorRGB}" readonly value="${datas[i].StageName}" /></th>
                                    <th class="data-cell"><input class="record-cate-cell" type="text" style="color: ${colorRGB}" readonly value="${datas[i].Visits}" /></th>
                                    <th class="data-cell"><input class="record-views-cell" type="text" style="color: ${colorRGB}" readonly value="${datas[i].TotalRecord}" /></th>
                                    <th class="data-cell"><input class="record-artist-cell" type="text" style="color: ${colorRGB}" readonly value="${datas[i].TotalView}" /></th>
                                    <th class="data-cell-action"><button class='edit-button'><img src="/lib/paint.png"/></button></th>
                                </tr>`);
                SetFile("artist-avata", datas[i].Avata, $(`#artist-avata-${datas[i].ArtistUid}`));
            }
        }
    })
}