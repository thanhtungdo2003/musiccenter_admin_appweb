let current_page_record = 1;

$(document).ready(function () {
    if (window.location.href.includes("/record_list")) {
        loadRecordDatas(1);
        let current_page = current_page_record;
        $("#page-next").click(function () {
            loadRecordDatas(++current_page);
        });
        var currentDataFieldSelect;
        $(document).on('click', ".edit-button", function () {
            $(".edit-form-backgound").addClass("on");
            $(".edit-form-backgound").removeClass("off");
            $(".edit-form-container").addClass("off");
            $(".edit-form-container").removeClass("on");
            const form = $("#edit-form-record");
            form.addClass("on");
            form.removeClass("off");

            const data_field = $(this).parent().parent();
            currentDataFieldSelect = data_field;
            $.ajax({
                url: uri + "Record/" + data_field.find(".data-id").val(),
                type: 'GET',
                success: function (record) {
                    $("#edit-form-record-title").val(record.displayName);
                    $("#edit-form-record-views").val(record.views);
                    $("#edit-form-recordid").val(data_field.find(".data-id").val());
                    $("#edit-form-poster-value").val(record.poster);
                    $("#edit-form-coverphoto-value").val(record.coverPhoto);
                    $("#edit-form-audio-value").val(record.record);
                    $("#edit-form-record-lyric").val(record.lyrics);
                    $("#edit-form-record-description").val(record.description);
                    $("#payfee-checkbox-editaudio").prop("checked", record.payfee === "TRUE" ? true:false);
                    $.ajax({
                        url: uri + "Category",
                        type: 'GET',
                        success: function (cates) {
                            $("#edit-form-record-cate").empty();
                            for (var i = 0; i < cates.length; i++) {
                                $("#edit-form-record-cate").append(`<option value='${cates[i].CategoryUid}'>${cates[i].DisplayName}</option>`)
                            }
                            $("#edit-form-record-cate").val(record.categoryUid)
                        }
                    });
                    $.ajax({
                        url: uri + "Artist",
                        type: 'GET',
                        success: function (datas) {
                            $("#edit-form-record-artist").empty();
                            for (var i = 0; i < datas.length; i++) {
                                $("#edit-form-record-artist").append(`<option value='${datas[i].ArtistUid}'>${datas[i].StageName}</option>`)
                            }
                            $("#edit-form-record-artist").val(record.artistUid);
                        }
                    })

                    SetFile("record-coverphoto", record.coverPhoto, $("#edit-form-record-cover-photo-preview"));
                    SetFile("record-poster", record.poster, $("#edit-form-record-poster-preview"));
                    SetFile("record-audio", record.record, $("#edit-form-record-audio-preview"));


                    $.ajax({
                        url: uri + `File/get/folder=record-audio&file=${record.record}`, // URL API trả về file âm thanh
                        method: 'GET',
                        xhrFields: {
                            responseType: 'blob', // Định dạng trả về là blob
                        },
                        success: function (blob) {
                            // Tạo URL từ blob
                            const audioURL = URL.createObjectURL(blob);

                            // Gán URL vào thẻ audio
                            $("#edit-form-record-audio-src-preview").attr('src', audioURL);
                        },
                        error: function (xhr, status, error) {
                            console.error('Lỗi khi tải âm thanh:', error);
                        },
                    });
                }
            })
        });
        $(".edit-record-delete-button").click(function () {
            const id = $("#edit-form-recordid").val();
            $.ajax({
                url: uri + "Record/remove-record/" + id,
                type: 'DELETE',
                success: function () {
                    alert("Đã xóa bài hát");
                    location.reload();
                }

            })
        });
        $(".edit-record-sumbit-button").click(function () {
            const id = $("#edit-form-recordid").val();
            const record_name = $("#edit-form-record-title").val();
            const record_cate_uid = $("#edit-form-record-cate").val();
            const record_artist_uid = $("#edit-form-record-artist").val();
            const record_views = $("#edit-form-record-views").val();
            const record_lyric = $("#edit-form-record-lyric").val();
            const record_description = $("#edit-form-record-description").val();
            const payfee = document.getElementById("payfee-checkbox-editaudio").checked ? "TRUE" : "FALSE";
            const poster = document.getElementById("edit-form-record-record").files[0];
            const cover_photo = document.getElementById("edit-form-record-poster").files[0];
            const audio = document.getElementById("edit-form-record-cover-photo").files[0];


            const poster_filename = $("#edit-form-poster-value").val();
            const coverPhoto_filename = $("#edit-form-coverphoto-value").val();
            const audio_filename = $("#edit-form-audio-value").val();

            const data = JSON.stringify({
                key:"RecordUid",
                recordUid: id,
                categoryUid: record_cate_uid,
                displayName: record_name,
                views: record_views,
                artistUid: record_artist_uid,
                lyrics: record_lyric,
                description: record_description,
                record: audio_filename,
                poster: poster_filename,
                payfee: payfee,
                coverPhoto: coverPhoto_filename,
                artist: {
                    artistUid: '',
                    stageName: '',
                    avata: '',
                    visits: 1,
                },
                category: {
                    categoryUid: '',
                    displayName: ''
                }
            });
            $.ajax({
                url: uri + "Record/edit-record",
                type: 'PUT',
                contentType: "application/json",
                data: data,
                success: function (response) {
                    $(".edit-form-backgound").removeClass("on");
                    $(".edit-form-backgound").addClass("off");

                    $(".edit-form-container").removeClass("on");
                    $(".edit-form-container").addClass("off");


                    $.ajax({
                        url: uri + "Record/" + currentDataFieldSelect.find(".data-id").val(),
                        type: 'GET',
                        success: function (record) {
                            currentDataFieldSelect.find(".record-name-cell").val(record.displayName);
                            currentDataFieldSelect.find(".record-cate-cell").val(record.category.displayName);
                            currentDataFieldSelect.find(".record-views-cell").val(record.views);
                            currentDataFieldSelect.find(".record-artist-cell").val(record.artist.stageName);
                        }
                    })
                    
                },
                error: function (er) {
                    alert("Lỗi khi sửa thông tin bài hát!")
                }
            })
        });
        $("#record-reload").click(function () {
            $(".data-field").remove();
            for (var i = 1; i < current_page + 1; i++) {
                loadRecordDatas(i);
            }
        })
    }
    fetch(uri + 'Artist')
        .then(reponse => reponse.json())
        .then(data => {
            const $select = $("#artists-list");
            $select.empty();
            data.forEach(artist => {
                $select.append("<option value='" + artist.ArtistUid + "'>" + artist.StageName + "</option>");
            })
        }).catch(error => console.error('Error:', error));
    fetch(uri + 'Category')
        .then(reponse => reponse.json())
        .then(data => {
            const $select = $("#category-list");
            $select.empty();
            data.forEach(category => {
                $select.append("<option value='" + category.CategoryUid + "'>" + category.DisplayName + "</option>");
            })
        }).catch(error => console.error('Error:', error));

    $("#record-sumbit").click(function () {
        var displayName = $("#displaynameRecord").val();
        var artistUid = $("#artists-list").val();
        var categoryUid = $("#category-list").val();
        if (displayName === "") {
            alert("Nghệ danh không được trống!");
            return;
        }
        if (artistUid == null) {
            alert("Ảnh đại diện không được trống!");
            return;
        }
        addRecord(displayName, artistUid, categoryUid);
    });
    $("#category-sumbit").click(function () {
        var displayName = $("#categoryName").val();
        if (displayName === "") {
            alert("Tên thể loại không được trống!");
            return;
        }
        var data = new FormData();
        data.append("displayName", displayName);
        fetch(uri + "Category/add/" + displayName, {
            method: 'POST',
            body: data
        }).then(response => {
            if (response.ok) {
                alert("Tạo thành công!");
            }
        })
    });
    async function addRecord(displayName, artistUid, categoryUid) {
        const posterInput = document.getElementById("posterUpload");
        const coverPhotoInput = document.getElementById("coverImgUpload");
        const audioInput = document.getElementById("recordUpload");
        const lyric = document.getElementById("lyricsTextBox");
        const des = document.getElementById("descriptionTextBox");
        const payfee = document.getElementById("payfee-checkbox-addaudio").checked ? "TRUE" : "FALSE";

        const posterFile = posterInput.files[0];
        const coverPhotoFile = coverPhotoInput.files[0];
        const audioFile = audioInput.files[0];

        if (posterFile && coverPhotoFile && audioFile) {
            // Tạo đối tượng FormData
            const formData = new FormData();
            formData.append('displayName', displayName);
            formData.append('categoryUid', categoryUid);
            formData.append('artistUid', artistUid);
            formData.append('posterFile', posterFile);
            formData.append('coverPhotoFile', coverPhotoFile);
            formData.append('audioFile', audioFile);
            formData.append('lyric', lyric);
            formData.append('payfee', payfee);
            formData.append('description', des);
            for (let i = 0; i < 1; i++) {
                try {
                    const response = await fetch(uri + 'Record/Create?artistUid=' + artistUid + '&categoryUid=' + categoryUid + '&displayName=' + displayName +"&payfee="+payfee+ "&lyric="+lyric+"&description="+des, {
                        method: 'POST',
                        body: formData // Gửi FormData trực tiếp
                    });
                    if (!response.ok) {
                        const errorData = await response.json(); // Lấy nội dung phản hồi lỗi
                        console.error('Response from API:', errorData); // In ra lỗi chi tiết
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorData)}`);

                    } else {
                        alert("Cập nhật thành công!")
                        posterInput.value = '';
                        coverPhotoInput.value = '';
                        audioInput.value = '';
                        $("#displaynameRecord").val('');
                        break;
                    }
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        } else {
            console.log('Không có file nào được chọn');
        }
    }

});

async function loadRecordDatas(page) {
    $.ajax({
        url: uri + "Record/page/" + page+"&"+12,
        type: 'GET',
        success: function (records) {
            if (records.length > 10) {
                current_page_record++;
            }
            const container = $("#table-recordlist");
            var colorRGB = ""

            for (var i = 0; i < records.length; i++) {
                if (i % 2 == 0) {
                    colorRGB = "rgb(150,150,150)";
                } else {
                    colorRGB = "rgb(200,200,200)";

                }
                container.append(`<tr class="data-field" style="color: ${colorRGB}">
                                    <th><input class="checkbox-data" type="checkbox" /></th>
                                    <th class="data-cell" style="font-size:13px"><input class='data-id' style="color: ${colorRGB}" type="text" readonly value="${records[i].RecordUid}" /></th>
                                    <th class="data-cell"><input class="record-name-cell" type="text" style="color: ${colorRGB}" readonly value="${records[i].DisplayName}" /></th>
                                    <th class="data-cell"><input class="record-cate-cell" type="text" style="color: ${colorRGB}" readonly value="${records[i].CategoryName}" /></th>
                                    <th class="data-cell"><input class="record-views-cell" type="text" style="color: ${colorRGB}" readonly value="${Number(records[i].Views)}" /></th>
                                    <th class="data-cell"><input class="record-artist-cell" type="text" style="color: ${colorRGB}" readonly value="${records[i].StageName}" /></th>
                                    <th class="data-cell-action"><button class='edit-button'><img src="/lib/paint.png"/></button></th>
                                </tr>`);
            }
        }
    })
}