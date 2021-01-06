/*
    Vanilla AutoComplete v0.1
    Copyright (c) 2019 Mauro Marssola
    GitHub: https://github.com/marssola/vanilla-calendar
    License: http://www.opensource.org/licenses/mit-license.php
*/
const VanillaCalendar = (function () {
  function VanillaCalendar(options) {
    function addEvent(el, type, handler) {
      if (!el) return;
      if (el.attachEvent) el.attachEvent(`on${type}`, handler);
      else el.addEventListener(type, handler);
    }
    function removeEvent(el, type, handler) {
      if (!el) return;
      if (el.detachEvent) el.detachEvent(`on${type}`, handler);
      else el.removeEventListener(type, handler);
    }
    const opts = {
      selector: null,
      datesFilter: false,
      pastDates: true,
      availableWeekDays: [],
      availableDates: [],
      date: new Date(),
      todaysDate: new Date(),
      button_prev: null,
      button_next: null,
      month: null,
      month_label: null,
      onSelect: (data, elem) => {},
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      shortWeekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
    for (const k in options) if (opts.hasOwnProperty(k)) opts[k] = options[k];

    const element = document.querySelector(opts.selector);
    if (!element) return;

    const getWeekDay = function (day) {
      return [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][day];
    };

    const createDay = function (date) {
      const newDayElem = document.createElement("div");
      const dateElem = document.createElement("span");
      dateElem.innerHTML = date.getDate();
      newDayElem.className = "vanilla-calendar-date";
      newDayElem.setAttribute("data-calendar-date", date);

      const available_week_day = opts.availableWeekDays.filter(
        (f) => f.day === date.getDay() || f.day === getWeekDay(date.getDay())
      );
      const available_date = opts.availableDates.filter(
        (f) =>
          f.date ===
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            "2",
            0
          )}-${String(date.getDate()).padStart("2", 0)}`
      );

      if (date.getDate() === 1) {
        newDayElem.style.marginLeft = `${date.getDay() * 14.28}%`;
      }
      if (
        opts.date.getTime() <= opts.todaysDate.getTime() - 1 &&
        !opts.pastDates
      ) {
        newDayElem.classList.add("vanilla-calendar-date--disabled");
      } else if (opts.datesFilter) {
        if (available_week_day.length) {
          newDayElem.classList.add("vanilla-calendar-date--active");
          newDayElem.setAttribute(
            "data-calendar-data",
            JSON.stringify(available_week_day[0])
          );
          newDayElem.setAttribute("data-calendar-status", "active");
        } else if (available_date.length) {
          newDayElem.classList.add("vanilla-calendar-date--active");
          newDayElem.setAttribute(
            "data-calendar-data",
            JSON.stringify(available_date[0])
          );
          newDayElem.setAttribute("data-calendar-status", "active");
        } else {
          newDayElem.classList.add("vanilla-calendar-date--disabled");
        }
      } else {
        newDayElem.classList.add("vanilla-calendar-date--active");
        newDayElem.setAttribute("data-calendar-status", "active");
      }
      if (date.toString() === opts.todaysDate.toString()) {
        newDayElem.classList.add("vanilla-calendar-date--today");
      }

      // Disabled appointment date logic

      const AllPatient = document.getElementById("DataId");
      const allpatient = AllPatient.getAttribute("data-sortedpatient");
      let listpatient;
      // listpatient = JSON.parse(allpatient);

      const BusyDays = [];
      const PatientPerDay = 24;

      for (const property in listpatient) {
        if (
          property != "Invalid Date" &&
          property != "undefined" &&
          listpatient[property] > PatientPerDay
        ) {
          BusyDays.push(property);
        }
      }

      for (let i = 0; i < BusyDays.length; ++i) {
        const CurrentDayBegin =
          opts.date.getTime() - (opts.date.getTime() % 86400000);
        const BusyDate = new Date(BusyDays[i]);
        const BusyDayBegin =
          BusyDate.getTime() - (BusyDate.getTime() % 86400000);
        if (CurrentDayBegin == BusyDayBegin) {
          newDayElem.classList.remove("vanilla-calendar-date--active");
          newDayElem.classList.add("vanilla-calendar-date--disabled");
        }
      }

      if (
        newDayElem.classList.contains("vanilla-calendar-date--disabled") &&
        newDayElem.classList.contains("vanilla-calendar-date--today")
      ) {
        newDayElem.classList.remove("vanilla-calendar-date--disabled");
        newDayElem.classList.remove("vanilla-calendar-date--today");
        newDayElem.classList.add("vanilla-calendar-date--disabled-today");
      }

      newDayElem.appendChild(dateElem);
      opts.month.appendChild(newDayElem);
    };

    const removeActiveClass = function () {
      document
        .querySelectorAll(".vanilla-calendar-date--selected")
        .forEach((s) => {
          s.classList.remove("vanilla-calendar-date--selected");
        });
    };

    const selectDate = function () {
      const activeDates = element.querySelectorAll(
        "[data-calendar-status=active]"
      );
      activeDates.forEach((date) => {
        date.addEventListener("click", function () {
          removeActiveClass();
          const datas = this.dataset;
          const data = {};
          if (datas.calendarDate) data.date = datas.calendarDate;
          if (datas.calendarData) data.data = JSON.parse(datas.calendarData);
          opts.onSelect(data, this);
          if (!this.classList.contains("vanilla-calendar-date--disabled")) {
            this.classList.add("vanilla-calendar-date--selected");
          }
        });
      });
    };

    const createMonth = function () {
      clearCalendar();
      const currentMonth = opts.date.getMonth();
      while (opts.date.getMonth() === currentMonth) {
        createDay(opts.date);
        opts.date.setDate(opts.date.getDate() + 1);
      }

      opts.date.setDate(1);
      opts.date.setMonth(opts.date.getMonth() - 1);
      opts.month_label.innerHTML = `${
        opts.months[opts.date.getMonth()]
      } ${opts.date.getFullYear()}`;
      selectDate();
    };

    const monthPrev = function () {
      opts.date.setMonth(opts.date.getMonth() - 1);
      createMonth();
    };

    const monthNext = function () {
      opts.date.setMonth(opts.date.getMonth() + 1);
      createMonth();
    };

    const clearCalendar = function () {
      opts.month.innerHTML = "";
    };

    const createCalendar = function () {
      document.querySelector(opts.selector).innerHTML = `
            <div class="vanilla-calendar-header">
                <button type="button" class="vanilla-calendar-btn" data-calendar-toggle="previous"><svg height="24" version="1.1" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path></svg></button>
                <div class="vanilla-calendar-header__label" data-calendar-label="month"></div>
                <button type="button" class="vanilla-calendar-btn" data-calendar-toggle="next"><svg height="24" version="1.1" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path></svg></button>
            </div>
            <div class="vanilla-calendar-week"></div>
            <div class="vanilla-calendar-body" data-calendar-area="month"></div>
            `;
    };
    const setWeekDayHeader = function () {
      document.querySelector(
        `${opts.selector} .vanilla-calendar-week`
      ).innerHTML = `
                <span>${opts.shortWeekday[0]}</span>
                <span>${opts.shortWeekday[1]}</span>
                <span>${opts.shortWeekday[2]}</span>
                <span>${opts.shortWeekday[3]}</span>
                <span>${opts.shortWeekday[4]}</span>
                <span>${opts.shortWeekday[5]}</span>
                <span>${opts.shortWeekday[6]}</span>
            `;
    };

    this.init = function () {
      createCalendar();
      opts.button_prev = document.querySelector(
        `${opts.selector} [data-calendar-toggle=previous]`
      );
      opts.button_next = document.querySelector(
        `${opts.selector} [data-calendar-toggle=next]`
      );
      opts.month = document.querySelector(
        `${opts.selector} [data-calendar-area=month]`
      );
      opts.month_label = document.querySelector(
        `${opts.selector} [data-calendar-label=month]`
      );

      opts.date.setDate(1);
      createMonth();
      setWeekDayHeader();
      addEvent(opts.button_prev, "click", monthPrev);
      addEvent(opts.button_next, "click", monthNext);
    };

    this.destroy = function () {
      removeEvent(opts.button_prev, "click", monthPrev);
      removeEvent(opts.button_next, "click", monthNext);
      clearCalendar();
      document.querySelector(opts.selector).innerHTML = "";
    };

    this.reset = function () {
      this.destroy();
      this.init();
    };

    this.set = function (options) {
      for (const k in options) if (opts.hasOwnProperty(k)) opts[k] = options[k];
      createMonth();
      //             this.reset()
    };

    this.init();
  }
  return VanillaCalendar;
})();

window.VanillaCalendar = VanillaCalendar;
