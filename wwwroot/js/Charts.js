var nextPage = false;
var record_nextPage = false;
let rows = 5;
let record_rows = 5;

$(document).ready(function () {
    loadArtistChart(1, 5);
    loadRecordsChart(1, 5);
    $("#artists-chart-top-control-value").val(rows);
    $("#records-chart-top-control-value").val(record_rows);

    $.ajax({
        url: uri + "Record",
        type: "GET",
        success: function (datas) {
            var count = 0;
            window.setInterval(function () {
                count++;
                if (count > datas.length) {
                    return;
                }
                $("#row1-total-record").text(count);              
            },10)
        }
    })
    $.ajax({
        url: uri + "Artist",
        type: "GET",
        success: function (datas) {
            var count = 0;

            window.setInterval(function () {
                count++;
                if (count > datas.length) {
                    return;
                }
                $("#row1-total-artist").text(count);
            }, 10)
        }
    })
    $.ajax({
        url: uri + "Account",
        type: "GET",
        success: function (datas) {
            var count = 0;

            window.setInterval(function () {
                count++;
                if (count > datas.length) {
                    window.clearInterval(0)
                    return;
                }
                $("#row1-total-user").text(count);
            }, 10)
        }
    })

    //Điều khiển biểu đồ nghệ sĩ
    $("#artists-chart-page-control-next").click(function () {
        if (nextPage) {
            current_page_artist_chart++;
            loadArtistChart(current_page_artist_chart, rows);
            $("#artists-chart-page-control-value").val(current_page_artist_chart);
        }
    })
    $("#artists-chart-page-control-perious").click(function () {
        if (current_page_artist_chart < 2) return;
        current_page_artist_chart--;
        loadArtistChart(current_page_artist_chart, rows);
        $("#artists-chart-page-control-value").val(current_page_artist_chart);
    });

    $("#artists-chart-top-control-up").click(function () {
        rows++;
        loadArtistChart(current_page_artist_chart, rows);
        $("#artists-chart-top-control-value").val(rows);
        
    })
    $("#artists-chart-top-control-down").click(function () {
        if (rows < 4) return;
        rows--;
        loadArtistChart(current_page_artist_chart, rows);
        $("#artists-chart-top-control-value").val(rows);
    })

    //Điều khiển biểu đồ Bài hát
    $("#records-chart-page-control-next").click(function () {
        if (record_nextPage) {
            current_page_record_chart++;
            loadRecordsChart(current_page_record_chart, record_rows);
            $("#records-chart-page-control-value").val(current_page_record_chart);
        }
    })
    $("#records-chart-page-control-perious").click(function () {
        if (current_page_record_chart < 2) return;
        current_page_record_chart--;
        loadRecordsChart(current_page_record_chart, record_rows);
        $("#records-chart-page-control-value").val(current_page_record_chart);
    });

    $("#records-chart-top-control-up").click(function () {
        record_rows++;
        loadRecordsChart(current_page_record_chart, record_rows);
        $("#records-chart-top-control-value").val(record_rows);

    })
    $("#records-chart-top-control-down").click(function () {
        if (record_rows < 4) return;
        record_rows--;
        loadRecordsChart(current_page_record_chart, record_rows);
        $("#records-chart-top-control-value").val(record_rows);
    })

})
let current_page_artist_chart = 1;
var isLoadImg = false;
var imgs = [];
var images = [];


