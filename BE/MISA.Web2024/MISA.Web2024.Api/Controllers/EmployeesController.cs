using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.Web2024.Api.Model;
using MySqlConnector;
using Dapper;
using System.Reflection.Metadata;

namespace MISA.Web2024.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {   /// <summary>
        /// Lấy danh sách nhân viên
        /// </summary>
        /// <returns>
        /// 200- Danh sách nhân viên
        /// 204- Không có dữ liệu
        /// 500 - Có exception
        /// 
        /// </returns>
        /// Created by: HaiPTB20DCCN222 (18/7/2024)
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                //Khởi tạo két nối tới DB
                var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai ; User Id= manhnv; Password = 12345678";
                //1 Khởi tạo kết nối với MARIADb;
                var SqlConnection = new MySqlConnection(connectionString);

                //2 Lấy dữ liệu
                //2.1 Câu lệnh truy vấn giữ liệu;
                var sqlCommand = "SELECT * FROM Employee";
                //2.2 Lấy giữ liệu
                var employees = SqlConnection.Query<Employee>(sql: sqlCommand);

                //Trả kết quả cho client
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }

        }
        /// <summary>
        /// lấy nhân viên theo khóa chính
        /// </summary>
        /// <param name="EmployeeId"></param>
        /// <returns>
        /// 200- Thông tin nhân viên
        /// 204- Không có dữ liệu
        /// 500 - Có exception
        /// 
        /// </returns>
        ///  Created by: HaiPTB20DCCN222 (19/7/2024)
        [HttpGet("{EmployeeId}")]
        public IActionResult GetByID(Guid EmployeeId)
        {
            try
            {
                //Khởi tạo két nối tới DB
                var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai ; User Id= manhnv; Password = 12345678";
                //1 Khởi tạo kết nối với MARIADb;
                var SqlConnection = new MySqlConnection(connectionString);

                //2 Lấy dữ liệu
                //2.1 Câu lệnh truy vấn giữ liệu;
                var sqlCommand = $"SELECT * FROM Employee WHERE EmployeeId = @EmployeeId";
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId);
                //2.2 Lấy giữ liệu
                var employees = SqlConnection.QueryFirstOrDefault<object>(sql: sqlCommand, param: parameters);

                //Trả kết quả cho client
                return Ok(employees);
            }
            catch (Exception ex)
            { 
                return HandleException(ex);
            }

        }
        /// <summary>
        /// Xóa nhân viên theo khóa chính
        /// </summary>
        /// <param name="EmployeeId">khóa chính bảng nhân viên</param>
        /// <returns>
        /// 
        /// </returns>
        ///  Created by: HaiPTB20DCCN222 (19/7/2024)
        [HttpDelete("{EmployeeId}")]
        public IActionResult DeleteByID(Guid EmployeeId)
        {
            //Khởi tạo két nối tới DB
            var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai ; User Id= manhnv; Password = 12345678";
            //1 Khởi tạo kết nối với MARIADb;
            var SqlConnection = new MySqlConnection(connectionString);

            //2 Lấy dữ liệu
            //2.1 Câu lệnh truy vấn giữ liệu;
            var sqlCommand = $"DELETE FROM Employee WHERE EmployeeId = @EmployeeId";
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@EmployeeId", EmployeeId);
            //2.2 Lấy giữ liệu
            var employees = SqlConnection.QueryFirstOrDefault<object>(sql: sqlCommand, param: parameters);

            //Trả kết quả cho client
            return Ok(employees);
        }
        /// <summary>
        /// Thêm nhân viên mới
        /// </summary>
        /// <param name="employee">Thông tin nhân viên</param>
        /// <returns>
        /// 201 - Thêm mới thành công
        /// 400 - Đầu vào có dữ liệu không hợp lệ
        /// 500 - Có exception
        /// </returns>
        /// Created by: HaiPTB20DCCN222 (18/7/2024)
        [HttpPost]
        public IActionResult Post(Employee employee)
        {
            try
            {
                //Khai báo thông tin cần thiết
                var error = new ErrorService();
                var errorData = new Dictionary<string, string>();

                //Bước 1 Validate dữ liệu trả về mã 400 kèm các thông tin lỗi cần thiêt

                //1.1 Mã nhân viên bắt buộc nhập và không được trùng với người khác
                if (string.IsNullOrEmpty(employee.EmployeeCode))
                {
                    errorData.Add("EmployeeCode-empty", Resources.ResourceVN.ValidateError_EmployeeCodeNotEmpty);
                }
                else {
                    if (CheckEmployeeCode(employee.EmployeeCode))
                    {
                        errorData.Add("EmployeeCode-duplicate", Resources.ResourceVN.ValidateError_EmployeeCodeDuplicate);
                    }
                }
                
                //1.2 Tên nhân viên bắt buộc nhập
                if (string.IsNullOrEmpty(employee.FullName))
                {
                    errorData.Add("FullName", Resources.ResourceVN.ValidateError_FullNameNotEmpty);

                }

                ////1.3 Số CMTND bát buộc nhập
                if (string.IsNullOrEmpty(employee.IdentifyNumber))
                {
                    errorData.Add("IdentifyNumber", Resources.ResourceVN.ValidateError_IdentifyNumberNotEmpty);
                }

                ////1.4 Sđt bắt buộc nhập
                if (string.IsNullOrEmpty(employee.PhoneNumber))
                {
                    errorData.Add("PhoneNumber", Resources.ResourceVN.ValidateError_PhoneNumberNotEmpty);
                }

                ////1.5 Email bắt buộc nhập và đúng định dạng
                if (string.IsNullOrEmpty(employee.Email))
                {
                    errorData.Add("Email-empty", Resources.ResourceVN.ValidateError_EmailNotEmpty);
                }
                else {
                    if (!IsValidEmail(employee.Email))
                    {
                        errorData.Add("Email-form", Resources.ResourceVN.ValidateError_EmailNotFomat);
                    }
                }
                
                //1.6 Ngày sinh và ngày cấp không được phép lớn hơn ngày hiện tại
                if(employee.DateOfBirth > DateTime.Now){
                        errorData.Add("DateOfBirth", Resources.ResourceVN.ValidateError_DateOfBirth);
                }
                if(employee.IdentifyDate > DateTime.Now){
                        errorData.Add("IdentifyDate", Resources.ResourceVN.ValidateError_IdentyfiDate);
                }
                //1.7 Kiểm tra lỗi và trả về cho người dùng
                if (errorData.Count > 0)
                {
                    error.DevMsg = Resources.ResourceVN.Error_ValidateData;
                    error.Data = errorData;
                    return BadRequest(error);
                }

                //Bước 2 Khởi tạo kết nối với DB;
                var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai ; User Id= manhnv; Password = 12345678";
                var SqlConnection = new MySqlConnection(connectionString);

                //Bước 3: Thêm mới dữ liệu vào DB:
                var sqlCommand = "Proc_InsertEmployee";
                var dynamicParam = new DynamicParameters();
                dynamicParam.Add("@m_EmployeeID", Guid.NewGuid());
                dynamicParam.Add("@m_EmployeeCode", employee.EmployeeCode);
                dynamicParam.Add("@m_Fullname", employee.FullName);
                dynamicParam.Add("@m_DateOfBirth", employee.DateOfBirth);
                dynamicParam.Add("@m_Gender", employee.Gender);
                dynamicParam.Add("@m_IdentifyNumber", employee.IdentifyNumber);
                dynamicParam.Add("@m_IdentifyDate", employee.IdentifyDate);
                dynamicParam.Add("@m_IdentifyPlace", employee.IdentifyPlace);
                dynamicParam.Add("@m_Email", employee.Email);
                dynamicParam.Add("@m_PhoneNumber", employee.PhoneNumber);
                dynamicParam.Add("@m_LandlineNumber", employee.LandlineNumber);
                dynamicParam.Add("@m_BankAccount", employee.BankAccount);
                dynamicParam.Add("@m_BankName", employee.BankName);
                dynamicParam.Add("@m_BankBranch", employee.BankBranch);
                dynamicParam.Add("@m_Address", employee.Address);
                dynamicParam.Add("@m_PositionId", employee.PositionId);
                dynamicParam.Add("@m_DepartmentId", employee.DepartmentId);
                dynamicParam.Add("@m_CreatedDate", DateTime.Now);
                dynamicParam.Add("@m_CreatedBy", "HaiPT");
                dynamicParam.Add("@m_ModifiedDate", null);
                dynamicParam.Add("@m_ModifiedBy", null);

                //Tạo mới employeeID:
                employee.EmployeeId = Guid.NewGuid();
                var res = SqlConnection.Execute(sql: sqlCommand, param: dynamicParam, commandType: System.Data.CommandType.StoredProcedure);


                //Bưóc 4 Trả kết quả cho client
                if(res > 0)
                {
                    return StatusCode(201, res);
                }else
                {
                    return Ok(res);
                }
            }
            catch (Exception ex) {
                return HandleException(ex);
            }
        }

        /// <summary>
        /// Sửa thông tin nhân viên
        /// </summary>
        /// <param name="id">Mã nhân viên</param>
        /// <param name="employee">Thông tin nhân viên</param>
        /// <returns>
        /// Trả về kết quả của quá trình cập nhật thông tin nhân viên.
        /// 
        /// Mã lỗi:
        /// - 200: Cập nhật thông tin nhân viên thành công.
        /// - 404: Không tìm thấy nhân viên.
        /// - 500: Lỗi máy chủ.
        /// - 400: Thông tin sửa chưa đúng yêu cầu
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (27/7/2023)
        /// 
        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(Guid id, [FromBody] Employee employee)
        {
            try
            {   //Khai báo thông tin cần thiết
                var error = new ErrorService();
                var errorData = new Dictionary<string, string>();

                //Bước 1 Validate dữ liệu trả về mã 400 kèm các thông tin lỗi cần thiêt

                //1.1 Mã nhân viên bắt buộc nhập và không được trùng với người khác
                if (string.IsNullOrEmpty(employee.EmployeeCode))
                {
                    errorData.Add("EmployeeCode-empty", Resources.ResourceVN.ValidateError_EmployeeCodeNotEmpty);
                }
                else
                {
                    string currentEmployeeCode = GetEmployeeCodeById(id);

                    // Kiểm tra mã nhân viên mới có tồn tại không, bỏ qua mã của nhân viên hiện tại
                    if (CheckEmployeeCodeExists(employee.EmployeeCode, currentEmployeeCode))
                    {
                        errorData.Add("EmployeeCode-duplicate", Resources.ResourceVN.ValidateError_EmployeeCodeDuplicate);
                    }
                }

                //1.2 Tên nhân viên bắt buộc nhập
                if (string.IsNullOrEmpty(employee.FullName))
                {
                    errorData.Add("FullName", Resources.ResourceVN.ValidateError_FullNameNotEmpty);

                }

                ////1.3 Số CMTND bát buộc nhập
                if (string.IsNullOrEmpty(employee.IdentifyNumber))
                {
                    errorData.Add("IdentifyNumber", Resources.ResourceVN.ValidateError_IdentifyNumberNotEmpty);
                }

                ////1.4 Sđt bắt buộc nhập
                if (string.IsNullOrEmpty(employee.PhoneNumber))
                {
                    errorData.Add("PhoneNumber", Resources.ResourceVN.ValidateError_PhoneNumberNotEmpty);
                }

                ////1.5 Email bắt buộc nhập và đúng định dạng
                if (string.IsNullOrEmpty(employee.Email))
                {
                    errorData.Add("Email-empty", Resources.ResourceVN.ValidateError_EmailNotEmpty);
                }
                else
                {
                    if (!IsValidEmail(employee.Email))
                    {
                        errorData.Add("Email-form", Resources.ResourceVN.ValidateError_EmailNotFomat);
                    }
                }

                //1.6 Ngày sinh và ngày cấp không được phép lớn hơn ngày hiện tại
                if(employee.DateOfBirth > DateTime.Now){
                        errorData.Add("DateOfBirth", Resources.ResourceVN.ValidateError_DateOfBirth);
                }
                if(employee.IdentifyDate > DateTime.Now){
                        errorData.Add("IdentifyDate", Resources.ResourceVN.ValidateError_IdentyfiDate);
                }
                //1.7 Kiểm tra lỗi và trả về cho người dùng
                if (errorData.Count > 0)
                {
                    error.DevMsg = Resources.ResourceVN.Error_ValidateData;
                    error.Data = errorData;
                    return BadRequest(error);
                }

                // Khởi tạo kết nối tới DB
                var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai; User Id=manhnv; Password=12345678";

                // Khởi tạo kết nối với MARIADb
                using (var sqlConnection = new MySqlConnection(connectionString))   
                {
                    // Câu lệnh gọi stored procedure
                    var sqlCommand = "CALL PTIT_B20DCCN222_PhamTienHai.Proc_UpdateEmployee(@EmployeeId, @EmployeeCode, @FullName, @DateOfBirth, @Gender, @IdentifyNumber, @IdentifyDate, @IdentifyPlace, @Email, @PhoneNumber, @LandlineNumber, @BankAccount, @BankName, @BankBranch, @Address, @PositionId, @DepartmentId, @CreatedDate, @CreatedBy, @ModifiedDate, @ModifiedBy)";

                    // Thiết lập tham số cho stored procedure
                    var parameters = new
                    {
                        EmployeeId = id,
                        EmployeeCode = employee.EmployeeCode,
                        FullName = employee.FullName,
                        DateOfBirth = employee.DateOfBirth,
                        Gender = employee.Gender,
                        IdentifyNumber = employee.IdentifyNumber,
                        IdentifyDate = employee.IdentifyDate,
                        IdentifyPlace = employee.IdentifyPlace,
                        Email = employee.Email,
                        PhoneNumber = employee.PhoneNumber,
                        LandlineNumber = employee.LandlineNumber,
                        BankAccount = employee.BankAccount,
                        BankName = employee.BankName,
                        BankBranch = employee.BankBranch,
                        Address = employee.Address,
                        PositionId = employee.PositionId,
                        DepartmentId = employee.DepartmentId,
                        CreatedDate = employee.CreatedDate ?? DateTime.Now, // Nếu không có giá trị thì lấy thời gian hiện tại
                        CreatedBy = employee.CreatedBy,
                        ModifiedDate = DateTime.Now, // Cập nhật thời gian sửa
                        ModifiedBy = "HaiPT" // Cập nhật tên người chỉnh sửa
                    };

                    // Thực hiện cập nhật dữ liệu
                    int rowsAffected = sqlConnection.Execute(sqlCommand, parameters);

                    // Kiểm tra số hàng bị ảnh hưởng
                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Cập nhật thông tin nhân viên thành công" });
                    }
                    else
                    {
                        return NotFound(new { message = "Không tìm thấy nhân viên" });
                    }
                }
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }


        /// <summary>
        /// Kiểm tra mã nhân viên có bị trùng hay không
        /// </summary>
        /// <param name="employeeCode">Mã nhân viên</param>
        /// <returns>
        /// true - trùng
        /// false - không trùng
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (24/7/2023)
        private Boolean CheckEmployeeCode(String employeeCode) {

            var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai ; User Id= manhnv; Password = 12345678";
            var SqlConnection = new MySqlConnection(connectionString);
            var SqlCheck = "SELECT EmployeeCode FROM Employee WHERE EmployeeCode = @EmployeeCode";
            var dynamicParam = new DynamicParameters();
            dynamicParam.Add("@EmployeeCode", employeeCode);
            var res = SqlConnection.QueryFirstOrDefault<string>(sql: SqlCheck, param: dynamicParam);
            if (res != null) {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Hàm xử lí khi trả về lỗi
        /// </summary>
        /// <param name="ex">Lỗi hệ thống</param>
        /// <returns>
        ///  Mã lỗi - Chi tiết lỗi
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (24/7/2023)
        
        private IActionResult HandleException(Exception ex)
        {
            var error = new ErrorService();
            error.DevMsg = ex.Message;
            error.UserMsg = Resources.ResourceVN.Error_Exception;
            error.Data = ex.Data;
            return StatusCode(500, error);
        }

        /// <summary>
        /// Kiểm tra email có đúng định dạng hay không
        /// </summary>
        /// <param name="email">tên mail</param>
        /// <returns>
        /// true - đúng
        /// false - sai
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (24/7/2023)
        bool IsValidEmail(string email)
        {
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false; 
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
    

        }
        /// <summary>
        /// Kiểm tra code nhân viên khi update  có trùng hay không
        /// </summary>
        /// <param name="employeeCode">mã nhân viên bỏ qua k xét</param>
        /// <param name="currentEmployeeCode">mã nv cần kiểm tra</param>
        /// 
        /// <returns>
        /// true - lặp
        /// false - k lặp
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (27/7/2023)
        private bool CheckEmployeeCodeExists(string employeeCode, string currentEmployeeCode)
        {
            var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai; User Id=manhnv; Password=12345678";

            using (var sqlConnection = new MySqlConnection(connectionString))
            {
                var sqlCommand = "SELECT COUNT(*) FROM Employee WHERE EmployeeCode = @EmployeeCode AND EmployeeCode != @CurrentEmployeeCode";
                var parameters = new
                {
                    EmployeeCode = employeeCode,
                    CurrentEmployeeCode = currentEmployeeCode
                };

                int count = sqlConnection.ExecuteScalar<int>(sqlCommand, parameters);
                return count > 0;
            }
        }
        /// <summary>
        /// Kiểm tra code nhân viên khi update  có trùng hay không
        /// </summary>
        /// <param name="employeeId">id của nhân viên</param>
        /// <returns>
        /// Thông tin về code nhân viên
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (27/7/2023)
        private string GetEmployeeCodeById(Guid employeeId)
        {
            var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai; User Id=manhnv; Password=12345678";

            using (var sqlConnection = new MySqlConnection(connectionString))
            {
                var sqlCommand = "SELECT EmployeeCode FROM Employee WHERE EmployeeId = @EmployeeId";
                var parameters = new { EmployeeId = employeeId };

                string employeeCode = sqlConnection.QueryFirstOrDefault<string>(sqlCommand, parameters);
                return employeeCode;
            }
        }
    }
}
