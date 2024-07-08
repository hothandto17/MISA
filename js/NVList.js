$(document).ready(()=>{
    new NVListPage();
});

class NVListPage{

    //Hàm khởi tạo
    // @param {*} không có
    // Author: BTDung (2/7/2024)
    constructor(){
        this.initData();
        this.initEvent();
    }

    //Hàm lấy dứ liệu cần thiết từ serverr
    // @param {*} không có
    // Author: BTDung (2/7/2024)
    initData(){

        // load dữ liệu cho các combobox
        let positionComboboxs = $('[Positions]');
        positionComboboxs.each((index,item) => this.intitComboboxData(item,'Positions'))

        
    }

    //Hàm khởi tạo sự kiện
    // @param {*} không có
    // Author: BTDung (2/7/2024)
    initEvent(){
        try {

            // khởi tạo sự kiện chọn combobox
            let comboBoxList = document.querySelectorAll('.container--combobox');
            comboBoxList.forEach((item,index,array)=>{
                this.initComboboxClickHandler(item);
            })

            // khởi tạo sự kiện cho button thêm mới
            
            let addNewBtn = $('#addbtn');
            let formContainer = $('.div--form-container');

            addNewBtn.on('click',()=>{
                formContainer.removeClass('div--hidden');
                formContainer.find('#employee-code').focus();
            });
            
            // khởi tạo sự kiện cho button close
            let self = this;
            let formCloseBtns = $('.btn--close')
            formCloseBtns.each(function(index,item){
                let currentBtn = $(this);
                self.initCloseBtnHandler(currentBtn,$(`.${currentBtn.data('closecomponent')}`))
            });

        } catch (error) {
            
            console.error(error);
        }
    }

    // Hàm gán sự kiện mousedown cho combobox
    // @param {*} comboBox custom comboBox để setup
    // Author: BTDung (2/7/2024)
    initComboboxClickHandler(comboBox){
        try {

            let comboBoxOptionList = comboBox.querySelectorAll(".div__span--combobox-option");
            let currentValue = comboBox.querySelector(".div__span--current-value"); 
    
            for (const option of comboBoxOptionList) {
                option.addEventListener('mousedown',function(){
                    currentValue.textContent = this.textContent; 
                });
            }
            
        } catch (error) {
            console.error(error);   
        }
    }

    // Hàm load dữ liệu cho combobx
    // @param {*} comboBox custom combobox để load dữ liệu
    // @param {*} loadData dữ liệu load
    // Author: BTDung (2/7/2024)
    
    intitComboboxData(comboBox,loadData){
        try {
            // lấy options container
            let comboBoxOptionsContainer = $(comboBox).find('.div--combobox-options');

            // lấy dữ liệu từ api
            fetch(`https://cukcuk.manhnv.net/api/v1/${loadData}`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

        } catch (error) {
            console.error(error);
        }
    }

    // Hàm khởi tạo close btn action listener
    // @param {*} closeBtn nút để khởi tạo sự kiện
    // @param {*} closeComponent đối tượng bị ẩn đi
    // Author: BTDung (2/7/2024)

    initCloseBtnHandler(closeBtn,closeComponent){
        closeBtn.on('click',()=>{
            closeComponent.addClass('div--hidden');
        })
    }
}