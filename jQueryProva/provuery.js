
var nextId;
  function updateNextId(){
    $.get(lastPage, function(values,status){
      nextId = values._embedded.employees[countProps(values._embedded.employees)-1].id + 1;
    });
  }

  function countProps(obj) {
    var count = 0;
    for (var p in obj) {
      obj.hasOwnProperty(p) && count++;
    }
    return count; 
  }

  /*function updateEmployees() {
  var rows = "";

  $.each(data, function (key, value) {
        rows += "<tr id='row-"+value.id+"'>";

        rows += "<td>" + value.id + "</td>";

        rows += "<td><span id='name-"+value.id+"'>" + value.firstName + "</span><input type='text' class='display-none' id='input-name-"+value.id+"' placeholder='"+value.firstName+"'></td>";

        rows += "<td><span id='lastname-"+value.id+"'>" + value.lastName + "</span><input type='text' class='display-none' id='input-lastname-"+value.id+"' placeholder='"+value.lastName+"'></td>";

        rows += "<td>" + "<button class='btn btn-primary' id='change-"+value.id+"' onclick='modify(" + value.id + ")'>Modifica</button>  "+
        "<button class='delete-button' id='"+value.id+"' onclick='removeEmployee(" + value.id + ")'>Cancella</button>" + "</td>";
        rows += "</tr>";
      });
      $("#riempi-tab").html(rows);
  }*/

  var attributes = ["id",
    "firstName",
    "lastName", //<-- 2 
    "birthDate",
    "hireDate",
    "gender"];
