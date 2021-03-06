var db = firebase.firestore();
var collectionRef = db.collection("meetings");
var dataRefOrderByTime = collectionRef.orderBy('creation-time', 'asc');

function render() {


    dataRefOrderByTime.get().then(function (snapshop) {
        snapshop.forEach(function (doc) {
            var $meeting = `<div class="col-md-4 mb-5" id="${doc.id}">
                                <div class="card">
                                    <div class="card-header">${doc.data().meeting.name}</div>
                                    <div class="card-body">
                                        <p class="card-text">日期：${doc.data().meeting.date}</p>
                                        <p class="card-text">時間：${doc.data().meeting.time}</p>
                                        <p class="card-text">地點：${doc.data().meeting.location}</p>
                                        <p class="card-text">出席：${doc.data().meeting.attendees}</p>
                                        <a href="#" class="btn btn-primary" id="view-btn" data-toggle="modal" data-target="#viewModal" meeting-id="${doc.id}"><i class="far fa-eye"></i></a>
                                        <a href="#" class="btn btn-primary" id="edit-btn" data-toggle="modal" data-target="#editModal" meeting-id="${doc.id}"><i class="far fa-edit"></i></a>
                                        <a href="#" class="btn btn-primary" id="del-btn" meeting-id="${doc.id}"><i class="far fa-trash-alt"></i></a>
                                    </div>
                                </div>
                             </div>`;

            var currentdate = new Date();
            var now_date = currentdate.getFullYear() + "-" +
                (currentdate.getMonth() + 1) + "-" +
                currentdate.getDate();

            $("#list-container").append($meeting);
            var resultSubtractDate = SubtractDate(now_date, doc.data().meeting.date);
            if (resultSubtractDate >= 3 && doc.data().meeting.minutes == "") {
                $(`#${doc.id} .card-header`).append('<i class="fas fa-exclamation-circle float-right" data-toggle="tooltip" title="請輸入會議記錄!"></i>');
            }
            $('[data-toggle="tooltip"]').tooltip();

            var $viewBtn = $(`#${doc.id} #view-btn`);
            $viewBtn.click(function () {
                var meeingId = $viewBtn.attr("meeting-id");
                db.doc(`/meetings/${meeingId}`)
                    .get()
                    .then(function (doc) {
                        //show modals render data
                        $(".modal-header").text(`${doc.data().meeting.name}`);
                        $("#date-span").text(`${doc.data().meeting.date}`);
                        $("#time-span").text(`${doc.data().meeting.time}`);
                        $("#location-span").text(`${doc.data().meeting.location}`);
                        $("#attendees-span").text(`${doc.data().meeting.attendees}`);
                        $("#agenda-span").text(`${doc.data().meeting.agenda}`);
                        $("#minutes-span").text(`${doc.data().meeting.minutes}`);

                    });
            });

            var $editBtn = $(`#${doc.id} #edit-btn`);
            $editBtn.click(function () {
                var meeingId = $editBtn.attr("meeting-id");
                db.doc(`/meetings/${meeingId}`)
                    .get()
                    .then(function (doc) {
                        //show modals render data
                        console.log(`${doc.id}`);
                        var $nameEditInput = $("#name-edit");
                        var $dateEditInput = $("#date-edit");
                        var $timeEditInput = $("#time-edit");
                        var $locationEditInput = $("#location-edit");
                        var $attendeesEditInput = $("#attendees-edit");
                        var $agendaEditInput = $("#agenda-edit");
                        var $minutesEditInput = $("#meeting-minutes-edit");

                        $nameEditInput.attr("value", `${doc.data().meeting.name}`);
                        $dateEditInput.attr("value", `${doc.data().meeting.date}`);
                        $timeEditInput.attr("value", `${doc.data().meeting.time}`);
                        $locationEditInput.attr("value", `${doc.data().meeting.location}`);
                        $attendeesEditInput.attr("value", `${doc.data().meeting.attendees}`);
                        $agendaEditInput.text(`${doc.data().meeting.agenda}`);
                        $minutesEditInput.text(`${doc.data().meeting.minutes}`);

                        $("#save-btn").click(function () {
                            var $editedName = $("#name-edit").val();
                            var $editedDate = $("#date-edit").val();
                            var $editedTime = $("#time-edit").val();
                            var $editedLocation = $("#location-edit").val();
                            var $editedAttendees = $("#attendees-edit").val();
                            var $editedAgenda = $("#agenda-edit").val();
                            var $editedMinutes = $("#meeting-minutes-edit").val();

                            console.log("點選儲存");
                            db.doc(`/meetings/${meeingId}`).update({
                                "meeting": {
                                    "name": $editedName,
                                    "date": $editedDate,
                                    "time": $editedTime,
                                    "location": $editedLocation,
                                    "attendees": $editedAttendees,
                                    "agenda": $editedAgenda,
                                    "minutes": $editedMinutes
                                }
                            });
                        });

                    });
            });

            var $delBtn = $(`#${doc.id} #del-btn`);
            $delBtn.click(function () {
                db
                    .collection("meetings")
                    .doc(doc.id)
                    .delete();
                $(`div#${doc.id}`).remove();
            });
        });
    });
}
collectionRef.onSnapshot(function (snapshop) {
    snapshop.docChanges.forEach(function (change) {
        if (change.type === "modified") {
            $("#list-container").empty();
            render();
        }
    });
});
render();

function SubtractDate(D1, D2) {
    //sDate1和sDate2是2002-12-18格式
    var aDate, oDate1, oDate2, iDays;
    splitedDate1 = D1.split("-");
    //轉換成12-18-2002格式
    newDate1 = new Date(splitedDate1[1] + '-' + splitedDate1[2] + '-' + splitedDate1[0]);
    splitedDate2 = D2.split("-");
    newDate2 = new Date(splitedDate2[1] + '-' + splitedDate2[2] + '-' + splitedDate2[0]);
    //把相差的毫秒數轉換為天數
    resultDays = parseInt(Math.abs(newDate1 - newDate2) / 1000 / 60 / 60 / 24);
    return resultDays;
}