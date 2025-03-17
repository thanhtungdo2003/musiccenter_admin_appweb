let current_page_account = 0;
$(document).ready(function () {
    loadAccountDatas(1);
});

async function loadAccountDatas(page) {
    $.ajax({
        url: uri + "Account/page/" + page,
        type: 'GET',
        success: function (datas) {
            if (datas.length > 10) {
                current_page_account++;
            }
            const container = $("#table-account-list");
            var colorRGB = ""

            for (var i = 0; i < datas.length; i++) {
                if (i % 2 == 0) {
                    colorRGB = "rgb(150,150,150)";
                } else {
                    colorRGB = "rgb(200,200,200)";

                }
                container.append(`<tr class="data-field" style="color: ${colorRGB}">
                                    <th><input class="checkbox-data" type="checkbox" /></th>
                                    <th class="data-cell" style="font-size:13px"><input class='data-id' style="color: ${colorRGB}" type="text" readonly value="${datas[i].UserName}" /></th>
                                    <th class="data-cell"><input class="record-name-cell" type="text" style="color: ${colorRGB}" readonly value="${datas[i].Password}" /></th>
                                    <th class="data-cell"><div class='status-data-account ${GetStatus(datas[i].Status)}'>${GetStatus(datas[i].Status)}
                                        <div class='status-select'>
                                            <div class='status-option-active'>ACTIVE</div>
                                            <div class='status-option-ban'>BAN</div>
                                        </div>
                                    </div></th>
                                    <th class="data-cell"><input class="record-artist-cell" type="text" style="color: ${colorRGB}" readonly value="${datas[i].JoinDay}" /></th>
                                    <th class="data-cell-action"><button class='edit-button'><img src="/lib/paint.png"/></button></th>
                                </tr>`);
            }
        }
    })
}
function GetStatus(rawData) {
    if (rawData != null) {
        return rawData;
    } else {
        return "ACTIVE";
    }
}