function loadArtistChart(page, rows) {

    $("#artists-chart").remove();
    $(".artists-chart-container").append(`<canvas id="artists-chart"></canvas>`);

    isLoadImg = false;
    var xValues = [];
    var yValues = [];
    var viewValues = [];
    var recordValues = [];
    $.ajax({
        url: uri + "Artist/page/" + page + "&" + rows,
        type: 'GET',
        success: function (datas) {
            if (datas.length > rows-1) {
                nextPage = true;
            } else if (datas <= rows) {
                nextPage = false;
            }
            for (var i = 0; i < datas.length; i++) {
                xValues[i] = datas[i].StageName;
                yValues[i] = datas[i].Visits;
                images[i] = datas[i].Avata;
                viewValues[i] = datas[i].TotalView / 1000;
                recordValues[i] = datas[i].TotalRecord;
            }
            var imagePlugin = {
                afterDraw: function (chart) {

                    var ctx = chart.chart.ctx;
                    var xAxis = chart.scales['x-axis-0'];
                    var yAxis = chart.scales['y-axis-0'];

                    if (!isLoadImg) {
                        xValues.forEach((_, index) => {
                            var x = xAxis.getPixelForTick(index); // Vị trí X của cột
                            var y = yAxis.getPixelForValue(yValues[index]); // Vị trí Y của giá trị
                            // Tải ảnh
                            var img = new Image();
                            SetFile("artist-avata", images[index], $(img));
                            imgs[index] = img;

                            // Vẽ ảnh trên cột
                            img.onload = function () {
                                ctx.drawImage(img, x - 15, y - 40, 30, 30);
                            };
                        });
                        isLoadImg = true;
                    } else {
                        xValues.forEach((_, index) => {
                            var x = xAxis.getPixelForTick(index);
                            var y = yAxis.getPixelForValue(yValues[index]);
                            var img = new Image();
                            if (imgs[index] != null) {
                                img.src = imgs[index].src;
                            }
                            img.onload = function () {
                                ctx.drawImage(img, x - 15, y - 40, 30, 30);
                            };
                        });
                    }
                }
            };


            new Chart("artists-chart", {
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                        label: "Lượt truy cập",
                        backgroundColor: "#66ed95",
                        data: yValues
                    }, {
                        label: "Lượt nghe",
                        backgroundColor: "#FFF",
                        data: viewValues
                    }, {
                        label: "Tổng bài hát",
                        backgroundColor: "#f3fa8b",
                        data: recordValues
                    }],
                },
                options: {
                    legend: { display: true },
                    scales: {
                        xAxes: [{
                            stacked: false // Xếp chồng các phần tử cột
                        }],
                        yAxes: [{
                            stacked: false // Xếp chồng các phần tử cột trên trục y
                        }]
                    },
                    title: {
                        display: true,
                        text: `Bảng xếp hạng nghệ sĩ [Trang ${page}]`
                    }
                },
                plugins: [imagePlugin]
            });
        }
    })
}

let current_page_record_chart = 1;
var isLoadRecordImg = false;
var record_imgs = [];
var record_images = [];

function loadRecordsChart(page, rows) {

    $("#records-chart").remove();
    $(".records-chart-container").append(`<canvas id="records-chart"></canvas>`);

    isLoadRecordImg = false;
    var xValues = [];
    var viewValues = [];
    $.ajax({
        url: uri + "Record/page/" + page + "&" + rows,
        type: 'GET',
        success: function (datas) {
            if (datas.length > rows - 1) {
                record_nextPage = true;
            } else if (datas <= rows) {
                record_nextPage = false;
            }
            for (var i = 0; i < datas.length; i++) {
                xValues[i] = datas[i].DisplayName;
                record_images[i] = datas[i].Poster;
                viewValues[i] = datas[i].Views;
            }
            var imagePlugin = {
                afterDraw: function (chart) {

                    var ctx = chart.chart.ctx;
                    var xAxis = chart.scales['x-axis-0'];
                    var yAxis = chart.scales['y-axis-0'];

                    if (!isLoadRecordImg) {
                        xValues.forEach((_, index) => {
                            var x = xAxis.getPixelForTick(index); // Vị trí X của cột
                            var y = yAxis.getPixelForValue(viewValues[index]); // Vị trí Y của giá trị
                            // Tải ảnh
                            var img = new Image();
                            SetFile("record-poster", record_images[index], $(img));
                            record_imgs[index] = img;

                            // Vẽ ảnh trên cột
                            img.onload = function () {
                                ctx.drawImage(img, x - 15, y - 40, 30, 30);
                            };
                        });
                        isLoadRecordImg = true;
                    } else {
                        xValues.forEach((_, index) => {
                            var x = xAxis.getPixelForTick(index);
                            var y = yAxis.getPixelForValue(viewValues[index]);
                            var img = new Image();
                            if (record_imgs[index] != null) {
                                img.src = record_imgs[index].src;
                            }
                            img.onload = function () {
                                ctx.drawImage(img, x - 15, y - 40, 30, 30);
                            };
                        });
                    }
                }
            };


            new Chart("records-chart", {
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                        label: "Lượt nghe",
                        backgroundColor: "#dbb8ff",
                        data: viewValues
                    }],
                },
                options: {
                    legend: { display: true },                 
                    title: {
                        display: true,
                        text: `Thống kê lượt nghe bài hát [Trang ${page}]`
                    }
                },
                plugins: [imagePlugin]
            });
        }
    })
}
