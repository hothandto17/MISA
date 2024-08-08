$(document).ready(function () {
    let employeeData = []; // Biến để lưu trữ dữ liệu nhân viên từ API
    let currentPage = 1;
    let rowsPerPage = 10;
  
    function initPagination() {
      const $tableBody = $('.table-body');
      const $rows = $tableBody.find('tr');
      const totalRows = $rows.length;
      let totalPages = Math.ceil(totalRows / rowsPerPage);
  
      function displayTablePage(page) {
        $rows.hide();
        $rows.slice((page - 1) * rowsPerPage, page * rowsPerPage).show();
        $('.sum p').text(`Tổng: ${totalRows}`);
      }
  
      function updateTotalPages() {
        totalPages = Math.ceil(totalRows / rowsPerPage);
        currentPage = Math.min(currentPage, totalPages);
      }
  
      function createPaginationControls() {
        $('.fa-angle-left').on('click', function () {
          if (currentPage > 1) {
            currentPage--;
            displayTablePage(currentPage);
          }
        });
  
        $('.fa-angle-right').on('click', function () {
          if (currentPage < totalPages) {
            currentPage++;
            displayTablePage(currentPage);
          }
        });
  
        $('.fa-angle-up').on('click', function () {
          if (rowsPerPage < 100) {
            rowsPerPage = Math.min(rowsPerPage + 10, 100);
            $('.amount').text(rowsPerPage);
            updateTotalPages();
            displayTablePage(currentPage);
          }
        });
  
        $('.fa-angle-down').on('click', function () {
          if (rowsPerPage > 10) {
            rowsPerPage = Math.max(rowsPerPage - 10, 10);
            $('.amount').text(rowsPerPage);
            updateTotalPages();
            displayTablePage(currentPage);
          }
        });
      }
  
      displayTablePage(currentPage);
      createPaginationControls();
    }
  
    function loadData() {
      $(".table-body").empty();
      $(".m-loading").show();
      // Gọi API để lấy dữ liệu nhân viên
      $.ajax({
        type: "GET",
        url: "https://cukcuk.manhnv.net/api/v1/Employees",
        success: function (response) {
          employeeData = response; // Lưu dữ liệu vào biến toàn cục
          let stt = 1;
          let countEmployees = employeeData.length;
          $(".sum").text("Tổng: " + countEmployees);
  
          for (const employee of employeeData) {
            let id = employee.EmployeeId;
            let code = employee.EmployeeCode;
            let name = employee.FullName;
            let gen = employee.Gender == 1 ? "Nam" : "Nữ";
            let dob = employee.DateOfBirth ? employee.DateOfBirth.substring(0, 10) : "";
            let mail = employee.Email ? employee.Email : "";
            let address = employee.Address ? employee.Address : "";
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
  
          $(".m-loading").hide();
          initPagination(); // Khởi tạo phân trang sau khi tải dữ liệu thành công
        },
        error: function (xhr, status, error) {
          console.error("Status: " + status);
          console.error("Error: " + error);
        },
      });
    }
  
    loadData(); // Gọi hàm loadData để tải dữ liệu từ API và khởi tạo phân trang
  });
  