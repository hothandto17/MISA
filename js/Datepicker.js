class Datepicker extends HTMLElement {
    constructor() {
        // Gọi constructor của super class
        super();

        // Khởi tạo shadow root
        this.attachShadow({ mode: 'open' });

        // Khởi tạo thuộc tính
        this.currentDate = new Date();
        this.currentDay = this.currentDate.getDate();
        this.currentMonth = this.currentDate.getMonth() + 1;
        this.currentYear = this.currentDate.getFullYear();

    }

    connectedCallback() {
        // Khai báo component
        const style = document.createElement('style');
        style.textContent = this.buildStyle();

        const wraper = document.createElement('div');
        wraper.classList.add('datepicker__div--container');

        const slotTrigger = document.createElement('slot');
        slotTrigger.setAttribute('name', 'datepicker-trigger');

        const slotContent = document.createElement('slot');
        slotContent.setAttribute('name', 'datepicker-content');

        wraper.appendChild(slotTrigger);
        wraper.appendChild(slotContent);

        // xây dựng phần lịch trong datepicker
        const datepickerContent = this.querySelector('.datepicker__div--tabel-container');
        datepickerContent.appendChild(this.buildDateTable(this.currentDate));

        this.shadowRoot.appendChild(style);
        this.shadowRoot.append(wraper);
    }

    // Tạo ra style
    // Author: BTDung (4/7/2024)
    buildStyle() {
        return `
        .datepicker__div--container{
            font-family: 'Roboto-regular';
            font-size: 14px;
            font-weight: 400;
            display: flex;
        }

        ::slotted([slot="datepicker-trigger"]){
            box-sizing: border-box;
            display: flex;
            align-items: center;
            min-width: 140px;
            height: 36px;
            border: 1px solid #E0E1E4;
            padding: 0 8px 0 12px;
            justify-content: space-between;
            border-radius: 4px;
        }

        ::slotted([slot="datepicker-content"]){
            width: 320px;
            height: 351px;
        }
        `;
    }

    // Tạo ra date table
    // @param {*} date: ngày hiện tại
    // Author: BTDung (4/7/2024)
    buildDateTable(date){
        const daysInWeek = ["T2","T3","T4","T5","T6","T7","CN"];
        const day = {'1':0,'2':1,'3':2,'4':3,'5':4,'6':5,'0':6};

        const dateTable = document.createElement('table');
        dateTable.classList.add('datepicker__table');
        
        // build days in week
        const daysInWeekTr = dateTable.insertRow();
        for(let i = 0;i < 7;i++)
            {
                const day = daysInWeekTr.insertCell();
                day.textContent = daysInWeek[i];
            }
        
        const lastMonthDate = new Date(date.getFullYear(),date.getMonth() - 1,1);
        const numOfDateLastMonth = this.getNumOfDate(lastMonthDate);

        const nextMonthDate = new Date(date.getFullYear(),date.getMonth() + 1,1);
        const numOfDateNextMonth = this.getNumOfDate(nextMonthDate);

        const numOfDateThisMonth = this.getNumOfDate(date);

        const dateArr = []

        for(let i = numOfDateLastMonth - 9;i <= numOfDateLastMonth;i++)dateArr.push(i);
        for(let i = 1;i <= numOfDateThisMonth;i++)dateArr.push(i);
        for(let i = 1;i <= 10;i++)dateArr.push(i);

        let index = 10 - day[`${new Date(date.getFullYear(),date.getMonth(),1).getDay()}`];
        console.log(day[`${new Date(date.getFullYear(),date.getMonth(),1).getDay()}`]);


        return dateTable;
    }
    // Trả về số ngày trong tháng
    // @params {*} date: date object khởi tạo table
    // Author: BTDung (4/7/2024)
    getNumOfDate(date) {
        let NumOfDate = 0;
        let month = date.getMonth() + 1;
        switch (month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            NumOfDate = 31;
            break;
          case 4:
          case 6:
          case 9:
          case 11:
            NumOfDate = 30;
            break;
          default:
            let year = date.getYear();
            if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) NumOfDate = 29;
            else NumOfDate = 28;
        }
        return NumOfDate;
      }
}
export default Datepicker;