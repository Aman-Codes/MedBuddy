    function isNumberKey(evt)
    {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

    function getXMLObject() {
        var tmpXmlHttpObject;
        //depending on what the browser supports, use the right way to create the XMLHttpRequest object
        if (window.XMLHttpRequest) {
            // Mozilla, Safari would use this method ...
            tmpXmlHttpObject = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE would use this method ...
            tmpXmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return tmpXmlHttpObject;
    }

    function setAjaxHeader(xmlhttp_get, URL, tempqueryStr, Flag) {
        xmlhttp_get.open("POST", URL, Flag);
        xmlhttp_get.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xmlhttp_get.setRequestHeader("Content-length", tempqueryStr.length);
        xmlhttp_get.setRequestHeader("Connection", "close");
    }
    function setAjaxHeader2(xmlhttp_get, URL, tempqueryStr, Flag) {
        xmlhttp_get.open("POST", URL, Flag);
        xmlhttp_get.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xmlhttp_get.setRequestHeader("Content-length", tempqueryStr.length);
        xmlhttp_get.setRequestHeader("Connection", "close");
    }

    function getHospital(scode) {
        var queryStr = "";
        queryStr = "flagType=1&scode=" + scode;
        var xmlhttp_get = new getXMLObject();
        //alert(xmlhttp_get);
        setAjaxHeader2(xmlhttp_get, "/copp/slvt_followup", queryStr, true);
        xmlhttp_get.onreadystatechange = function ()
        {
            if (xmlhttp_get.readyState === 4 && xmlhttp_get.status === 200)
            {
                document.getElementById("ddlhospital").innerHTML = xmlhttp_get.responseText;
                // $(".livesearch").chosen();
                // $(".livesearch").trigger("chosen:updated");
            }
        }
        xmlhttp_get.send(queryStr);
    }



    function refresh_cap()
    {
        var queryStr = "";
        var xmlhttp_get = new getXMLObject();
        setAjaxHeader(xmlhttp_get, "/copp/Cap_Image", queryStr, false);
        xmlhttp_get.onreadystatechange = function ()
        {
            if (xmlhttp_get.readyState === 4 && xmlhttp_get.status === 200)
            {

                alert(xmlhttp_get.responseText)
                document.getElementById('cap_img').src = xmlhttp_get.responseText;
            }
        }
        xmlhttp_get.send(queryStr);
    }



    window.history.forward();
    //superfish menu
    $(function () {
        $('ul.sf-menu').superfish({
            delay: 50,
            animation: {
                opacity: 'show',
                height: 'show'
            },
            disableHI: false
        });
    });

    function validate_submit() {

        if (document.getElementById('mbl').value == '' || (document.getElementById('mbl').value).trim().length == 0)
        {
            alert("Please Enter Mobile No.");
            document.getElementById('mbl').focus();
            return  false;
        }
        if ((document.getElementById('mbl').value).trim().length !== 10)
        {
            alert("Enter Valid Mobile No.");
            document.getElementById('mbl').focus();
            return  false;
        }
        if (document.getElementById('txtkey').value == '' || (document.getElementById('txtkey').value).trim().length == 0)
        {
            alert("Please Enter Captcha.");
            document.getElementById('txtkey').focus();
            return  false;
        }
    }


    function validate() {
        var hos_id = "";
        if (document.getElementById("ddlhospital").value <= 0) {
            alert("Please Select Hospital");
            return false;
        } else {
            hos_id = document.getElementById("ddlhospital").value.split("~")[0];
        }
        var state_id = "";
        state_id = document.getElementById("state").value;
        //window.location = "http://10.183.9.15:8080/followup/?default_hosid=" + hos_id + "&default_scode=" + state_id;
        window.location.href = "https://ors.gov.in/followup/?default_hosid=" + hos_id + "&default_scode=" + state_id;
        // window.location.href = "https://ors.gov.in/followup/";
    }









    navigator.sayswho = (function () {
        var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null)
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null)
            M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();

    if (navigator.sayswho.split(' ')[0] == 'IE' && parseInt(navigator.sayswho.split(' ')[1]) < 9) {
        alert("Your browser is not compatible with ors.gov.in. Please update or change your browser.");
        window.top.location = "welcome.jsp";
    }


$('.select2').select2();