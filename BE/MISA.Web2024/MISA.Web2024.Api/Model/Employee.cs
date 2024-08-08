using System.ComponentModel.DataAnnotations;

namespace MISA.Web2024.Api.Model
{
    public class Employee
    {   
        public Guid EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? Gender { get; set; }
        public string? GenderCode
        {
            get
            {
                switch (Gender)
                {
                    case 1: return "Name";
                    case 0: return "Nữ";
                    default: return "Giới tính khác";
                }
            }
        }
        public string IdentifyNumber { get; set; }
        public DateTime? IdentifyDate { get; set; }
        public string? IdentifyPlace { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? LandlineNumber { get; set; }
        public string? BankAccount { get; set; }
        public string? BankName { get; set; }
        public string? BankBranch { get; set; }
        public string? Address { get; set; }
        public Guid PositionId { get; set; }
        public Guid DepartmentId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? Modifiedby { get; set; }

    }
}
