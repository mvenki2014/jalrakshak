"use strict";

var _this = module.exports = {
    getDate : function(dateAndTime){
        var date_ob = new Date(dateAndTime);
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // current year
        let year = date_ob.getFullYear();

        return year + "-" + month + "-" + date;
    },
    isNight12 : function(dateAndTime){
        var date_ob = new Date(dateAndTime);
        // current hours
        let hours = date_ob.getHours();

        // current minutes
        let minutes = date_ob.getMinutes();

        // current seconds
        let seconds = date_ob.getSeconds();

        return hours ==0 && minutes == 0&& seconds ==0;
    },
    getMonth : function(dateAndTime){
        var date_ob = new Date(dateAndTime);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);


        return month;
    }

}