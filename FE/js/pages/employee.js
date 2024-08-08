$(document).ready(function () {
  //Khai bao cổng localhost chung
  var port = 7240; //Thay đổi cổng ở đây
  //Chức năng tìm kiếm
  $("#search").on("keyup", function () {
    // Lấy giá trị từ input
    var searchText = $(this).val().toLowerCase();
    //Duyệt qua từng hàng
    $(".table-employee tbody tr").each(function () {
      var rowData = $(this).find(".cell-content");
      var found = false;

      //Duyệt qua cột mã và tên
      rowData.each(function (index) {
        if (index === 1 || index === 2) {
          if ($(this).text().toLowerCase().indexOf(searchText) !== -1) {
            found = true;
            return false;
          }
        }
      });

      if (found) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
  $(".minimize-menu .minize-contain").click(function () {
    var addColumn = $(
      ".main-content .table-employee-contain .table-employee .add"
    );
    var icon = $(this).find("i.fa-solid.fa-angle-left");
    if (addColumn.width() === 387) {
      addColumn.css("width", "580px");
    } else {
      addColumn.css("width", "387px");
    }
    $(".nav-container").toggleClass("minimized");
    icon.toggleClass("rotate-180");
  });
  let employeeData = []; // Biến để lưu trữ dữ liệu nhân viên từ API
  let currentPage = 1; //Trang mặc định là 1
  let rowsPerPage = 100; // Giá trị mặc đinh ban đầu là 100ng / page
  function initPagination() {
    //Tính số hàng
    const $tableBody = $(".table-body");
    const $rows = $tableBody.find("tr");
    const totalRows = $rows.length;
    //Tính số page
    let totalPages = Math.ceil(totalRows / rowsPerPage);
    // hiển thị các dòng dữ liệu tương ứng với trang được chỉ định trên bảng
    function displayTablePage(page) {
      $rows.hide();
      $rows.slice((page - 1) * rowsPerPage, page * rowsPerPage).show();
      $(".sum p").text(`Tổng: ${totalRows}`);
    }

    function updateTotalPages() {
      totalPages = Math.ceil(totalRows / rowsPerPage);
      currentPage = Math.min(currentPage, totalPages);
    }

    function createPaginationControls() {
      $(".fa-angle-left").on("click", function () {
        if (currentPage > 1) {
          currentPage--;
          displayTablePage(currentPage);
        }
      });

      $(".fa-angle-right").on("click", function () {
        if (currentPage < totalPages) {
          currentPage++;
          displayTablePage(currentPage);
        }
      });

      $(".fa-angle-up").on("click", function () {
        if (rowsPerPage < 100) {
          rowsPerPage = Math.min(rowsPerPage + 10, 100);
          $(".amount").text(rowsPerPage);
          updateTotalPages();
          displayTablePage(currentPage);
        }
      });

      $(".fa-angle-down").on("click", function () {
        if (rowsPerPage > 10) {
          rowsPerPage = Math.max(rowsPerPage - 10, 10);
          $(".amount").text(rowsPerPage);
          updateTotalPages();
          displayTablePage(currentPage);
        }
      });
    }

    displayTablePage(currentPage);
    createPaginationControls();
  }
  // Hiển thị toast container
  function showToast() {
    $(".toast-container").show();
    setTimeout(function () {
      hideToast();
    }, 4000); // Sau 3s bien mat
  }

  // Ẩn toast container
  function hideToast() {
    $(".toast-container").hide();
  }
  $("#close-toast").click(function () {
    hideToast();
  });
  function loadData() {
    $(".table-body").empty();
    $(".m-loading").show();
    // Gọi API để lấy dữ liệu nhân viên
    $.ajax({
      type: "GET",
      url: "http://localhost:" + port + "/api/v1/Employees",
      success: function (response) {
        employeeData = response; // Lưu dữ liệu vào biến toàn cục
        let stt = 1;
        let countEmployees = employeeData.length;
        $(".sum").text("Tổng: " + countEmployees);
        for (const employee of response) {
          let id = employee.employeeId;
          let code = employee.employeeCode;
          let name = employee.fullName;
          let genderValue = employee.gender;
          let gen;

          if (genderValue === 1) {
            gen = "Nam";
          } else if (genderValue === 0) {
            gen = "Nữ";
          } else {
            gen = "";
          }

          let dob = employee.dateOfBirth
            ? formatDate(employee.dateOfBirth)
            : "";
          let mail = employee.email ? employee.email : "";
          let address = employee.address ? employee.address : "";
          var employee_row = `<tr>
                    <td><div class="cell-content">${stt} <p class="employee-id">${id}</p></div></td>
                    <td><div class="cell-content" id="${code}">${code}</div></td>
                    <td><div class="cell-content">${name}</div></td>
                    <td><div class="cell-content">${gen}</div></td>
                    <td><div class="cell-content">${dob}</div></td>
                    <td><div class="cell-content">${mail}</div></td>
                    <td class="about-employee">
                      <div class="cell-content">${address}</div>
                      <div class="employee-interact">
                        <div class="update-container">
                            <i class="fa-solid fa-pen"></i>
                        </div>
                        <div class="delete-container">
                          <img
                            class="delete-icon"
                            src="Resource/icon/delete-48.png"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>`;
          $(".table-body").append(employee_row);
          stt++;
        }
        /// Tìm mã nhân viên có số lớn nhất
        let maxEmployeeCode = employeeData.reduce((maxCode, currentEmployee) => {
          // Lấy mã nhân viên hiện tại
          let currentCode = currentEmployee.employeeCode;
          // So sánh số trong mã nhân viên
          if (extractNumberFromCode(currentCode) > extractNumberFromCode(maxCode)) {
              return currentCode;
          }
          return maxCode;
        }, 'NV-0'); // Khởi tạo với mã nhân viên nhỏ nhất có thể
        // Lấy số lớn nhất từ mã nhân viên lớn nhất
        let maxNumber = extractNumberFromCode(maxEmployeeCode);

        // Tính mã mới bằng cách cộng thêm 1
        let newNumber = maxNumber + 1;
        let newEmployeeCode = `NV-${newNumber.toString().padStart(3, '0')}`; // Định dạng lại mã nhân viên mới

        $("#idAdd").val(newEmployeeCode);

        $(".m-loading").hide();
        initPagination(); // Khởi tạo phân trang sau khi tải dữ liệu thành công
      },
      error: function (xhr, status, error, response) {
        console.error("Status: " + status);
        console.error("Error: " + error);
      },
    });
  }
  //Lấy danh sách phòng ban
  $.ajax({
    type: "GET",
    url: "http://localhost:"+port+"/api/v1/Departments",
    success: function (response) {
      for (const department of response) {
        var phongban = `<option value="${department.departmentID}">${department.departmentName}</option>`;
        $("#phongbanAdd").append(phongban);
        $("#phongbanUpdate").append(phongban);
      }
    },
    error: function (response) {
      alert("Loi");
    },
  });
  //Lấy danh sách vị trí
  $.ajax({
    type: "GET",
    url: "http://localhost:"+port+"/api/v1/Positions",
    success: function (response) {
      for (const position of response) {
        var vitri = `<option value="${position.positionId}">${position.positionName}</option>`;
        $("#positionAdd").append(vitri);
        $("#positionUpdate").append(vitri);
      }
    },
    error: function (response) {
      alert("Loi");
    },
  });
  // Nạp dữ liệu nhân viên
  loadData();

  //nut load lại dữ liệu trên trang chủ
  $(".refresh-container").on("click", function () {
    loadData();
  });

  //Hien thị form thêm nhân viên
  $("#btnAdd").click(function () {
    $("#AddDialog").addClass("show");
    $("#idAdd").focus();
  });
  //Tắt form thêm nhân viên
  $(".form-header.add i").click(function () {
    $("#AddDialog").removeClass("show");
    $(".error-message").text("").hide();
    $("input[type='text'], input[type='number'], input[type='date']")
      .not("#idAdd")
      .val("");
    $("input[type='radio']").prop("checked", false);
    $("select").prop("selectedIndex", 0);
  });
  //Hủy thêm nhân viên
  $(".employ-infor-row6 .cancel.add").click(function () {
    $("#AddDialog").removeClass("show");
    $(".error-message").text("").hide();
    $("input[type='text'], input[type='number'], input[type='date']")
      .not("#idAdd")
      .val("");
    $("input[type='radio']").prop("checked", false);
    $("select").prop("selectedIndex", 0);
  });
  //Hiển thị form sửa
  $(document).on("click", ".employee-interact .update-container", function () {
    var currentRow = $(this).closest("tr")[0];
    var cells = currentRow.cells;
    var firstCell = cells[0].textContent;
    const parts = firstCell.split(" ");
    var id = parts[1];
    $("#UpdateDialog").addClass("show");
    $("#idUpdate").focus();
    $.ajax({
      type: "GET",
      url: "http://localhost:" + port + "/api/v1/Employees/" + id,
      success: function (response) {
        // Lấy thông tin nhân viên từ response
        var id = response.EmployeeID;
        var code = response.EmployeeCode;
        var name = response.Fullname;
        let genderValue = response.Gender;
        let gen;
        if (genderValue === 1) {
          gen = "Nam";
        } else if (genderValue === 0) {
          gen = "Nữ";
        } else {
          gen = "Chưa xác định";
        }
        var dob = response.dateOfBirth
          ? response.dateOfBirth.substring(0, 10)
          : "";
        var mail = response.Email;
        var num = response.PhoneNumber;
        var address = response.Address;
        var positon = response.PositionId;
        var cccd = response.IdentifyNumber;
        var cccddate = response.IdentifyDate
          ? response.IdentifyDate.substring(0, 10)
          : "";
        var cccdplace = response.IdentifyPlace;
        var department = response.DepartmentId;
        var position = response.PositionId;
        var landlineNumber = response.LandlineNumber;
        var bankAccount = response.BankAccount;
        var bankName = response.BankName;
        var bankBranch = response.BankBranch;

        // Đổ dữ liệu vào form update
        $("#idUpdate").val(code);
        $("#nameUpdate").val(name);
        // Gán giá trị cho giới tính
        if (gen === "Nam") {
          $("#maleUpdate").prop("checked", true);
        } else if (gen === "Nữ") {
          $("#femaleUpdate").prop("checked", true);
        } else {
          $("#otherUpdate").prop("checked", true);
        }
        $("#didongUpdate").val(num);
        $("#birthdayUpdate").val(dob);
        $("#mailUpdate").val(mail);
        $("#addUpdate").val(address);
        $("#positionUpdate").val(positon);
        $("#cccdUpdate").val(cccd);
        $("#cccd-ngaycapUpdate").val(cccddate);
        $("#noicapUpdate").val(cccdplace);
        $("#phongbanUpdate").val(department);
        $("#positionUpdate").val(position);
        $("#codinhUpdate").val(landlineNumber);
        $("#bankaccUpdate").val(bankAccount);
        $("#bankUpdate").val(bankName);
        $("#bankbranchUpdate").val(bankBranch);

        $(".update-id").text(id),
          // Hiển thị form update
          $("#UpdateDialog").addClass("show");
        $("#idUpdate").focus();
      },
      error: function (xhr, status, error) {
        console.error("Lỗi lấy thông tin nhân viên", error);
      },
    });

    // Xử lý khi click vào close button trong form update
    $(".form-header.update i").click(function () {
      $("#UpdateDialog").removeClass("show");
      $(".error-message").text("").hide();
    });

    // Xử lý khi click vào nút Hủy trong form update
    $(".employ-infor-row6 .cancel.update").click(function () {
      $("#UpdateDialog").removeClass("show");
      $(".error-message").text("").hide();
      $('input[type="text"], input[type="number"], input[type="date"]').val("");
      $('input[type="radio"]').prop("checked", false);
    });
  });
  let employeeIdToDelete = null;
  //Xóa nhân viên
  $(document).on("click", ".employee-interact .delete-container", function () {
    // Lấy ID của nhân viên
    var currentRow = $(this).closest("tr")[0];
    var cells = currentRow.cells;
    var firstCell = cells[0].textContent;
    const parts = firstCell.split(" ");
    employeeIdToDelete = parts[1];
    // Hiển thị popup
    $(".popup-container").show();
  });
  $(document).on("click", ".fa-xmark, .popup-cancel", function () {
    // Ẩn popup
    $(".popup-container").hide();
    employeeIdToDelete = null; // Reset ID
  });
  $(document).on(
    "click",
    ".popup-container.delete .popup-continue",
    function () {
      $(".m-loading").show();
      if (employeeIdToDelete) {
        $.ajax({
          type: "DELETE",
          url:
            "http://localhost:" +
            port +
            "/api/v1/Employees/" +
            employeeIdToDelete,
          success: function (response) {
            $(".status-desc").text("Xóa thành công");
            $(".popup-container").hide();
            showToast();
            // Thêm mã để cập nhật giao diện người dùng sau khi xóa
            //an loading
            $(".m-loading").hide();
            //load lai giu lieu
            loadData();
          },
          error: function (response) {
            alert("Không thể xóa");
          },
        });
      }
    }
  );
  // Hàm kiểm tra email hợp lệ
  function isValidEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Hàm kiểm tra ngày hợp lệ
  function isValidDate(date) {
    var today = new Date();
    if (!date) {
      return true;
    }
    return new Date(date) <= today;
  }
  //Validate dữ liệu và sửa nhân viên
  $(".submit.update").click(function () {
    $(".error-message").text("").hide();

    var employeeCode = $("#idUpdate").val().trim();
    var employeeName = $("#nameUpdate").val().trim();
    var employeeCccd = $("#cccdUpdate").val().trim();
    var employeeEmail = $("#mailUpdate").val().trim();
    var employeePhone = $("#didongUpdate").val().trim();
    var employeeDob = $("#birthdayUpdate").val();
    var employeeCccdDate = $("#cccd-ngaycapUpdate").val();
    var employeeDepartmentId = $("#phongbanUpdate").val();
    var employeeCccdPlace = $("#noicapUpdate").val().trim();
    var employeeAddress = $("#addUpdate").val().trim();
    var employeePositionId = $("#positionUpdate").val();
    let employeeLandLineNumber = $("#codinhUpdate").val();
    let employeeBankAccount = $("#bankaccUpdate").val();
    let employeeBankName = $("#bankUpdate").val();
    let employeeBankBranch = $("#bankbranchUpdate").val();
    let gender = "";
    // Sự kiện khi người dùng thay đổi lựa chọn
    if ($("#maleUpdate").prop("checked")) {
      gender = 1; // Nam
    } else if ($("#femaleUpdate").prop("checked")) {
      gender = 0; // Nữ
    } else if ($("#otherUpdate").prop("checked")) {
      gender = 2; // Khác
    }

    var isValid = true;

    if (employeeCode === "") {
      $("#errorIdupdate").text("Mã nhân viên không được để trống.").show();
      isValid = false;
    }
    if (employeeName === "") {
      $("#errorNameupdate").text("Tên nhân viên không được để trống.").show();
      isValid = false;
    }
    if (employeeCccd === "") {
      $("#errorCccdupdate")
        .text("Số chứng minh thư nhân dân không được để trống.")
        .show();
      isValid = false;
    }
    if (employeeEmail === "") {
      $("#errorMailupdate").text("Email không được để trống.").show();
      isValid = false;
    }
    if (!isValidEmail(employeeEmail)) {
      $("#errorMailupdate").text("Email không hợp lệ.").show();
      isValid = false;
    }
    if (employeePhone === "") {
      $("#errorMobileupdate").text("Số điện thoại không được để trống.").show();
      isValid = false;
    }
    if (!isValidDate(employeeDob)) {
      $("#errorDOBUpdate")
        .text("Ngày sinh không được vượt quá ngày hiện tại.")
        .show();
      isValid = false;
    }
    if (!isValidDate(employeeCccdDate)) {
      $("#errorNgaycapUpdate")
        .text("Ngày cấp không được vượt quá ngày hiện tại.")
        .show();
      isValid = false;
    }

    if (isValid) {
      let newEmployee = {
        EmployeeCode: employeeCode,
        FullName: employeeName,
        DateOfBirth: employeeDob,
        Gender: gender,
        PositionId: employeePositionId,
        IdentifyNumber: employeeCccd,
        DateOfBirth: employeeDob === "" ? null : employeeDob,
        DepartmentId: employeeDepartmentId,
        IdentifyPlace: employeeCccdPlace,
        Address: employeeAddress,
        PhoneNumber: employeePhone,
        Email: employeeEmail,
        LandlineNumber: employeeLandLineNumber,
        BankAccount: employeeBankAccount,
        BankName: employeeBankName,
        BankBranch: employeeBankBranch,
        IdentifyDate: employeeCccdDate === "" ? null : employeeCccdDate,
      };
      let id = $(".submit.update .update-id").text();
      $(".m-loading").show();
      $.ajax({
        type: "PUT",
        url: "http://localhost:" + port + "/api/v1/Employees/" + id,
        data: JSON.stringify(newEmployee),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          $(".error-message").text("").hide();
          $(".status-desc").text("Sửa thành công");
          showToast();
          //an loading
          $(".m-loading").hide();
          //an chi tiet
          $("#UpdateDialog").removeClass("show");
          //load lai giu lieu
          loadData();
        },
        error: function (response) {
          $(".m-loading").hide();
          $("#idUpdate").focus();
          $("#errorIdupdate").text("Mã nhân viên đã tồn tại.").show();
          if (response.responseJSON && response.responseJSON.data) {
            let errorData = response.responseJSON.data;
            for (let key in errorData) {
              if (key === "EmployeeCode-duplicate") {
                $("#errorIdupdate").text("Mã nhân viên đã tồn tại.").show();
              }
              if (key === "EmployeeCode-empty") {
                $("#errorIdupdate")
                  .text("Mã nhân viên không được để trống.")
                  .show();
              }
              if (key === "FullName") {
                $("#errorDOBUpdate")
                  .text("Họ và tên không được để trống")
                  .show();
              }
              if (key === "IdentifyNumber") {
                $("#errorCccdupdate")
                  .text("Số CMTND không được để trống.")
                  .show();
              }
              if (key === "PhoneNumber") {
                $("#errorMobileupdate")
                  .text("Số điện thoại không được để trống.")
                  .show();
              }
              if (key === "DateOfBirth") {
                $("#errorDOBUpdate")
                  .text("Ngày sinh không được vượt quá ngày hiện tại.")
                  .show();
              }
              if (key === "IdentifyDate") {
                $("#errorNgaycapUpdate")
                  .text("Ngày cấp không được vượt quá ngày hiện tại.")
                  .show();
              }
            }
          } else {
            console.log(response); // Log toàn bộ response nếu không có dữ liệu lỗi chi tiết
          }
        },
      });
    }
  });
  // Validate dữ liệu và thêm nhân viên
  $(".submit.add").click(function () {
    $(".error-message").text("").hide();
    let employeeCode = $("#idAdd").val().trim();
    let employeeName = $("#nameAdd").val().trim();
    let employeeCccd = $("#cccdAdd").val().trim();
    let employeeEmail = $("#mailAdd").val().trim();
    let employeePhone = $("#didongAdd").val().trim();
    let employeeDob = $("#birthdayAdd").val();
    let employeeCccdDate = $("#cccd-ngaycapAdd").val();
    let employeeAddress = $("#addAdd").val().trim();
    let employeeCccdPlace = $("#noicapAdd").val().trim();
    let employeePositionId = $("#positionAdd").val();
    let employeeDepartmentId = $("#phongbanAdd").val();
    let employeeLandLineNumber = $("#codinhAdd").val();
    let employeeBankAccount = $("#bankaccAdd").val();
    let employeeBankName = $("#bankAdd").val();
    let employeeBankBranch = $("#bankbranchAdd").val();

    let gender = null;

    if ($("#maleAdd").prop("checked")) {
      gender = 1; // Nam
    } else if ($("#femaleAdd").prop("checked")) {
      gender = 0; // Nữ
    } else if ($("#otherAdd").prop("checked")) {
      gender = 2; // Khác
    }

    var isValid = true;

    if (employeeCode === "") {
      $("#errorId").text("Mã nhân viên không được để trống.").show();
      isValid = false;
    }
    if (employeeName === "") {
      $("#errorName").text("Tên nhân viên không được để trống.").show();
      isValid = false;
    }
    if (employeeCccd === "") {
      $("#errorCccd")
        .text("Số chứng minh thư nhân dân không được để trống.")
        .show();
      isValid = false;
    }
    if (employeeEmail === "") {
      $("#errorEmail").text("Email không được để trống.").show();
      isValid = false;
    }
    if (!isValidEmail(employeeEmail)) {
      $("#errorEmail").text("Email không hợp lệ.").show();
      isValid = false;
    }
    if (employeePhone === "") {
      $("#errorMobile").text("Số điện thoại không được để trống.").show();
      isValid = false;
    }
    if (!isValidDate(employeeDob)) {
      $("#errorBirthday")
        .text("Ngày sinh không được vượt quá ngày hiện tại.")
        .show();
      isValid = false;
    }
    if (!isValidDate(employeeCccdDate)) {
      $("#errorCccdDate")
        .text("Ngày cấp không được vượt quá ngày hiện tại.")
        .show();
      isValid = false;
    }

    if (isValid) {
      let newEmployee = {
        EmployeeCode: employeeCode,
        FullName: employeeName,
        DateOfBirth: employeeDob === "" ? null : employeeDob,
        Gender: gender,
        Email: employeeEmail,
        PhoneNumber: employeePhone,
        IdentifyNumber: employeeCccd,
        Address: employeeAddress,
        IdentifyDate: employeeCccdDate === "" ? null : employeeCccdDate,
        IdentifyPlace: employeeCccdPlace,
        DepartmentId: employeeDepartmentId,
        PositionId: employeePositionId,
        BankAccount: employeeBankAccount,
        BankName: employeeBankName,
        BankBranch: employeeBankBranch,
        LandlineNumber: employeeLandLineNumber,
      };

      $(".m-loading").show();
      $.ajax({
        type: "POST",
        url: "http://localhost:" + port + "/api/v1/Employees/",
        data: JSON.stringify(newEmployee),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          $(".error-message").text("").hide();
          $("input[type='text'], input[type='number'], input[type='date']")
            .not("#idAdd")
            .val("");
          $("input[type='radio']").prop("checked", false);
          $("select").prop("selectedIndex", 0);
          $(".status-desc").text("Thêm thành công");
          showToast();
          $(".m-loading").hide();
          $("#AddDialog").removeClass("show");
          loadData();
        },
        error: function (response) {
          $(".m-loading").hide();
          $("#idAdd").focus();
          $("#errorId").text("Mã nhân viên đã tồn tại.").show();
          if (response.responseJSON && response.responseJSON.data) {
            let errorData = response.responseJSON.data;
            for (let key in errorData) {
              if (key === "EmployeeCode-duplicate") {
                $("#errorId").text("Mã nhân viên đã tồn tại.").show();
              }
              if (key === "EmployeeCode-empty") {
                $("#errorId").text("Mã nhân viên không được để trống.").show();
              }
              if (key === "FullName") {
                $("#errorName").text("Họ và tên không được để trống").show();
              }
              if (key === "IdentifyNumber") {
                $("#errorCccd").text("Số CMTND không được để trống.").show();
              }
              if (key === "PhoneNumber") {
                $("#errorMobile")
                  .text("Số điện thoại không được để trống.")
                  .show();
              }
              if (key === "DateOfBirth") {
                $("#errorBirthday")
                  .text("Ngày sinh không được vượt quá ngày hiện tại.")
                  .show();
              }
              if (key === "IdentifyDate") {
                $("#errorCccdDate")
                  .text("Ngày cấp không được vượt quá ngày hiện tại.")
                  .show();
              }
            }
          } else {
            console.log(response); // Log toàn bộ response nếu không có dữ liệu lỗi chi tiết
          }
        },
      });
    }
  });

  function formatDate(dateString) {
    // Tạo đối tượng Date từ chuỗi ngày tháng
    let date = new Date(dateString);

    // Trích xuất ngày, tháng và năm
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    let year = date.getFullYear();

    // Trả về định dạng dd/mm/yyyy
    return `${day}/${month}/${year}`;
  }
  // Hàm để lấy số từ mã nhân viên
  function extractNumberFromCode(code) {
    // Trích xuất số từ mã nhân viên theo định dạng NV-123
    let match = code.match(/NV-(\d+)/);
    return match ? parseInt(match[1], 10) : -1;
  }
});
