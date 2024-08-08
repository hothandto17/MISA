using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.Web2024.Api.Model;
using MySqlConnector;
using Dapper;

namespace MISA.Web2024.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        /// <summary>
        /// Lấy danh sách vị trí
        /// </summary>
        /// <returns>
        /// 200- Danh sách phòng ban
        /// 204- Không có dữ liệu
        /// 500 - Có exception
        /// </returns>
        /// Created by: HaiPT (18/7/2024)
        /// Modified by: HaiPT (27/7/2024)
        [HttpGet]
        public IActionResult Get()
        {
            //Khởi tạo két nối tới DB
            var connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN222_PhamTienHai ; User Id= manhnv; Password = 12345678";
            //1 Khởi tạo kết nối với MARIADb;
            var SqlConnection = new MySqlConnection(connectionString);

            //2 Lấy dữ liệu
            //2.1 Câu lệnh truy vấn giữ liệu;
            var sqlCommand = "SELECT * FROM Department";
            //2.2 Lấy giữ liệu
            var departments = SqlConnection.Query<Department>(sql: sqlCommand);

            //Trả kết quả cho client
            return Ok(departments);
        }

        /// <summary>
        /// Hàm xử lí khi trả về lỗi
        /// </summary>
        /// <param name="ex">Lỗi hệ thống</param>
        /// <returns>
        ///  Mã lỗi - Chi tiết lỗi
        /// </returns>
        /// Created by : HaiPTB20DCCN222 (27/7/2023)
        private IActionResult HandleException(Exception ex)
        {
            var error = new ErrorService();
            error.DevMsg = ex.Message;
            error.UserMsg = Resources.ResourceVN.Error_Exception;
            error.Data = ex.Data;
            return StatusCode(500, error);
        }
    }
}
