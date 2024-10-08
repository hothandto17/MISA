﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MISA.Web2024.Api.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class ResourceVN {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal ResourceVN() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("MISA.Web2024.Api.Resources.ResourceVN", typeof(ResourceVN).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Có lỗi xảy ra, vui lòng liên hệ haipham06012002@gmail.com để được trợ giúp.
        /// </summary>
        public static string Error_Exception {
            get {
                return ResourceManager.GetString("Error Exception", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Dữ liệu đầu vào không hợp lệ.
        /// </summary>
        public static string Error_ValidateData {
            get {
                return ResourceManager.GetString("Error_ValidateData", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Ngày sinh không được vượt quá ngày hiện tại.
        /// </summary>
        public static string ValidateError_DateOfBirth {
            get {
                return ResourceManager.GetString("ValidateError_DateOfBirth", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Email không được để trống.
        /// </summary>
        public static string ValidateError_EmailNotEmpty {
            get {
                return ResourceManager.GetString("ValidateError_EmailNotEmpty", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Email không đúng định dạng.
        /// </summary>
        public static string ValidateError_EmailNotFomat {
            get {
                return ResourceManager.GetString("ValidateError_EmailNotFomat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Mã nhân viên đã tồn tại.
        /// </summary>
        public static string ValidateError_EmployeeCodeDuplicate {
            get {
                return ResourceManager.GetString("ValidateError_EmployeeCodeDuplicate", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Mã nhân viên không được để trống.
        /// </summary>
        public static string ValidateError_EmployeeCodeNotEmpty {
            get {
                return ResourceManager.GetString("ValidateError_EmployeeCodeNotEmpty", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Họ tên không được để trống.
        /// </summary>
        public static string ValidateError_FullNameNotEmpty {
            get {
                return ResourceManager.GetString("ValidateError_FullNameNotEmpty", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số CMTND không được để trống.
        /// </summary>
        public static string ValidateError_IdentifyNumberNotEmpty {
            get {
                return ResourceManager.GetString("ValidateError_IdentifyNumberNotEmpty", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Ngày cấp không được vượt quá ngày hiện tại.
        /// </summary>
        public static string ValidateError_IdentyfiDate {
            get {
                return ResourceManager.GetString("ValidateError_IdentyfiDate", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số điện thoại không được để trống.
        /// </summary>
        public static string ValidateError_PhoneNumberNotEmpty {
            get {
                return ResourceManager.GetString("ValidateError_PhoneNumberNotEmpty", resourceCulture);
            }
        }
    }
}