function displayEmployees() {
    var rows = "";
    showLess();

    $.each(data, function (key, value) {
        rows += "<tr>";
        let extraClass = "d-none extra-info";
        let cls = "";

        for (let i = 0; i < attributes.length; i++) {
            if (i > 2) cls = extraClass; //2 --> the position limit to show
            rows += "<td class='" + cls + "' id='" + attributes[i] + "-" + value.id + "'>";
            rows += "<span id='text-" + attributes[i] + "-" + value.id + "' class=''>" + value[attributes[i]] + "</span>";

            switch (i) {
                case 1: case 2: case 5:
                    rows += "<input type='text' id='input-" + attributes[i] + "-" + value.id + "' placeholder='" + value[attributes[i]] + "' class='d-none'>";
                    break;
                case 3: case 4:
                    rows += "<input type='date' id='input-" + attributes[i] + "-" + value.id + "' value='" + value[attributes[i]] + "' class='d-none'>";
                    break;
                default:
                    break;
            }

            rows += "</td>";
        }
        rows += "<td>";
        rows += "<button class='m-1 btn btn-primary' onclick='modifyEmployee(" + value.id + ")' id='change-" + value.id + "'>Modifica</button>";
        rows += "<button class='m-1 btn btn-danger btn-delete' onclick='deleteEmployee(" + value.id + ")'>Licenzia</button>";
        rows += "</td>";
        rows += "</tr>";
    });

    $("#to-fill").html(rows);
}

  //---------------------------------------------------------------------------------------------------------------------
  
  function removeFromTable(id){
    $.each(data, function(key, value){
      if(value.id == id){
        data.splice(key, 1);
        $("#" + id).closest("tr").remove();
        return;
      }
    });
  }

  function removeEmployee(id){
    $.ajax({
      url: firstPage + "/" + id,
      type: 'DELETE',
      success: function (result) {
          $("#id-" + id).closest("tr").remove();
          reloadCurrentPage();
      }
  });
  }

  //---------------------------------------------------------------------------------------------------------------------

  function addEmployee(name, lastname, birthdate, hiredate, gender) {
    let payload = {
        "firstName": name,
        "lastName": lastname,
        "birthDate": birthdate,
        "hireDate": hiredate,
        "gender": gender
    }
    $.ajax({
        method: "POST",
        url: "http://localhost:8080",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: reloadCurrentPage()
    });
  }

  function saveEmployee() {

    let gender = "M";
    if ($("#radio-female").prop("checked")) {
        gender = "F";
    }

    addEmployee(
        $("#input-name").val().trim(),
        $("#input-lastname").val().trim(),
        $("#input-birthdate").val(),
        $("#input-hiredate").val(),
        gender);

    resetModalInputs();
  }

  /*function saveEmployee(payload){
    $.ajax({
      method: "POST",
      url: "http://localhost:8080",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(payload)
    });
  }

  function saveModalInputs(){
    addEmployee(
      $("#name").val().trim(),
      $("#lastname").val().trim(),
      $("#birthday").val(),
      $("#hiring-date").val(),
      $("#gender").val()
    );
    updateEmployees();
  }*/

  //---------------------------------------------------------------------------------------------------------------------
  
  function showMore() {
    $("#show-more").addClass("d-none");
    $("#show-less").removeClass("d-none");

    $(".extra-info").each(function () {
        $(this).removeClass("d-none");
    });
  }

  function showLess() {
    $("#show-more").removeClass("d-none");
    $("#show-less").addClass("d-none");

    $(".extra-info").each(function () {
        $(this).addClass("d-none");
    });
  }

  function reloadCurrentPage() {
    setTimeout(function () { //Il server impiega più tempo a salvare il nuovo utente che a rimandare la nuova pagina
        $.get("http://localhost:8080?page=" + pageData.page.number + "&size=20", function (values, status) {
            defaultInstructions(values);
        });
    }, 50);
  }

  //---------------------------------------------------------------------------------------------------------------------

  $(window).on("load", function () {
    loadFirstPage();
  });

  var firstPage = "http://localhost:8080";
  var pageData;
  var data;
  var totPages;

  function loadFirstPage() {
    $.get(firstPage, function (values, status) {
        defaultInstructions(values);
    });
  }
  function loadPreviousPage() {
      $.get(pageData._links.prev.href, function (values, status) {
          defaultInstructions(values);
      });
  }
  function loadNextPage() {
      $.get(pageData._links.next.href, function (values, status) {
          defaultInstructions(values);
      });
  }
  function loadLastPage() {
      $.get(pageData._links.last.href, function (values, status) {
          defaultInstructions(values);
      });
  }

  function updatePageNumber(number){
    $("#page-counter").text(number+1);
  }

  var data;

  function defaultInstructions(values) {
    data = values._embedded.employees;
    pageData = values;
    totPages = values.page.totalPages;
    updatePageNumber(values.page.number + 1);
    displayEmployees();
    checkPageButtons(values.page.number);
  }

  //---------------------------------------------------------------------------------------------------------------------

  var open = 0;
  function modifyEmployee(id) {
    showMore();
    open++;
    //change the button
    $("#change-" + id).removeClass("btn-primary");
    $("#change-" + id).addClass("btn-success");
    $("#change-" + id).text("Salva");
    $("#change-" + id).attr("onclick", "saveChanges(" + id + ")");

    //show inputs
    for (let i = 1; i < attributes.length; i++) { //there is no id hidden input
        $("#input-" + attributes[i] + "-" + id).removeClass("d-none");
        $("#text-" + attributes[i] + "-" + id).addClass("d-none");
    }

  }

  function saveChanges(id) {
      open--;
      if (open === 0) showLess();

      //change the button
      $("#change-" + id).removeClass("btn-success");
      $("#change-" + id).addClass("btn-primary");
      $("#change-" + id).text("Modifica");
      $("#change-" + id).attr("onclick", "modifyEmployee(" + id + ")");

      let newAttributes = [];

      for (let i = 1; i < attributes.length; i++) { //there is no id hidden input
          $("#input-" + attributes[i] + "-" + id).addClass("d-none");
          $("#text-" + attributes[i] + "-" + id).removeClass("d-none");

          switch (i) { //reset text inputs & savcs them in newAttributes
              case 1: case 2: case 5:
                  if ($("#input-" + attributes[i] + "-" + id).val().trim() == "") { //check if input is empty
                      newAttributes.push($("#text-" + attributes[i] + "-" + id).text());
                  }
                  else {
                      newAttributes.push($("#input-" + attributes[i] + "-" + id).val());
                  }
                  break;
              case 3: case 4:
                  newAttributes.push($("#input-" + attributes[i] + "-" + id).val());
                  break;
          }
      }
      let payload = {
          "firstName": newAttributes[0],
          "lastName": newAttributes[1],
          "birthDate": newAttributes[2],
          "hireDate": newAttributes[3],
          "gender": newAttributes[4]
      };

      changeEmployeeData(payload, id);
  }

  function changeEmployeeData(payload, id) {

    $.ajax({
        method: "PUT",
        url: firstPage + "?id=" + id,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function () {

            //change the text only when it has changed in the database
            for (let i = 1; i < attributes.length; i++) {
                switch (i) {
                    case 1: case 2: case 5:
                        if ($("#input-" + attributes[i] + "-" + id).val().trim() != "") { //check if input isn't empty
                            $("#text-" + attributes[i] + "-" + id).text($("#input-" + attributes[i] + "-" + id).val()); //set cell text to new value
                            $("#input-" + attributes[i] + "-" + id).prop("placeholder", $("#input-" + attributes[i] + "-" + id).val()); //set new placeholder value
                        }
                        $("#input-" + attributes[i] + "-" + id).val(""); //empty input
                        break;
                    case 3: case 4:
                        $("#text-" + attributes[i] + "-" + id).text($("#input-" + attributes[i] + "-" + id).val()); //set cell date text to new value
                        break;
                }
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Errore, le modifiche non sono state applicate");
            console.log("Operazione fallita", jqXHR, textStatus, errorThrown);
        }
    });
  }

  //---------------------------------------------------------------------------------------------------------------------

  function updatePageNumber(num) {
    $("#previous-page").text(num - 1);
    $("#current-page").text(num);
    $("#next-page").text(num + 1);
    $("#last-page").text(totPages);
}

function checkPageButtons(pageNum) {
  noDisplay = "d-none";

  switch (pageNum) {
    case 0:
      $("#first-page").removeClass(noDisplay);
      $("#previous-page").addClass(noDisplay);
      $("#previous-page-arrow").addClass(noDisplay);

      $("#next-page").removeClass(noDisplay);
      $("#last-page").removeClass(noDisplay);

      break;
    case totPages-1:
      $("#next-page").addClass(noDisplay);
      $("#last-page").addClass(noDisplay);
      $("#next-page-arrow").addClass(noDisplay);

      $("#previous-page-arrow").removeClass(noDisplay);
      $("#first-page").removeClass(noDisplay);
      $("#previous-page").removeClass(noDisplay);
      break;
    default:
      $("#next-page-arrow").removeClass(noDisplay);
      $("#previous-page-arrow").removeClass(noDisplay);
      $("#first-page").removeClass(noDisplay);
      $("#previous-page").removeClass(noDisplay);
      $("#next-page").removeClass(noDisplay);
      $("#last-page").removeClass(noDisplay);
  }
} 