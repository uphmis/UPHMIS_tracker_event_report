/**
 * Created by sudiksha on 14/6/18.
 */


msfReportsApp.directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});

msfReportsApp
    .controller('performanceReportController', function ($rootScope,
        $scope,
        $timeout,
        MetadataService,
        sqlviewservice) {



        //Production IDS
        const SQLVIEW_TEI_PS = "FcXYoEGIQIR";
        const SQLVIEW_TEI_ATTR = "WMIMrJEYUxl";
        const SQLVIEW_EVENT = "IQ78273FQtF";

        // local
        // const SQLVIEW_TEI_PS =  "gCxkn0ha6lY";
        // const SQLVIEW_TEI_ATTR = "HKe1QCVogz9";
        // const SQLVIEW_EVENT = "bTNJn5CbnOY";
        $scope.orgunitheirarchy = [];
        jQuery(document).ready(function () {
            hideLoad();


        });
        $timeout(function () {
            $scope.date = {};
            $scope.date.startDate = new Date();
            $scope.date.endDate = new Date();
        }, 0);

        //initially load tree
        selection.load();

        // Listen for OU changes
        selection.setListenerFunction(function () {
            getAllPrograms();
            $scope.selectedOrgUnitUid = selection.getSelected();
            loadPrograms();
        }, false);

        loadPrograms = function () {
            $scope.selectedOrgUnitlevel = "";
            MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function (orgUnit) {
                $timeout(function () {
                    $scope.selectedOrgUnit = orgUnit;
                    $scope.selectedOrgUnitlevel = orgUnit.level;
                });
            });
            $scope.basicUrl = "../api/sqlViews/";
            setTimeout(function () {
                $scope.orgunit_CMO = [], $scope.orgunit_CMS = [];

                MetadataService.filterCMO_CMS(CMS_uid).then(function (org) {
                    for (var i = 0; i < org.organisationUnits.length; i++) {
                        $scope.orgunit_CMS[org.organisationUnits[i].id] = "true";
                    }
                });
                MetadataService.filterCMO_CMS(CMO_uid).then(function (org) {
                    for (var i = 0; i < org.organisationUnits.length; i++) {
                        $scope.orgunit_CMO[org.organisationUnits[i].id] = "true";
                    }
                })



            }, 2000);
            MetadataService.getSQLViewData(SQLViewsName2IdMap["UPHMIS_Heirarchy"]).then(function (orguinit) {

                for (var i = 0; i < orguinit.listGrid.rows.length; i++) {
                    $scope.orgunitheirarchy[orguinit.listGrid.rows[i][0]] = orguinit.listGrid.rows[i][1]
                }
            });
            $scope.allContactNo = [];
            MetadataService.getSQLViewData(SQLViewsName2IdMap["Get_contactno"]).then(function (contact) {

                for (var i = 0; i < contact.listGrid.rows.length; i++) {
                    $scope.allContactNo[contact.listGrid.rows[i][0]] = contact.listGrid.rows[i][1]
                }
            });

            $scope.selorgunitid = [];
            var param = "var=orgUnitId:" + $scope.selectedOrgUnitUid[0];
            MetadataService.getSQLView(SQLViewsName2IdMap["GetOrgUnitId"], param).then(function (org) {

                $scope.selorgunitid.push(org.listGrid.rows[0][0])

            })


        };

        getAllPrograms = function () {



            var program = ['HTCqTWEF1XS', 'K3XysZ53B4r', 'CsEmq8UNA6z'];
            var postfix = ["- PBR monitoring(Aggregated)", "Remarks Report", "- PBR monitoring(under CMO)", "- PBR monitoring(under CMS)", "- PBR monitoring(under CMO(Aggregated))", "- PBR monitoring(under CMS(Aggregated))"]
            var postfix2 = ["Remarks Report", "- PBR monitoring(under CMO)", "- PBR monitoring(under CMS)", "- PBR monitoring(under CMO(Aggregated))", "- PBR monitoring(under CMS(Aggregated))"]
            var postfix1 = ["- PBR monitoring(Aggregated)", "Remarks Report"]

            $scope.Allprograms = [];
            $scope.selectedprograms = [];
            MetadataService.getAllPrograms().then(function (prog) {

                for (var i = 0; i < prog.programs.length; i++) {
                    for (var j = 0; j < program.length; j++) {
                        if (prog.programs[i].withoutRegistration == false) {
                            if (program[j] == prog.programs[i].id)
                                $scope.Allprograms.push(prog.programs[i])
                        }
                    }

                }
                // $scope.Allprograms.push($scope.selectedprograms[2]);
            });

			$scope.progvalarray=[...$scope.Allprograms];
            for (var y = 0; y < $scope.progvalarray.length; y++) {
                if (( $scope.progvalarray[y].id == "HTCqTWEF1XS" ) || ($scope.progvalarray[y].id == "K3XysZ53B4r")) {
                    for (var x = 0; x < postfix2.length; x++) {
                        var newObject = jQuery.extend(true, {}, $scope.progvalarray[y]);
                        var str = newObject.name.split("-");
                        newObject.name = str[0] + postfix2[x];
                        $scope.Allprograms[$scope.Allprograms.length] = newObject
                        $scope.newObject = [];
                    }
                }
                if ($scope.progvalarray[y].id == "CsEmq8UNA6z") {
                    for (var x = 0; x < postfix1.length; x++) {
                        var newObject = jQuery.extend(true, {}, $scope.progvalarray[y]);
                        var str = newObject.name.split("-");
                        newObject.name = str[0] + postfix1[x];
                        $scope.Allprograms[$scope.Allprograms.length] = newObject
                        $scope.newObject = []
                    }

                }

            }



            getAllProg($scope.Allprograms)
        }

        getAllProg = function (Allprograms) {
            $scope.programs = [];

            for (var i = 0; i < Allprograms.length; i++) {
                $scope.programs.push(Allprograms[i]);
            }
        }
        $scope.updateStartDate = function (startdate) {
            $scope.startdateSelected = startdate;
            //  alert("$scope.startdateSelected---"+$scope.startdateSelected);
        };

        $scope.updateEndDate = function (enddate) {
            $scope.enddateSelected = enddate;
            //  alert("$scope.enddateSelected---"+ $scope.enddateSelected);
        };

        $scope.fnExcelReport = function () {

            var blob = new Blob([document.getElementById('divId').innerHTML], {
                type: 'text/plain;charset=utf-8'
            });
            saveAs(blob, "Report.xls");

        };


        // setTimeout(function(){

        //  })
        $scope.showloader = function () {

        }
        $scope.generateReport = function (prog) {
            $('#loader').attr('style', 'display:block !important');
            //document.getElementById("loader").style.display="block";
            // document.getElementById("loader-wrapper").style.display="block";
            $timeout(function () { $scope.createReport(prog) }, 2000);
        }
        $scope.inactivedata = []
        // $scope.progval=[]
        $scope.createReport = function (prog) {
            // $scope.progval.push(prog)


            $scope.selectedOrgUnitName = $scope.selectedOrgUnit.name;
            $scope.selectedStartDate = $scope.startdateSelected;
            $scope.selectedEndDate = $scope.enddateSelected;
            $scope.program = prog

            for (var i = 0; i < $scope.program.programTrackedEntityAttributes.length; i++) {
                var str = $scope.program.programTrackedEntityAttributes[i].displayName;
                var n = str.lastIndexOf('-');
                $scope.program.programTrackedEntityAttributes[i].displayName = str.substring(n + 1);

            }
            $scope.psDEs = [], $scope.psDEs1 = [];
            $scope.Options = [];
            $scope.attribute = "Attributes";
            $scope.org = "Organisation Unit : ";
            $scope.start = "Start Date : ";
            $scope.end = "End Date : ";
            $scope.enrollment = ["Enrollment date", "Enrolling orgUnit"];
            var options = [];

            de_array = ['vhG2gN7KaEK', 'qbgFsR4VWxU', 'zfMOVN2lc1S', 'kChiZJPd5je', 'wTdcUXWeqhN', 'eryy31EUorR', 'cqw0HGZQzhD'];
            $scope.newde_array = ['PTDWef0EKBH', 'C1Hr5tSOFhO', 'JpKS1QTfeIs', 'Wc8omZwzJeP', 'U1PC32JYO7q', 'WQv29jW1hxt'];

            var index = 0;
            for (var i = 0; i < $scope.program.programStages.length; i++) {

                var psuid = $scope.program.programStages[i].id;
                $scope.programid = $scope.program.id;
                $scope.programname = $scope.program.name;


                if ($scope.programname == 'Anaesthetist - PBR monitoring(Aggregated)' || $scope.programname == 'Gynaecologist - PBR monitoring(Aggregated)') {
                    $("#showdata").empty();
                    var div = document.getElementById("Scoringtable")
                    div.style.display = "none";

                    $scope.new_psuid = $scope.program.programStages[i].id;
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "Specialist-Name", name: "Specialist Name", ps: psuid } });

                    $scope.header = ['', ''];

                    for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                        $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                        var de = $scope.program.programStages[i].programStageDataElements[j];


                        for (var xx = 0; xx < de_array.length; xx++) {
                            if (de.dataElement.id == de_array[xx])
                                $scope.psDEs.push(de);
                        }
                        $scope.program["newlength"] = $scope.psDEs1.length;

                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                            if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                                for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                    index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                    var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                    var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                    options.push({ code: code, name: name });
                                    $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                                }
                            }
                        }
                    }
                    for (var pe = 0; pe < $scope.psDEs.length; pe++) {
                        $scope.header.push('Value');
                    }
                    $scope.colspanval = 0;
                }
                if ($scope.programname == 'Anaesthetist - PBR monitoring(under CMO(Aggregated))' || $scope.programname == 'Anaesthetist - PBR monitoring(under CMS(Aggregated))' || $scope.programname == 'Gynaecologist - PBR monitoring(under CMO(Aggregated))' || $scope.programname == 'Gynaecologist - PBR monitoring(under CMS(Aggregated))') {
                    $("#showdata").empty();
                    var div = document.getElementById("Scoringtable")
                    div.style.display = "block";
                    
                    $scope.psDEs1.push({dataElement: {id:"Total-No-Of-Working Days", name:"Total-No-Of-Working Days", ps: psuid}});
                    $scope.psDEs1.push({ dataElement: { id: "last-update", name: "Last Updated Date", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "Specialist-Name", name: "Specialist Name", ps: psuid } });

                    $scope.header = ['', '', '', ''];

                    for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                        $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                        var de = $scope.program.programStages[i].programStageDataElements[j];


                        for (var xx = 0; xx < de_array.length; xx++) {
                            if (de.dataElement.id == de_array[xx])
                                $scope.psDEs.push(de);
                        }
                        $scope.program["newlength"] = $scope.psDEs1.length;

                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                            if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                                for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                    index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                    var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                    var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                    options.push({ code: code, name: name });
                                    $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                                }
                            }
                        }
                    }
                    for (var pe = 0; pe < $scope.psDEs.length; pe++) {
                        $scope.header.push('Case Load', 'Value', 'Points');
                    }
                    $scope.header.push("Total Points", "PBF % Received");

                    $scope.colspanval = 3;
                }



                if ($scope.programname == "Paediatric - PBR monitoring(Aggregated)" && psuid == "PfRIIrvnjcU") {
                    $("#showdata").empty();
                    var div = document.getElementById("Scoringtable")
                    div.style.display = "block";

                    $scope.psDEs1.push({dataElement: {id:"Total-No-Of-Working Days", name:"Total-No-Of-Working Days", ps: psuid}});
                    $scope.psDEs1.push({ dataElement: { id: "last-update", name: "Last Updated Date", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "Specialist-Name", name: "Specialist Name", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE1", name: "Attend pediatric OPD/ newborn babies  of the hospital (follow-up OPD post discharge from SNCU.) as per schedule.", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE2", name: "Attend complicated deliveries/caesarean sections/if required. (No of Pediatric Emergency Cases attended in day time)", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE3", name: "Examine all babies in the PNC ward during duty hours, and enter progress of new born in case sheet about the condition of baby   and screen for any congenital anomalies (if present- must be reported in case sheet) as well.By Self (Doctors/Specialist)                ", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE4", name: "No of Paediatric cases treated as inpatient a. Out-Born admissions (During the Shift) b. Out-Born admissions (During the Shift) c. Pre-term/ Low-Birth weight admissions (During the Shift) (Reported from Emergency in duty hours) By Self (Doctors/Specialist)", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE5", name: "Monthly Reporting a. Submission of Complete monthly SNCU report by 5th of next month b. Bed occupancy rate (BOR)", ps: psuid } });

                    $scope.header = ['', '', '', ''];

                    for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {
                        $scope.new_psuid = $scope.program.programStages[i].id;

                        $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                        var de = $scope.program.programStages[i].programStageDataElements[j];


                        $scope.program["newlength"] = $scope.psDEs.length;



                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                            if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                                for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                    index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                    var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                    var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                    options.push({ code: code, name: name });
                                    $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                                }
                            }
                        }
                    }


                    for (var pe = 0; pe < $scope.psDEs.length - 1; pe++) {
                        $scope.header.push('Case Load', 'Value', 'Points');
                    }
                    $scope.header.push('Status', 'Value', 'Points', "Total Points", "PBF % Received");
                    $scope.colspanval = 3;

                }
                if (($scope.programname == "Paediatric Remarks Report" && psuid == "PfRIIrvnjcU") || $scope.programname == "Anaesthetist Remarks Report" || $scope.programname == "Gynaecologist Remarks Report") {
                    $("#showdata").empty();
                    var div = document.getElementById("Scoringtable")
                    div.style.display = "none";

                    $scope.new_psuid = $scope.program.programStages[i].id;
                    $scope.psDEs1.push({ dataElement: { id: "eventDate", name: "eventDate", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "Specialist-Name", name: "Specialist Name", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "contact-number", name: "Contact Number", ps: psuid } });

                    $scope.header = ['', '', ''];

                    for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                        $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                        var de = $scope.program.programStages[i].programStageDataElements[j];


                        for (var xx = 0; xx < $scope.newde_array.length; xx++) {
                            if (de.dataElement.id == $scope.newde_array[xx])
                                $scope.psDEs1.push(de);
                        }
                        $scope.program["newlength"] = $scope.psDEs1.length;

                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                            if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                                for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                    index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                    var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                    var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                    options.push({ code: code, name: name });
                                    $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                                }
                            }
                        }
                    }




                }
                if ($scope.programname == "Paediatric - PBR monitoring" && psuid == "PfRIIrvnjcU") {
                    $("#showdata").empty();
                    var div = document.getElementById("Scoringtable")
                    div.style.display = "none";

                    $scope.psDEs1.push({ dataElement: { id: "eventDate", name: "eventDate", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "Specialist-Name", name: "Specialist Name", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE1", name: "Attend pediatric OPD/ newborn babies  of the hospital (follow-up OPD post discharge from SNCU.) as per schedule.", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE2", name: "Attend complicated deliveries/caesarean sections/if required. (No of Pediatric Emergency Cases attended in day time)", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE3", name: "Examine all babies in the PNC ward during duty hours, and enter progress of new born in case sheet about the condition of baby   and screen for any congenital anomalies (if present- must be reported in case sheet) as well.By Self (Doctors/Specialist)                ", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE4", name: " No of Paediatric cases treated as inpatient a. Out-born admissions (During the Shift)b. Pre-term admissions (During the Shift) c. Low-Birth weight admissions (During the Shift) (Reported from Emergency in duty hours) By Self (Doctors/Specialist)", ps: psuid } });
                    $scope.psDEs.push({ dataElement: { id: "DE5", name: "Monthly Reporting a. Submission of Complete monthly SNCU report by 5th of next month b. Bed occupancy rate (BOR)", ps: psuid } });

                    $scope.header = ['', '', ''];

                    for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {
                        $scope.new_psuid = $scope.program.programStages[i].id;

                        $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                        var de = $scope.program.programStages[i].programStageDataElements[j];


                        $scope.program["newlength"] = $scope.psDEs.length;



                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                            if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                                for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                    index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                    var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                    var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                    options.push({ code: code, name: name });
                                    $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                                }
                            }
                        }
                    }


                    for (var pe = 0; pe < $scope.psDEs.length; pe++) {
                        $scope.header.push('Value');
                    }
                    $scope.colspanval = 0;

                }
                if (($scope.programname == 'Anaesthetist - PBR monitoring' && $scope.programid == "HTCqTWEF1XS") || ($scope.programname == 'Anaesthetist - PBR monitoring(under CMO)' && $scope.programid == "HTCqTWEF1XS") || ($scope.programname == 'Anaesthetist - PBR monitoring(under CMS)' && $scope.programid == "HTCqTWEF1XS") || ($scope.programname == 'Gynaecologist - PBR monitoring' && $scope.programid == "K3XysZ53B4r") || ($scope.programname == 'Gynaecologist - PBR monitoring(under CMS)' && $scope.programid == "K3XysZ53B4r") || ($scope.programname == 'Gynaecologist - PBR monitoring(under CMO)' && $scope.programid == "K3XysZ53B4r")) {
                    $("#showdata").empty();
                    var div = document.getElementById("Scoringtable")
                    div.style.display = "none";

                    $scope.psDEs1.push({ dataElement: { id: "eventDate", name: "eventDate", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "orgUnit", ps: psuid } });
                    $scope.psDEs1.push({ dataElement: { id: "orgUnit", name: "Specialist Name", ps: psuid } });

                    $scope.header = ['', '', ''];

                    for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                        $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                        var de = $scope.program.programStages[i].programStageDataElements[j];

                        for (var xx = 0; xx < de_array.length; xx++) {
                            if (de.dataElement.id == de_array[xx])
                                $scope.psDEs.push(de);
                        }


                        $scope.program["newlength"] = $scope.psDEs.length;


                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                            if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                                for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                    index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                    var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                    var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                    options.push({ code: code, name: name });
                                    $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                                }
                            }
                        }
                    }


                    for (var pe = 0; pe < $scope.psDEs.length; pe++) {
                        $scope.header.push('Value');
                    }
                    $scope.colspanval = 0;
                }
            }

            //  var param = "var=program:"+program.id + "&var=orgunit:"+$scope.selectedOrgUnit.id+"&var=startdate:"+moment($scope.date.startDate).format("YYYY-MM-DD")+"&var=enddate:"+moment($scope.date.endDate).format("YYYY-MM-DD");
            var param = "var=program:" + $scope.program.id + "&var=orgunit:" + $scope.selectedOrgUnit.id + "&var=startdate:" + $scope.startdateSelected + "&var=enddate:" + $scope.enddateSelected;

            MetadataService.getSQLView(SQLViewsName2IdMap[SQLQUERY_EVENT_NAME], param).then(function (stageData) {
                $scope.stageData = stageData.listGrid;
                arrangeDataX($scope.stageData, $scope.programid, psuid, $scope.programname, $scope.new_psuid);
            })

            // })
        };


        function showLoad() {
            // alert( "inside showload method 1" );
            setTimeout(function () {
                //  document.getElementById('load').style.visibility="visible";
                //   document.getElementById('tableid').style.visibility="hidden";

            }, 1000);

            //     alert( "inside showload method 2" );
        }

        function hideLoad() {
            //  document.getElementById('load').style.visibility="hidden";
            //  document.getElementById('tableid').style.visibility="visible";
        }

        function arrangeDataX(stageData, program, psuid, programname, new_psuid) {
            $scope.progval = []
            // For Data values
            const index_deuid = 4;
            const index_devalue = 6;
            const index_ps = 0;
            const index_ev = 2;
            const index_evDate = 3;
            const index_ou = 7;
            const index_ouid = 9;
            const index_sname = 12;
            const index_tei = 13;
            const index_act = 14;
            const index_lastupdate = 15;

            $scope.eventList = [];
            $scope.eventMap = [];
            $scope.eventDeWiseValueMap = [];




            var org_h = [];

            for (var x = 0; x < stageData.height; x++) {

                var sel_org_uid = stageData.rows[x][9];
                org_h.push(sel_org_uid);



            }
            org_h = org_h.filter(function (item, index, inputArray) {
                return inputArray.indexOf(item) == index;
            });
            var org_path = [];
            for (var y = 0; y < org_h.length; y++) {
                org_uid = org_h[y];

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    async: false,
                    url: "../../organisationUnits/" + org_uid + ".json?fields=id,path&paging=false",
                    success: function (data) {
                        org_path[org_uid] = data.path;
                    }
                });

            }
            // var org_val = getorghirarcy(org_path);


            for (var i = 0; i < stageData.height; i++) {


                var psuid = stageData.rows[i][index_ps];
                var evuid = stageData.rows[i][index_ev];
                var evDate = stageData.rows[i][index_evDate];
                evDate = evDate.substring(0, 10);
                var deuid = stageData.rows[i][index_deuid];
                var devalue = stageData.rows[i][index_devalue];
                var ou = stageData.rows[i][index_ou];
                var ou_id = stageData.rows[i][index_ouid];
                var tei_id = stageData.rows[i][index_tei];
                var activeval = stageData.rows[i][index_act];
                var lastupdate = stageData.rows[i][index_lastupdate];

                if (activeval == 'true')
                    $scope.inactivedata[evuid] = true

                var num_doc = (stageData.rows[i][index_sname]).split(',');
                if (num_doc.length == 1) {
                    var doc_name = num_doc[0];
                    var contact_no = ""
                }
                else {
                    var doc_name = num_doc[1];
                    var contact_no = num_doc[0];
                }


                /*var newkey=stageData.rows[i][9];
                for(var key in org_val)
                {
                    if(key==newkey)
                    {
                        var ou =org_val[key];
                    }


                }*/

                if (!$scope.eventMap[evuid]) {
                    $scope.eventMap[evuid] = {
                        event: evuid,
                        data: []
                    };

                    $scope.eventDeWiseValueMap[evuid + "-orgUnit"] = ou;
                    $scope.eventDeWiseValueMap[evuid + "-eventDate"] = evDate;
                    $scope.eventDeWiseValueMap[evuid + "-orgunitid"] = ou_id;
                    $scope.eventDeWiseValueMap[evuid + "-docname"] = doc_name;
                    $scope.eventDeWiseValueMap[evuid + "-contactno"] = contact_no;
                    $scope.eventDeWiseValueMap[evuid + "-teiid"] = tei_id;
                    $scope.eventDeWiseValueMap[evuid + "-lastUpdate"] = lastupdate;

                    $scope.eventDeWiseValueMap[evuid + "-activity"] = "";




                }

                $scope.eventMap[evuid].data.push({
                    de: deuid,
                    value: devalue
                });
                $scope.eventDeWiseValueMap[evuid + "-" + deuid] = devalue;


                for (m in $scope.Options) {

                    if (devalue + '_index' == m) {

                        $scope.eventDeWiseValueMap[evuid + "-" + deuid] = $scope.Options[m];

                    }

                }
            }





            for (var m in $scope.eventMap) {
                $scope.eventList.push(m);
            }



            /** $timeout(function () {
                 $scope.eventList = prepareListFromMap($scope.eventMap);
 
             })**/

            ////Anaesthetist- PBR monitoring(Aggregated)
            if (program == "HTCqTWEF1XS" && programname == 'Anaesthetist - PBR monitoring(Aggregated)') {
                var count = 0; $scope.dataimport = $();
                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;


                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) {
                    return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);
                });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                            //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });

                    if ($scope.neweventval.length != 0) {

                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);

                        count++
                        var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);
                        var specialist_name = $scope.FinalEnteredVal["docname"];
                        var case1 = $scope.FinalEnteredVal["vhG2gN7KaEK"];
                        var case2 = $scope.FinalEnteredVal["qbgFsR4VWxU"];
                        var case3 = $scope.FinalEnteredVal["zfMOVN2lc1S"];

                        var case1_val, case2_val, case3_val;
                        ///case 1
                        if (case1 == undefined) {
                            case1_val = 0;

                        }
                        else {
                            case1_val = case1;

                        }


                        ///////////case 2
                        if (case2 == undefined) {
                            case2_val = 0;
                        }
                        else {
                            case2_val = case2;
                        }
                        /////case 3

                        if (case3 == undefined) {
                            case3_val = 0;
                        }
                        else {
                            case3_val = case3;
                        }
                        var tt = Number(case2_point), ttt = Number(case2_point), ttttt = tt + ttt;

                        $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                        if ($scope.total == "NaN")
                            $scope.total = 0;

                        $scope.dataimport = $(
                            "<tr>" +
                            "<th>" + org + "</th>" +
                            "<th>" + specialist_name + "</th>" +

                            "<th>" + case1_val + "</th>" +

                            "<th>" + case2_val + "</th>" +
                            "<th>" + case3_val + "</th>" +


                            "</tr>"

                        )


                        $("#showdata").append($scope.dataimport);
                        if (checkeddata == true) {
                            var tdd = $scope.dataimport[0].cells
                            for (i = 0; i < tdd.length; i++)
                                tdd[i].id = 'table-row'
                        }
                    }

                    $scope.neweventval = [];
                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();

                var hhhh = [];

                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }


                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            count++
                            var org = getheirarchy($scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']);
                            //var org=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'orgUnit'];
                            var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];

                            var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'vhG2gN7KaEK'];
                            var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'qbgFsR4VWxU'];
                            var case3 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'zfMOVN2lc1S'];

                            var case1_val, case2_val, case3_val;
                            ///case 1
                            if (case1 == undefined) {
                                case1_val = 0;
                            }
                            else {
                                case1_val = case1;
                            }


                            ///////////case 2
                            if (case2 == undefined) {
                                case2_val = 0;
                            }
                            else {
                                case2_val = case2;
                            }
                            /////case 3

                            if (case3 == undefined) {
                                case3_val = 0;
                            }
                            else {
                                case3_val = case3;
                            }

                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                            if ($scope.total == "NaN")
                                $scope.total = 0;

                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_val + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case3_val + "</th>" +

                                "</tr>"

                            )
                        }


                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }


                document.getElementById("loader").style.display = "none";

                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }
            ////Anaesthetist- PBR monitoring(under CMO(Aggregated))
            if (program == "HTCqTWEF1XS" && programname == 'Anaesthetist - PBR monitoring(under CMO(Aggregated))') {


                $scope.ALLregisteredDoc_name_CMO = []
                var param1 = "var=programuid:" + program + "&var=orgunitid:" + $scope.selorgunitid[0]
                MetadataService.getSQLView(SQLViewsName2IdMap["TRACKER_ALLDOC_CMO"], param1).then(function (doc) {

                    for (var i = 0; i < doc.listGrid.rows.length; i++) {
                        $scope.ALLregisteredDoc_name_CMO[doc.listGrid.rows[i][0]] = { name: doc.listGrid.rows[i][1], ouid: doc.listGrid.rows[i][2] ,lastupdate: doc.listGrid.rows[i][4]}
                        if (doc.listGrid.rows[i][3] == true)
                            $scope.inactivedata[doc.listGrid.rows[i][0]] = 'true'
                    }

                })
                var count = 0; $scope.dataimport = $();
                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;
                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {

                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) {
                    return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);
                });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                            //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });

                    if ($scope.neweventval.length != 0) {
                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);
                        var checkeddata = checkInactiveData($scope.FinalEnteredVal['eventuid'])
                        var orgUnitid = $scope.FinalEnteredVal['orgunitid']

                        var returnvalue = checkorgunit(orgUnitid, programname);
                        if (returnvalue == "true") {
                            count++;

                            var datacount = $scope.FinalEnteredVal['count']
                            var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);
                            var case1 = ($scope.FinalEnteredVal["vhG2gN7KaEK"]).toString();
                            var case2 = ($scope.FinalEnteredVal["qbgFsR4VWxU"]).toString();
                            var case3 = ($scope.FinalEnteredVal["zfMOVN2lc1S"]).toString();


                            //var org=$scope.FinalEnteredVal["orgunit"];
                            var specialist_name = $scope.FinalEnteredVal["docname"];

                            if (datacount >= 0 && case1 == 0 && case2 == 0 && case3 == 0) {
                                var case1_load = "", case1_val = "", case1_point = "",
                                    case2_load = "", case2_val = "", case2_point = "",
                                    case3_Load = "", case3_val = "", case3_point = "";
                                $scope.total = "";
                            }
                            else {



                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point;
                                ///case 1
                                if (case1 == NaN) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {
                                    if (case1 >= 6 && case1 <= 8) {
                                        case1_load = "6 to 8";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 9 && case1 <= 11) {
                                        case1_load = "9 to 11";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 12 && case1 <= 15) {
                                        case1_load = "12 to 15";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else if (case1 >= 15) {
                                        case1_load = ">15";
                                        case1_val = case1;
                                        case1_point = "15";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == NaN) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != NaN) {
                                        if (case2 > 0 && case2 <= 2) {
                                            case2_load = "Up to 2";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 3 && case2 <= 5) {
                                            case2_load = "3 to 5";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 6 && case2 <= 8) {
                                            case2_load = "6 to 8";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else if (case2 >= 8) {
                                            case2_load = ">8";
                                            case2_val = case2;
                                            case2_point = "15";
                                        }
                                        else {
                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";
                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == NaN) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != NaN) {
                                        if (case3 > 0 && case3 <= 6) {
                                            case3_Load = "Upto 5";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 6 && case3 <= 10) {
                                            case3_Load = "6 to 10";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 11 && case3 <= 15) {
                                            case3_Load = "11 to 15";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 15) {
                                            case3_Load = ">15";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }
                                    }
                                }
                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                                var percen = 0;
                                if ($scope.total > 0 && $scope.total <= 10)
                                    percen = "-20%"
                                if ($scope.total >= 11 && $scope.total <= 20)
                                    percen = "50%"
                                if ($scope.total >= 21 && $scope.total <= 30)
                                    percen = "75%"
                                if ($scope.total >= 31 && $scope.total <= 40)
                                    percen = "100%"
                                if ($scope.total == "")
                                    percen = ""



                            }
                            if ($scope.total == "NaN" || $scope.total == "")
                                percen = "";

                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>" + $scope.neweventval.length + "</th>"+
                                "<th></th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_load + "</th>" +
                                "<th>" + case1_val + "</th>" +
                                "<th>" + case1_point + "</th>" +

                                "<th>" + case2_load + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case2_point + "</th>" +

                                "<th>" + case3_Load + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case3_point + "</th>" +

                                "<th>" + $scope.total + "</th>" +
                                "<th>" + percen + "</th>" +

                                "</tr>"

                            )


                        }
                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                    $scope.neweventval = [];
                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();

                var hhhh = [];

                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }


                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.final_singleval[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++
                                var org = getheirarchy($scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']);
                                //var org=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'orgUnit'];
                                var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];

                                var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'vhG2gN7KaEK'];
                                var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'qbgFsR4VWxU'];
                                var case3 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'zfMOVN2lc1S'];

                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {
                                    if (case1 >= 6 && case1 <= 8) {
                                        case1_load = "6 to 8";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 9 && case1 <= 11) {
                                        case1_load = "9 to 11";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 12 && case1 <= 15) {
                                        case1_load = "12 to 15";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else if (case1 >= 15) {
                                        case1_load = ">15";
                                        case1_val = case1;
                                        case1_point = "15";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {
                                        if (case2 > 0 && case2 <= 2) {
                                            case2_load = "Up to 2";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 3 && case2 <= 5) {
                                            case2_load = "3 to 5";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 6 && case2 <= 8) {
                                            case2_load = "6 to 8";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else if (case2 >= 8) {
                                            case2_load = ">8";
                                            case2_val = case2;
                                            case2_point = "15";
                                        }
                                        else {
                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";
                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 > 0 && case3 <= 6) {
                                            case3_Load = "Upto 5";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 6 && case3 <= 10) {
                                            case3_Load = "6 to 10";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 11 && case3 <= 15) {
                                            case3_Load = "11 to 15";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 15) {
                                            case3_Load = ">15";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }
                                    }
                                }

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                                var percen = 0;
                                if ($scope.total > 0 && $scope.total <= 10)
                                    percen = "-20%"
                                if ($scope.total >= 11 && $scope.total <= 20)
                                    percen = "50%"
                                if ($scope.total >= 21 && $scope.total <= 30)
                                    percen = "75%"
                                if ($scope.total >= 31 && $scope.total <= 40)
                                    percen = "100%"
                                if ($scope.total == "")
                                    percen = ""



                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th></th>" +
                                    "<th></th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + specialist_name + "</th>" +

                                    "<th>" + case1_load + "</th>" +
                                    "<th>" + case1_val + "</th>" +
                                    "<th>" + case1_point + "</th>" +

                                    "<th>" + case2_load + "</th>" +
                                    "<th>" + case2_val + "</th>" +
                                    "<th>" + case2_point + "</th>" +

                                    "<th>" + case3_Load + "</th>" +
                                    "<th>" + case3_val + "</th>" +
                                    "<th>" + case3_point + "</th>" +

                                    "<th>" + $scope.total + "</th>" +
                                    "<th>" + percen + "</th>" +

                                    "</tr>"

                                )


                            }

                        }
                    }
                } $("#showdata").append($scope.dataimport);
                if (checkeddata == true) {
                    var tdd = $scope.dataimport[0].cells
                    for (i = 0; i < tdd.length; i++)
                        tdd[i].id = 'table-row'
                }



                var returnteiuid = checkteiuid($scope.eventDeWiseValueMap, programname, $scope.ALLregisteredDoc_name_CMO)

                if (returnteiuid[0].length != 0) {
                    for (var x = 0; x < returnteiuid[0].length; x++) {


                        var returnorgunitid = checkorgunit($scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].ouid, programname)
                        if (returnorgunitid == "true") {
                            var lastupdate_date = '';
                            var checkeddata = checkInactiveData(returnteiuid[0][x]);
                            if (checkeddata == 'true') {
                                lastupdate_date = $scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].lastupdate;
                            }
                            //var lastupdate_date = $scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].lastupdate;
                            var org = getheirarchy($scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].ouid);
                            var specialist_name = $scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].name;
                            var empty = "";
                            $scope.dataimport = $(
                                "<tr>" +
                                "<th></th>"+
                                "<th>" + lastupdate_date + "</th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +


                                "</tr>"

                            )
                            $("#showdata").append($scope.dataimport);
                            if (checkeddata == 'true') {
                                var tdd = $scope.dataimport[0].cells;
                                for (i = 0; i < tdd.length; i++)
                                    tdd[i].id = 'table-row'
                            }
                        }

                    }
                }





                document.getElementById("loader").style.display = "none";

                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("Scoringtable").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("Scoringtable").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }
            ////Anaesthetist- PBR monitoring(under CMS(Aggregated))
            if (program == "HTCqTWEF1XS" && programname == 'Anaesthetist - PBR monitoring(under CMS(Aggregated))') {

                $scope.ALLregisteredDoc_name_CMS = []
                var param1 = "var=programuid:" + program + "&var=orgunitid:" + $scope.selorgunitid[0]
                MetadataService.getSQLView(SQLViewsName2IdMap["TRACKER_ALLDOC_CMS"], param1).then(function (doc) {

                    for (var i = 0; i < doc.listGrid.rows.length; i++) {
                        $scope.ALLregisteredDoc_name_CMS[doc.listGrid.rows[i][0]] = { name: doc.listGrid.rows[i][1], ouid: doc.listGrid.rows[i][2], lastupdate: doc.listGrid.rows[i][4] }
                        if (doc.listGrid.rows[i][3] == true)
                            $scope.inactivedata[doc.listGrid.rows[i][0]] = 'true'
                    }


                })
                var count = 0; $scope.dataimport = $();
                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;
                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {

                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) {
                    return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);
                });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                         }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });

                    if ($scope.neweventval.length != 0) {
                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);

                        var checkeddata = checkInactiveData($scope.FinalEnteredVal['eventuid'])
                        var orgUnitid = $scope.FinalEnteredVal['orgunitid']
                        var returnvalue = checkorgunit(orgUnitid, programname);
                        if (returnvalue == "true") {
                            count++;


                            var datacount = $scope.FinalEnteredVal['count']
                            var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);
                            var case1 = ($scope.FinalEnteredVal["vhG2gN7KaEK"]).toString();
                            var case2 = ($scope.FinalEnteredVal["qbgFsR4VWxU"]).toString();
                            var case3 = ($scope.FinalEnteredVal["zfMOVN2lc1S"]).toString();


                            //var org=$scope.FinalEnteredVal["orgunit"];
                            var specialist_name = $scope.FinalEnteredVal["docname"];

                            if (datacount >= 0 && case1 == 0 && case2 == 0 && case3 == 0) {
                                var case1_load = "", case1_val = "", case1_point = "",
                                    case2_load = "", case2_val = "", case2_point = "",
                                    case3_Load = "", case3_val = "", case3_point = "";
                                $scope.total = "";
                            }
                            else {

                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {
                                    if (case1 >= 6 && case1 <= 10) {
                                        case1_load = "6 to 10";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 11 && case1 <= 15) {
                                        case1_load = "11 to 15";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 16 && case1 <= 20) {
                                        case1_load = "16 to 20";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else if (case1 > 20) {
                                        case1_load = ">20";
                                        case1_val = case1;
                                        case1_point = "15";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {
                                        if (case2 >= 3 && case2 <= 6) {
                                            case2_load = "3 to 6";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 7 && case2 <= 10) {
                                            case2_load = "7 to 10";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 11 && case2 <= 15) {
                                            case2_load = "11 to 15";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else if (case2 > 15) {
                                            case2_load = ">15";
                                            case2_val = case2;
                                            case2_point = "15";
                                        }
                                        else {
                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";
                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 >= 1 && case3 <= 5) {
                                            case3_Load = "Upto 5";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 6 && case3 <= 10) {
                                            case3_Load = "6 to 10";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 11 && case3 <= 15) {
                                            case3_Load = "11 to 15";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 15) {
                                            case3_Load = ">15";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }
                                    }
                                }
                            }

                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                            var percen = 0;
                            if ($scope.total > 0 && $scope.total <= 10)
                                percen = "-20%"
                            if ($scope.total >= 11 && $scope.total <= 20)
                                percen = "50%"
                            if ($scope.total >= 21 && $scope.total <= 30)
                                percen = "75%"
                            if ($scope.total >= 31 && $scope.total <= 40)
                                percen = "100%"
                            if ($scope.total == "")
                                percen = ""




                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>"+ $scope.neweventval.length +"</th>"+
                                "<th></th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_load + "</th>" +
                                "<th>" + case1_val + "</th>" +
                                "<th>" + case1_point + "</th>" +

                                "<th>" + case2_load + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case2_point + "</th>" +

                                "<th>" + case3_Load + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case3_point + "</th>" +

                                "<th>" + $scope.total + "</th>" +
                                "<th>" + percen + "</th>" +


                                "</tr>"

                            )

                        }
                        $("#showdata").append($scope.dataimport);
                        if (checkeddata == true) {
                            var tdd = $scope.dataimport[0].cells
                            for (i = 0; i < tdd.length; i++)
                                tdd[i].id = 'table-row'
                        }
                    }

                    $scope.neweventval = [];
                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();

                var hhhh = [];

                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }


                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.final_singleval[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++;
                                var org = getheirarchy(orgUnitid);
                                //var org=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'orgUnit'];
                                var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];

                                var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'vhG2gN7KaEK'];
                                var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'qbgFsR4VWxU'];
                                var case3 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'zfMOVN2lc1S'];

                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point;

                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {
                                    if (case1 >= 6 && case1 <= 10) {
                                        case1_load = "6 to 10";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 11 && case1 <= 15) {
                                        case1_load = "11 to 15";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 16 && case1 <= 20) {
                                        case1_load = "16 to 20";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else if (case1 > 20) {
                                        case1_load = ">20";
                                        case1_val = case1;
                                        case1_point = "15";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {
                                        if (case2 >= 3 && case2 <= 6) {
                                            case2_load = "3 to 6";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 7 && case2 <= 10) {
                                            case2_load = "7 to 10";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 11 && case2 <= 15) {
                                            case2_load = "11 to 15";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else if (case2 > 15) {
                                            case2_load = ">15";
                                            case2_val = case2;
                                            case2_point = "15";
                                        }
                                        else {
                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";
                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 >= 1 && case3 <= 5) {
                                            case3_Load = "Upto 5";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 6 && case3 <= 10) {
                                            case3_Load = "6 to 10";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 11 && case1 <= 15) {
                                            case3_Load = "11 to 15";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 15) {
                                            case3_Load = ">15";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }
                                    }
                                }

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                                var percen = 0;
                                if ($scope.total > 0 && $scope.total <= 10)
                                    percen = "-20%"
                                if ($scope.total >= 11 && $scope.total <= 20)
                                    percen = "50%"
                                if ($scope.total >= 21 && $scope.total <= 30)
                                    percen = "75%"
                                if ($scope.total >= 31 && $scope.total <= 40)
                                    percen = "100%"
                                if ($scope.total == "")
                                    percen = ""


                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th></th>" +
                                    "<th></th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + specialist_name + "</th>" +

                                    "<th>" + case1_load + "</th>" +
                                    "<th>" + case1_val + "</th>" +
                                    "<th>" + case1_point + "</th>" +

                                    "<th>" + case2_load + "</th>" +
                                    "<th>" + case2_val + "</th>" +
                                    "<th>" + case2_point + "</th>" +

                                    "<th>" + case3_Load + "</th>" +
                                    "<th>" + case3_val + "</th>" +
                                    "<th>" + case3_point + "</th>" +

                                    "<th>" + $scope.total + "</th>" +
                                    "<th>" + percen + "</th>" +

                                    "</tr>"

                                )
                            }

                        }
                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }

                var returnteiuid = checkteiuid($scope.eventDeWiseValueMap, programname, $scope.ALLregisteredDoc_name_CMS)

                if (returnteiuid[0].length != 0) {
                    for (var x = 0; x < returnteiuid[0].length; x++) {
                        var checkeddata = checkInactiveData(returnteiuid[0][x]);
                        var returnorgunitid = checkorgunit($scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].ouid, programname)
                        if (returnorgunitid == "true") {
                            var lastupdate_date = '';
                            if (checkeddata == "true") {
                                lastupdate_date = $scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].lastupdate;
                            }
                            //var lastupdate_date = $scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].lastupdate;
                            var org = getheirarchy($scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].ouid);
                            var specialist_name = $scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].name;
                            var empty = "";
                            $scope.dataimport = $(
                                "<tr>" +
                                "<th></th>"+
                                "<th>" + lastupdate_date + "</th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +

                                "</tr>"

                            )
                            $("#showdata").append($scope.dataimport);
                            if (checkeddata == "true") {
                                var tdd = $scope.dataimport[0].cells
                                for (i = 0; i < tdd.length; i++)
                                    tdd[i].id = 'table-row'
                            }
                        }
                    }
                }
                document.getElementById("loader").style.display = "none";

                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            ////Anaesthetist - PBR monitoring
            if (program == "HTCqTWEF1XS" && programname == 'Anaesthetist - PBR monitoring') {
                var count = 0; $scope.dataimport = $();
                for (var i in $scope.eventList) {
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap) {
                        var new_uid = j.split('-');
                        if ($scope.eventList[i] == new_uid[0]) {
                            count++
                            $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];
                            var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);
                            var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                            var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'vhG2gN7KaEK'];
                            var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'qbgFsR4VWxU'];
                            var case3 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'zfMOVN2lc1S'];

                            var case1_val, case2_val, case3_val;
                            ///case 1
                            if (case1 == undefined)
                                case1_val = 0;
                            else
                                case1_val = case1;

                            ///////////case 2
                            if (case2 == undefined)
                                case2_val = 0;
                            else
                                case2_val = case2;

                            /////case 3

                            if (case3 == undefined)
                                case3_val = 0;
                            else
                                case3_val = case3;

                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                            if ($scope.total == "NaN")
                                $scope.total = 0;


                        }


                    }
                    $scope.dataimport = $(
                        "<tr>" +
                        "<th>" + event_date + "</th>" +
                        "<th>" + org + "</th>" +
                        "<th>" + $scope.specialist_name + "</th>" +
                        "<th>" + case1_val + "</th>" +
                        "<th>" + case2_val + "</th>" +
                        "<th>" + case3_val + "</th>" +
                        "</tr>"

                    )

                    //$('#loader').attr('style','display:none !important');

                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }
                document.getElementById("loader").style.display = "none";

                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }

            }

            ////Anaesthetist - PBR monitoring(under CMO)
            if (program == "HTCqTWEF1XS" && programname == 'Anaesthetist - PBR monitoring(under CMO)') {
                var count = 0; $scope.dataimport = $();

                for (var i = 0; i < $scope.eventList.length; i++) {
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap) {

                        var new_uid = j.split('-');

                        if ($scope.eventList[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++;
                                var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);
                                var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                                var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'vhG2gN7KaEK'];
                                var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'qbgFsR4VWxU'];
                                var case3 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'zfMOVN2lc1S'];
                                $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];

                                var case1_val, case2_val, case3_val;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_val = 0;
                                }
                                else {
                                    case1_val = case1;
                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_val = 0;
                                }
                                else {
                                    case2_val = case2;
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_val = 0;
                                }
                                else {
                                    case3_val = case3;

                                }
                                var tt = Number(case2_point), ttt = Number(case2_point), ttttt = tt + ttt;

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                                if ($scope.total == "NaN")
                                    $scope.total = 0;

                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th>" + event_date + "</th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + $scope.specialist_name + "</th>" +

                                    "<th>" + case1_val + "</th>" +

                                    "<th>" + case2_val + "</th>" +

                                    "<th>" + case3_val + "</th>" +


                                    "</tr>"

                                )



                            }
                        }

                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }
                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }

            }




            ////Anaesthetist - PBR monitoring(under CMS)
            if (program == "HTCqTWEF1XS" && programname == 'Anaesthetist - PBR monitoring(under CMS)') {

                var count = 0; $scope.dataimport = $();
                for (var i = 0; i < $scope.eventList.length; i++) {
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap) {



                        var new_uid = j.split('-');

                        if ($scope.eventList[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++;
                                var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);
                                var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                                var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'vhG2gN7KaEK'];
                                var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'qbgFsR4VWxU'];
                                var case3 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'zfMOVN2lc1S'];
                                $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];
                                console.log($scope.specialist_name);


                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_val = 0;
                                }
                                else {
                                    case1_val = case1;
                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_val = 0;
                                }
                                else {
                                    case2_val = case2;
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_val = 0;
                                }
                                else {
                                    case3_val = case3;
                                }
                                var tt = Number(case2_point), ttt = Number(case2_point), ttttt = tt + ttt;

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point)).toFixed(2);
                                if ($scope.total == "NaN")
                                    $scope.total = 0;

                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th>" + event_date + "</th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + $scope.specialist_name + "</th>" +
                                    "<th>" + case1_val + "</th>" +

                                    "<th>" + case2_val + "</th>" +

                                    "<th>" + case3_val + "</th>" +


                                    "</tr>"

                                )

                            }
                        }
                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }

                }
                document.getElementById("loader").style.display = "none";

                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }
            //////Gynaecologist - PBR monitoring(Aggregated)
            if (program == "K3XysZ53B4r" && programname == "Gynaecologist - PBR monitoring(Aggregated)") {
                var count = 0; $scope.dataimport = $();

                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;


                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {

                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) { return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0); });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                            //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });


                    if ($scope.neweventval.length != 0) {

                        count++
                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);

                        var checkeddata = checkInactiveData($scope.FinalEnteredVal['eventuid'])

                        var specialist_name = $scope.FinalEnteredVal["docname"];
                        var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);

                        var case1 = $scope.FinalEnteredVal["kChiZJPd5je"];
                        var case2 = $scope.FinalEnteredVal["wTdcUXWeqhN"];
                        var case3 = $scope.FinalEnteredVal["eryy31EUorR"];
                        var case4 = $scope.FinalEnteredVal["cqw0HGZQzhD"];

                        var case1_val, case2_val, case3_val, case4_val;
                        ///case 1
                        if (case1 == undefined) {
                            case1_val = 0;
                        }
                        else {
                            case1_val = case1;
                        }


                        ///////////case 2
                        if (case2 == undefined) {
                            case2_val = 0;
                        }
                        else {
                            case2_val = case2;
                        }
                        /////case 3

                        if (case3 == undefined) {
                            case3_val = 0;
                        }
                        else {
                            case3_val = case3;
                        }



                        //case 4
                        if (case4 == undefined) {
                            case4_val = 0;
                        }
                        else {
                            case4_val = case4;
                        }


                        $scope.dataimport = $(
                            "<tr>" +
                            "<th>" + org + "</th>" +
                            "<th>" + specialist_name + "</th>" +

                            "<th>" + case1_val + "</th>" +
                            "<th>" + case2_val + "</th>" +
                            "<th>" + case3_val + "</th>" +
                            "<th>" + case4_val + "</th>" +

                            "</tr>"

                        )

                        $("#showdata").append($scope.dataimport);
                        if (checkeddata == true) {
                            var tdd = $scope.dataimport[0].cells
                            for (i = 0; i < tdd.length; i++)
                                tdd[i].id = 'table-row'
                        }
                    }

                    $scope.neweventval = [];
                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();



                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }


                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.final_singleval[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            count++
                            var org = getheirarchy($scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']);
                            var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];

                            var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'kChiZJPd5je'];
                            var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'wTdcUXWeqhN'];
                            var case3 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'eryy31EUorR'];
                            var case4 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'cqw0HGZQzhD'];



                            var case1_val, case2_val, case3_val, case4_val;
                            ///case 1
                            if (case1 == undefined) {
                                case1_val = 0;
                            }
                            else {
                                case1_val = case1;

                            }


                            ///////////case 2
                            if (case2 == undefined) {
                                case2_val = 0;
                            }
                            else {
                                case2_val = case2;

                            }
                            /////case 3

                            if (case3 == undefined) {
                                case3_val = 0;
                            }
                            else {
                                case3_val = case3;
                            }



                            //case 4
                            if (case4 == undefined) {
                                case4_val = 0;
                            }
                            else {
                                case4_val = case4;

                            }

                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_val + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case4_val + "</th>" +

                                "</tr>"

                            )
                        }


                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }
                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            //Gynaecologist - PBR monitoring(under CMO(Aggregated))
            if (program == "K3XysZ53B4r" && programname == "Gynaecologist - PBR monitoring(under CMO(Aggregated))") {


                $scope.ALLregisteredDoc_name_CMO = []
                var param1 = "var=programuid:" + program + "&var=orgunitid:" + $scope.selorgunitid[0]
                MetadataService.getSQLView(SQLViewsName2IdMap["TRACKER_ALLDOC_CMO"], param1).then(function (doc) {

                    for (var i = 0; i < doc.listGrid.rows.length; i++) {
                        $scope.ALLregisteredDoc_name_CMO[doc.listGrid.rows[i][0]] = { name: doc.listGrid.rows[i][1], ouid: doc.listGrid.rows[i][2] ,lastupdate: doc.listGrid.rows[i][4]}
                        if (doc.listGrid.rows[i][3] == true)
                            $scope.inactivedata[doc.listGrid.rows[i][0]] = 'true'
                    }

                })
                var count = 0; $scope.dataimport = $();

                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;


                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {

                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) { return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0); });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                            //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });


                    if ($scope.neweventval.length != 0) {
                        count++
                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);
                        var checkeddata = checkInactiveData($scope.FinalEnteredVal['eventuid'])
                        var orgUnitid = $scope.FinalEnteredVal['orgunitid']
                        var returnvalue = checkorgunit(orgUnitid, programname);
                        if (returnvalue == "true") {

                            var datacount = $scope.FinalEnteredVal['count']
                            var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);
                            var case1 = $scope.FinalEnteredVal["kChiZJPd5je"];
                            var case2 = $scope.FinalEnteredVal["wTdcUXWeqhN"];
                            var case3 = $scope.FinalEnteredVal["eryy31EUorR"];
                            var case4 = $scope.FinalEnteredVal["cqw0HGZQzhD"];


                            //var org=$scope.FinalEnteredVal["orgunit"];
                            var specialist_name = $scope.FinalEnteredVal["docname"];

                            if (datacount >= 0 && case1 == 0 && case2 == 0 && case3 == 0 && case4 == 0) {
                                var case1_load = "", case1_val = "", case1_point = "",
                                    case2_load = "", case2_val = "", case2_point = "",
                                    case3_Load = "", case3_val = "", case3_point = "",
                                    case4_Load = "", case4_val = "", case4_point = "";
                                $scope.total = "";
                            }
                            else {


                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point
                                case4_Load, case4_val, case4_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {

                                    if (case1 >= 4 && case1 <= 6) {
                                        case1_load = "4 to 6";
                                        case1_val = case1;
                                        case1_point = "2.5";
                                    }
                                    else if (case1 >= 7 && case1 <= 9) {
                                        case1_load = "7 to 9";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 10 && case1 <= 12) {
                                        case1_load = "10 to 12";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 12) {
                                        case1_load = ">12";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {

                                        if (case2 >= 6 && case2 <= 8) {
                                            case2_load = "6 to 8";
                                            case2_val = case2;
                                            case2_point = "2.5";
                                        }
                                        else if (case2 >= 9 && case2 <= 11) {
                                            case2_load = "9 to 11";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 12 && case2 <= 15) {
                                            case2_load = "12 to 15";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 8) {
                                            case2_load = ">15";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else {

                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";

                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 >= 1 && case3 <= 2) {
                                            case3_Load = "Upto 2";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 3 && case3 <= 5) {
                                            case3_Load = "3 to 5";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 6 && case3 <= 8) {
                                            case3_Load = "6 to 8";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 8) {
                                            case3_Load = ">8";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }


                                    }
                                }



                                //case 4
                                if (case4 == undefined) {
                                    case4_Load = 0;
                                    case4_val = 0;
                                    case4_point = 0;
                                }
                                else {
                                    if (case4 != undefined) {

                                        if (case4 >= 10 && case4 <= 15) {
                                            case4_Load = "10 to 15 ";
                                            case4_val = case4;
                                            case4_point = "2.5";
                                        }
                                        else if (case4 >= 16 && case4 <= 30) {
                                            case4_Load = "16 to 30";
                                            case4_val = case4;
                                            case4_point = "5";
                                        }
                                        else if (case4 >= 31 && case4 <= 50) {
                                            case4_Load = "31 to 50";
                                            case4_val = case4;
                                            case4_point = "7.5";
                                        }
                                        else if (case4 >= 50) {
                                            case4_Load = ">50";
                                            case4_val = case4;
                                            case4_point = "10";
                                        }
                                        else {
                                            case4_Load = "0";
                                            case4_val = case4;
                                            case4_point = "0";
                                        }
                                    }
                                }
                            }
                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                            var percen = 0;
                            if ($scope.total > 0 && $scope.total <= 10)
                                percen = "-20%"
                            if ($scope.total >= 11 && $scope.total <= 20)
                                percen = "50%"
                            if ($scope.total >= 21 && $scope.total <= 30)
                                percen = "75%"
                            if ($scope.total >= 31 && $scope.total <= 40)
                                percen = "100%"
                            if ($scope.total == "")
                                percen = ""


                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>"+ $scope.neweventval.length +"</th>" +
                                "<th></th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_load + "</th>" +
                                "<th>" + case1_val + "</th>" +
                                "<th>" + case1_point + "</th>" +

                                "<th>" + case2_load + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case2_point + "</th>" +

                                "<th>" + case3_Load + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case3_point + "</th>" +

                                "<th>" + case4_Load + "</th>" +
                                "<th>" + case4_val + "</th>" +
                                "<th>" + case4_point + "</th>" +

                                "<th>" + $scope.total + "</th>" +
                                "<th>" + percen + "</th>" +

                                "</tr>"

                            )

                        }
                    }
                    $scope.neweventval = []
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();



                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }


                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.final_singleval[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++
                                var org = getheirarchy($scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']);
                                var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];

                                var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'kChiZJPd5je'];
                                var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'wTdcUXWeqhN'];
                                var case3 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'eryy31EUorR'];
                                var case4 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'cqw0HGZQzhD'];



                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point
                                case4_Load, case4_val, case4_point;

                                ///case 1
                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {

                                    if (case1 >= 4 && case1 <= 6) {
                                        case1_load = "4 to 6";
                                        case1_val = case1;
                                        case1_point = "2.5";
                                    }
                                    else if (case1 >= 7 && case1 <= 9) {
                                        case1_load = "7 to 9";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 10 && case1 <= 12) {
                                        case1_load = "10 to 12";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 12) {
                                        case1_load = ">12";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {

                                        if (case2 >= 6 && case2 <= 8) {
                                            case2_load = "6 to 8";
                                            case2_val = case2;
                                            case2_point = "2.5";
                                        }
                                        else if (case2 >= 9 && case2 <= 11) {
                                            case2_load = "9 to 11";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 12 && case2 <= 15) {
                                            case2_load = "12 to 15";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 8) {
                                            case2_load = ">15";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else {

                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";

                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 >= 1 && case3 <= 2) {
                                            case3_Load = "Upto 2";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 3 && case3 <= 5) {
                                            case3_Load = "3 to 5";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 6 && case3 <= 8) {
                                            case3_Load = "6 to 8";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 8) {
                                            case3_Load = ">8";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }


                                    }
                                }



                                //case 4
                                if (case4 == undefined) {
                                    case4_Load = 0;
                                    case4_val = 0;
                                    case4_point = 0;
                                }
                                else {
                                    if (case4 != undefined) {

                                        if (case4 >= 10 && case4 <= 15) {
                                            case4_Load = "10 to 15 ";
                                            case4_val = case4;
                                            case4_point = "2.5";
                                        }
                                        else if (case4 >= 16 && case4 <= 30) {
                                            case4_Load = "16 to 30";
                                            case4_val = case4;
                                            case4_point = "5";
                                        }
                                        else if (case4 >= 31 && case4 <= 50) {
                                            case4_Load = "31 to 50";
                                            case4_val = case4;
                                            case4_point = "7.5";
                                        }
                                        else if (case4 >= 50) {
                                            case4_Load = ">50";
                                            case4_val = case4;
                                            case4_point = "10";
                                        }
                                        else {
                                            case4_Load = "0";
                                            case4_val = case4;
                                            case4_point = "0";
                                        }
                                    }
                                }

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                                var percen = 0;
                                if ($scope.total > 0 && $scope.total <= 10)
                                    percen = "-20%"
                                if ($scope.total >= 11 && $scope.total <= 20)
                                    percen = "50%"
                                if ($scope.total >= 21 && $scope.total <= 30)
                                    percen = "75%"
                                if ($scope.total >= 31 && $scope.total <= 40)
                                    percen = "100%"
                                if ($scope.total == "")
                                    percen = ""

                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th></th>" +
                                    "<th></th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + specialist_name + "</th>" +

                                    "<th>" + case1_load + "</th>" +
                                    "<th>" + case1_val + "</th>" +
                                    "<th>" + case1_point + "</th>" +

                                    "<th>" + case2_load + "</th>" +
                                    "<th>" + case2_val + "</th>" +
                                    "<th>" + case2_point + "</th>" +

                                    "<th>" + case3_Load + "</th>" +
                                    "<th>" + case3_val + "</th>" +
                                    "<th>" + case3_point + "</th>" +

                                    "<th>" + case4_Load + "</th>" +
                                    "<th>" + case4_val + "</th>" +
                                    "<th>" + case4_point + "</th>" +

                                    "<th>" + $scope.total + "</th>" +
                                    "<th>" + percen + "</th>" +

                                    "</tr>"

                                )
                            }


                        }
                    }
                }
                $("#showdata").append($scope.dataimport);
                if (checkeddata == true) {
                    var tdd = $scope.dataimport[0].cells
                    for (i = 0; i < tdd.length; i++)
                        tdd[i].id = 'table-row'
                }


                var returnteiuid = checkteiuid($scope.eventDeWiseValueMap, programname, $scope.ALLregisteredDoc_name_CMO)
                if (returnteiuid[0].length != 0) {
                    for (var x = 0; x < returnteiuid[0].length; x++) {
                        var returnorgunitid = checkorgunit($scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].ouid, programname)
                        if (returnorgunitid == "true") {
                            var lastupdate_date = '';
                            var checkeddata = checkInactiveData(returnteiuid[0][x]);
                            if (checkeddata == "true") {
                                lastupdate_date = $scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].lastupdate;
                            }
                            //var lastupdate_date = $scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].lastupdate;
                            var org = getheirarchy($scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].ouid);
                            var specialist_name = $scope.ALLregisteredDoc_name_CMO[returnteiuid[0][x]].name;
                            var empty = ""

                            $scope.dataimport = $(
                                "<tr>" +
                                "<th></th>" +
                                "<th>" + lastupdate_date + "</th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +

                                "</tr>"

                            );
                            $("#showdata").append($scope.dataimport);
                            if (checkeddata == "true") {
                                var tdd = $scope.dataimport[0].cells
                                for (i = 0; i < tdd.length; i++)
                                    tdd[i].id = 'table-row'
                            }
                        }
                    }

                }
            }
            document.getElementById("loader").style.display = "none";
            if (count == 0) {
                document.getElementById("divId").style.display = "none";
                document.getElementById("Scoringtable").style.display = "none";
                document.getElementById("showdiv").style.display = "block";
            }
            else {
                document.getElementById("divId").style.display = "block";
                document.getElementById("Scoringtable").style.display = "block";
                document.getElementById("showdiv").style.display = "none";

            }


            // Gynaecologist - PBR monitoring(under CMS(Aggregated))
            if (program == "K3XysZ53B4r" && programname == "Gynaecologist - PBR monitoring(under CMS(Aggregated))") {

                $scope.ALLregisteredDoc_name_CMS = []
                var param1 = "var=programuid:" + program + "&var=orgunitid:" + $scope.selorgunitid[0]
                MetadataService.getSQLView(SQLViewsName2IdMap["TRACKER_ALLDOC_CMS"], param1).then(function (doc) {

                    for (var i = 0; i < doc.listGrid.rows.length; i++) {
                        $scope.ALLregisteredDoc_name_CMS[doc.listGrid.rows[i][0]] = { name: doc.listGrid.rows[i][1], ouid: doc.listGrid.rows[i][2] , lastupdate: doc.listGrid.rows[i][4]}
                        if (doc.listGrid.rows[i][3] == true)
                            $scope.inactivedata[doc.listGrid.rows[i][0]] = 'true'
                    }


                })
                var count = 0; $scope.dataimport = $();


                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;


                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {

                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) { return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0); });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                            //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });


                    if ($scope.neweventval.length != 0) {
                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);
                        var checkeddata = checkInactiveData($scope.FinalEnteredVal['eventuid'])

                        var orgUnitid = $scope.FinalEnteredVal['orgunitid']
                        var returnvalue = checkorgunit(orgUnitid, programname);
                        if (returnvalue == "true") {
                            count++
                            var datacount = $scope.FinalEnteredVal['count']
                            var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);
                            var case1 = $scope.FinalEnteredVal["kChiZJPd5je"];
                            var case2 = $scope.FinalEnteredVal["wTdcUXWeqhN"];
                            var case3 = $scope.FinalEnteredVal["eryy31EUorR"];
                            var case4 = $scope.FinalEnteredVal["cqw0HGZQzhD"];


                            //var org=$scope.FinalEnteredVal["orgunit"];
                            var specialist_name = $scope.FinalEnteredVal["docname"];

                            if (datacount >= 0 && case1 == 0 && case2 == 0 && case3 == 0 && case4 == 0) {
                                var case1_load = "", case1_val = "", case1_point = "",
                                    case2_load = "", case2_val = "", case2_point = "",
                                    case3_Load = "", case3_val = "", case3_point = "",
                                    case4_Load = "", case4_val = "", case4_point = "";
                                $scope.total = "";
                            }
                            else {

                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point
                                case4_Load, case4_val, case4_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {

                                    if (case1 >= 6 && case1 <= 10) {
                                        case1_load = "6 to 10";
                                        case1_val = case1;
                                        case1_point = "2.5";
                                    }
                                    else if (case1 >= 11 && case1 <= 15) {
                                        case1_load = "11 to 15";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 16 && case1 <= 20) {
                                        case1_load = "16 to 20";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 20) {
                                        case1_load = ">20";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {

                                        if (case2 >= 6 && case2 <= 10) {
                                            case2_load = "6 to 10";
                                            case2_val = case2;
                                            case2_point = "2.5";
                                        }
                                        else if (case2 >= 11 && case2 <= 15) {
                                            case2_load = "11 to 15";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 16 && case2 <= 20) {
                                            case2_load = "16 to 20";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 20) {
                                            case2_load = ">20";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else {

                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";

                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 >= 3 && case3 <= 6) {
                                            case3_Load = "3 to 6";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 7 && case3 <= 10) {
                                            case3_Load = "7 to 10";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 11 && case3 <= 15) {
                                            case3_Load = "11 to 15";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 15) {
                                            case3_Load = ">15";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }


                                    }
                                }



                                //case 4
                                if (case4 == undefined) {
                                    case4_Load = 0;
                                    case4_val = 0;
                                    case4_point = 0;
                                }
                                else {
                                    if (case4 != undefined) {

                                        if (case4 >= 10 && case4 <= 15) {
                                            case4_Load = "10 to 15 ";
                                            case4_val = case4;
                                            case4_point = "2.5";
                                        }
                                        else if (case4 >= 16 && case4 <= 30) {
                                            case4_Load = "16 to 30";
                                            case4_val = case4;
                                            case4_point = "5";
                                        }
                                        else if (case4 >= 31 && case4 <= 50) {
                                            case4_Load = "31 to 50";
                                            case4_val = case4;
                                            case4_point = "7.5";
                                        }
                                        else if (case4 >= 51) {
                                            case4_Load = ">50";
                                            case4_val = case4;
                                            case4_point = "10";
                                        }
                                        else {
                                            case4_Load = "0";
                                            case4_val = case4;
                                            case4_point = "0";
                                        }
                                    }
                                }
                            }
                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                            var percen = 0;
                            if ($scope.total > 0 && $scope.total <= 10)
                                percen = "-20%"
                            if ($scope.total >= 11 && $scope.total <= 20)
                                percen = "50%"
                            if ($scope.total >= 21 && $scope.total <= 30)
                                percen = "75%"
                            if ($scope.total >= 31 && $scope.total <= 40)
                                percen = "100%"
                            if ($scope.total == "")
                                percen = ""



                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>" + $scope.neweventval.length + "</th>" +
                                "<th></th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_load + "</th>" +
                                "<th>" + case1_val + "</th>" +
                                "<th>" + case1_point + "</th>" +

                                "<th>" + case2_load + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case2_point + "</th>" +

                                "<th>" + case3_Load + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case3_point + "</th>" +

                                "<th>" + case4_Load + "</th>" +
                                "<th>" + case4_val + "</th>" +
                                "<th>" + case4_point + "</th>" +

                                "<th>" + $scope.total + "</th>" +
                                "<th>" + percen + "</th>" +

                                "</tr>"

                            )

                        }
                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                    $scope.neweventval = [];
                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();



                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }


                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.final_singleval[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++
                                var org = getheirarchy($scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']);
                                var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];

                                var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'kChiZJPd5je'];
                                var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'wTdcUXWeqhN'];
                                var case3 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'eryy31EUorR'];
                                var case4 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'cqw0HGZQzhD'];



                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point
                                case4_Load, case4_val, case4_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_load = 0;
                                    case1_val = 0;
                                    case1_point = 0;

                                }
                                else {

                                    if (case1 >= 6 && case1 <= 10) {
                                        case1_load = "6 to 10";
                                        case1_val = case1;
                                        case1_point = "2.5";
                                    }
                                    else if (case1 >= 11 && case1 <= 15) {
                                        case1_load = "11 to 15";
                                        case1_val = case1;
                                        case1_point = "5";
                                    }
                                    else if (case1 >= 16 && case1 <= 20) {
                                        case1_load = "16 to 20";
                                        case1_val = case1;
                                        case1_point = "7.5";
                                    }
                                    else if (case1 >= 20) {
                                        case1_load = ">20";
                                        case1_val = case1;
                                        case1_point = "10";
                                    }
                                    else {
                                        case1_load = "0";
                                        case1_val = case1;
                                        case1_point = "0";
                                    }

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_load = 0;
                                    case2_val = 0;
                                    case2_point = 0;
                                }
                                else {
                                    if (case2 != undefined) {

                                        if (case2 >= 6 && case2 <= 10) {
                                            case2_load = "6 to 10";
                                            case2_val = case2;
                                            case2_point = "2.5";
                                        }
                                        else if (case2 >= 11 && case2 <= 15) {
                                            case2_load = "11 to 15";
                                            case2_val = case2;
                                            case2_point = "5";
                                        }
                                        else if (case2 >= 16 && case2 <= 20) {
                                            case2_load = "16 to 20";
                                            case2_val = case2;
                                            case2_point = "7.5";
                                        }
                                        else if (case2 >= 20) {
                                            case2_load = ">20";
                                            case2_val = case2;
                                            case2_point = "10";
                                        }
                                        else {

                                            case2_load = "0";
                                            case2_val = case2;
                                            case2_point = "0";

                                        }
                                    }
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_Load = 0;
                                    case3_val = 0;
                                    case3_point = 0;
                                }
                                else {
                                    if (case3 != undefined) {
                                        if (case3 >= 3 && case3 <= 6) {
                                            case3_Load = "3 to 6";
                                            case3_val = case3;
                                            case3_point = "2.5";
                                        }
                                        else if (case3 >= 7 && case3 <= 10) {
                                            case3_Load = "7 to 10";
                                            case3_val = case3;
                                            case3_point = "5";
                                        }
                                        else if (case3 >= 11 && case3 <= 15) {
                                            case3_Load = "11 to 15";
                                            case3_val = case3;
                                            case3_point = "7.5";
                                        }
                                        else if (case3 >= 15) {
                                            case3_Load = ">15";
                                            case3_val = case3;
                                            case3_point = "10";
                                        }
                                        else {
                                            case3_Load = "0";
                                            case3_val = case3;
                                            case3_point = "0";
                                        }


                                    }
                                }



                                //case 4
                                if (case4 == undefined) {
                                    case4_Load = 0;
                                    case4_val = 0;
                                    case4_point = 0;
                                }
                                else {
                                    if (case4 != undefined) {

                                        if (case4 >= 10 && case4 <= 15) {
                                            case4_Load = "10 to 15 ";
                                            case4_val = case4;
                                            case4_point = "2.5";
                                        }
                                        else if (case4 >= 3 && case4 <= 5) {
                                            case4_Load = "16 to 30";
                                            case4_val = case4;
                                            case4_point = "5";
                                        }
                                        else if (case4 >= 11 && case4 <= 15) {
                                            case4_Load = "31 to 50";
                                            case4_val = case4;
                                            case4_point = "7.5";
                                        }
                                        else if (case4 >= 8) {
                                            case4_Load = ">50";
                                            case4_val = case4;
                                            case4_point = "10";
                                        }
                                        else {
                                            case4_Load = "0";
                                            case4_val = case4;
                                            case4_point = "0";
                                        }
                                    }
                                }

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                                var percen = 0;
                                if ($scope.total > 0 && $scope.total <= 10)
                                    percen = "-20%"
                                if ($scope.total >= 11 && $scope.total <= 20)
                                    percen = "50%"
                                if ($scope.total >= 21 && $scope.total <= 30)
                                    percen = "75%"
                                if ($scope.total >= 31 && $scope.total <= 40)
                                    percen = "100%"
                                if ($scope.total == "")
                                    percen = ""


                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th></th>" +
                                    "<th></th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + specialist_name + "</th>" +

                                    "<th>" + case1_load + "</th>" +
                                    "<th>" + case1_val + "</th>" +
                                    "<th>" + case1_point + "</th>" +

                                    "<th>" + case2_load + "</th>" +
                                    "<th>" + case2_val + "</th>" +
                                    "<th>" + case2_point + "</th>" +

                                    "<th>" + case3_Load + "</th>" +
                                    "<th>" + case3_val + "</th>" +
                                    "<th>" + case3_point + "</th>" +

                                    "<th>" + case4_Load + "</th>" +
                                    "<th>" + case4_val + "</th>" +
                                    "<th>" + case4_point + "</th>" +

                                    "<th>" + $scope.total + "</th>" +
                                    "<th>" + percen + "</th>" +

                                    "</tr>"

                                )



                            }


                        }
                    }
                } $("#showdata").append($scope.dataimport);
                if (checkeddata == true) {
                    var tdd = $scope.dataimport[0].cells
                    for (i = 0; i < tdd.length; i++)
                        tdd[i].id = 'table-row'
                }


                var returnteiuid = checkteiuid($scope.eventDeWiseValueMap, programname, $scope.ALLregisteredDoc_name_CMS)
                if (returnteiuid[0].length != 0) {
                    for (var x = 0; x < returnteiuid[0].length; x++) {
                        var returnorgunitid = checkorgunit($scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].ouid, programname)
                        if (returnorgunitid == "true") {
                            var lastupdate_date = '';
                            var checkeddata = checkInactiveData(returnteiuid[0][x]);
                            if (checkeddata == "true") {
                                lastupdate_date = $scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].lastupdate;
                            }
                            //var lastupdate_date = $scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].lastupdate;
                            var org = getheirarchy($scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].ouid);
                            var specialist_name = $scope.ALLregisteredDoc_name_CMS[returnteiuid[0][x]].name;
                            var empty = "";
                            $scope.dataimport = $(
                                "<tr>" +
                                "<th></th>"+
                                "<th>" + lastupdate_date + "</th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + specialist_name + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +
                                "<th>" + empty + "</th>" +

                                "<th>" + empty + "</th>" +


                                "</tr>"

                            )
                            $("#showdata").append($scope.dataimport);
                            if (checkeddata == "true") {
                                var tdd = $scope.dataimport[0].cells
                                for (i = 0; i < tdd.length; i++)
                                    tdd[i].id = 'table-row'
                            }
                        }
                    }
                }

                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            //Gynaecologist - PBR monitoring
            if (program == "K3XysZ53B4r" && programname == "Gynaecologist - PBR monitoring") {
                var count = 0; $scope.dataimport = $();
                for (var i = 0; i < $scope.eventList.length; i++) {
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap) {

                        var new_uid = j.split('-');

                        if ($scope.eventList[i] == new_uid[0]) {
                            count++

                            var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);
                            var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                            var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'kChiZJPd5je'];
                            var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'wTdcUXWeqhN'];
                            var case3 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eryy31EUorR'];
                            var case4 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'cqw0HGZQzhD'];
                            $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];

                            var case1_load, case1_val, case1_point,
                                case2_load, case2_val, case2_point,
                                case3_Load, case3_val, case3_point
                            case4_Load, case4_val, case4_point;
                            ///case 1
                            if (case1 == undefined) {
                                case1_load = 0;
                                case1_val = 0;
                                case1_point = 0;

                            }
                            else {
                                if (case1 >= 4 && case1 <= 6) {
                                    case1_load = "4 to 6";
                                    case1_val = case1;
                                    case1_point = "2.5";
                                }
                                else if (case1 >= 7 && case1 <= 9) {
                                    case1_load = "7 to 9";
                                    case1_val = case1;
                                    case1_point = "5";
                                }
                                else if (case1 >= 10 && case1 <= 12) {
                                    case1_load = "10 to 12";
                                    case1_val = case1;
                                    case1_point = "7.5";
                                }
                                else if (case1 >= 12) {
                                    case1_load = ">12";
                                    case1_val = case1;
                                    case1_point = "15";
                                }
                                else {
                                    case1_load = "0";
                                    case1_val = case1;
                                    case1_point = "0";
                                }

                            }


                            ///////////case 2
                            if (case2 == undefined) {
                                case2_load = 0;
                                case2_val = 0;
                                case2_point = 0;
                            }
                            else {
                                if (case2 != undefined) {
                                    if (case2 >= 6 && case2 <= 8) {
                                        case2_load = "6 to 8";
                                        case2_val = case2;
                                        case2_point = "2.5";
                                    }
                                    else if (case2 >= 9 && case2 <= 11) {
                                        case2_load = "9 to 11";
                                        case2_val = case2;
                                        case2_point = "5";
                                    }
                                    else if (case2 >= 12 && case2 <= 15) {
                                        case2_load = "12 to 15";
                                        case2_val = case2;
                                        case2_point = "7.5";
                                    }
                                    else if (case2 >= 8) {
                                        case2_load = ">15";
                                        case2_val = case2;
                                        case2_point = "10";
                                    }
                                    else {
                                        case2_load = "0";
                                        case2_val = case2;
                                        case2_point = "0";
                                    }
                                }
                            }
                            /////case 3

                            if (case3 == undefined) {
                                case3_Load = 0;
                                case3_val = 0;
                                case3_point = 0;
                            }
                            else {
                                if (case3 != undefined) {
                                    if (case3 <= 2) {
                                        case3_Load = "Upto 2";
                                        case3_val = case3;
                                        case3_point = "2.5";
                                    }
                                    else if (case3 >= 3 && case3 <= 5) {
                                        case3_Load = "3 to 5";
                                        case3_val = case3;
                                        case3_point = "5";
                                    }
                                    else if (case3 >= 11 && case3 <= 15) {
                                        case3_Load = "11 to 15";
                                        case3_val = case3;
                                        case3_point = "7.5";
                                    }
                                    else if (case3 >= 8) {
                                        case3_Load = ">8";
                                        case3_val = case3;
                                        case3_point = "10";
                                    }
                                    else {
                                        case3_Load = "0";
                                        case3_val = case3;
                                        case3_point = "0";
                                    }
                                }
                            }



                            //case 4
                            if (case4 == undefined) {
                                case4_Load = 0;
                                case4_val = 0;
                                case4_point = 0;
                            }
                            else {
                                if (case4 != undefined) {
                                    if (case4 >= 10 && case4 <= 15) {
                                        case4_Load = "10 to 15 ";
                                        case4_val = case4;
                                        case4_point = "2.5";
                                    }
                                    else if (case4 >= 3 && case4 <= 5) {
                                        case4_Load = "16 to 30";
                                        case4_val = case4;
                                        case4_point = "5";
                                    }
                                    else if (case4 >= 11 && case4 <= 15) {
                                        case4_Load = "31 to 50";
                                        case4_val = case4;
                                        case4_point = "7.5";
                                    }
                                    else if (case4 >= 8) {
                                        case4_Load = ">50";
                                        case4_val = case4;
                                        case4_point = "10";
                                    }
                                    else {
                                        case4_Load = "0";
                                        case4_val = case4;
                                        case4_point = "0";
                                    }
                                }
                            }

                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                            if ($scope.total == "NaN")
                                $scope.total = 0;

                            $scope.dataimport = $(
                                "<tr>" +
                                "<th>" + event_date + "</th>" +
                                "<th>" + org + "</th>" +
                                "<th>" + $scope.specialist_name + "</th>" +
                                "<th>" + case1_val + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case4_val + "</th>" +
                                "</tr>"

                            )
                        }


                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }



                }
                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            //Gynaecologist - PBR monitoring(CMO)
            if (program == "K3XysZ53B4r" && programname == "Gynaecologist - PBR monitoring(under CMO)") {
                var count = 0; $scope.dataimport = $();
                for (var i = 0; i < $scope.eventList.length; i++) {
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap) {

                        var new_uid = j.split('-');

                        if ($scope.eventList[i] == new_uid[0]) {

                            var orgUnitid = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++
                                $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];
                                var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);
                                var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                                var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'kChiZJPd5je'];
                                var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'wTdcUXWeqhN'];
                                var case3 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eryy31EUorR'];
                                var case4 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'cqw0HGZQzhD'];

                                var case1_load, case1_val, case1_point,
                                    case2_load, case2_val, case2_point,
                                    case3_Load, case3_val, case3_point
                                case4_Load, case4_val, case4_point;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_val = 0;
                                }
                                else {
                                    case1_val = case1;
                                }


                                ///////////case 2
                                if (case2 == undefined) {

                                    case2_val = 0;
                                }
                                else {

                                    case2_val = case2;
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_val = 0;
                                }
                                else {
                                    case3_val = case3;
                                }



                                //case 4
                                if (case4 == undefined) {
                                    case4_val = 0;

                                }
                                else {
                                    case4_val = case4;
                                }

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                                if ($scope.total == "NaN")
                                    $scope.total = 0;

                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th>" + event_date + "</th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + $scope.specialist_name + "</th>" +
                                    "<th>" + case1_val + "</th>" +
                                    "<th>" + case2_val + "</th>" +
                                    "<th>" + case3_val + "</th>" +
                                    "<th>" + case4_val + "</th>" +
                                    "</tr>"

                                )

                            }
                        }
                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }

                }
                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            //Gynaecologist - PBR monitoring(CMS)
            if (program == "K3XysZ53B4r" && programname == "Gynaecologist - PBR monitoring(under CMS)") {
                var count = 0; $scope.dataimport = $();
                for (var i = 0; i < $scope.eventList.length; i++) {
                    var count = 0;
                    var checkeddata = checkInactiveData($scope.eventList[i])
                    for (var j in $scope.eventDeWiseValueMap) {

                        var new_uid = j.split('-');

                        if ($scope.eventList[i] == new_uid[0]) {
                            var orgUnitid = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']
                            var returnvalue = checkorgunit(orgUnitid, programname);
                            if (returnvalue == "true") {
                                count++

                                var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);
                                var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                                var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'kChiZJPd5je'];
                                var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'wTdcUXWeqhN'];
                                var case3 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eryy31EUorR'];
                                var case4 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'cqw0HGZQzhD'];
                                $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];


                                var case1_val, case2_val, case3_val, case4_val;
                                ///case 1
                                if (case1 == undefined) {
                                    case1_val = 0;

                                }
                                else {
                                    case1_val = case1;

                                }


                                ///////////case 2
                                if (case2 == undefined) {
                                    case2_val = 0;
                                }
                                else {
                                    case2_val = case2;
                                }
                                /////case 3

                                if (case3 == undefined) {
                                    case3_val = 0;
                                }
                                else {

                                    case3_val = case3;
                                }



                                //case 4
                                if (case4 == undefined) {
                                    case4_val = 0;
                                }
                                else {
                                    case4_val = case4;
                                }

                                $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point)).toFixed(2);
                                if ($scope.total == "NaN")
                                    $scope.total = 0;

                                $scope.dataimport = $(
                                    "<tr>" +
                                    "<th>" + event_date + "</th>" +
                                    "<th>" + org + "</th>" +
                                    "<th>" + $scope.specialist_name + "</th>" +
                                    "<th>" + case1_val + "</th>" +
                                    "<th>" + case2_val + "</th>" +
                                    "<th>" + case3_val + "</th>" +
                                    "<th>" + case4_val + "</th>" +
                                    "</tr>"

                                )



                            }

                        }
                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }

                }
                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }



            //////programname=="Paediatric - PBR monitoring(aggregrated)
            if (programname == "Paediatric - PBR monitoring(Aggregated)" && new_psuid == "PfRIIrvnjcU") {
                $scope.ALLregisteredDoc_name_Paediatric = []
                var param1 = "var=programuid:" + program + "&var=orgunitid:" + $scope.selorgunitid[0]
                MetadataService.getSQLView(SQLViewsName2IdMap["TRACKER_ALLDOC_Paediatric"], param1).then(function (doc) {

                    for (var i = 0; i < doc.listGrid.rows.length; i++) {
                        $scope.ALLregisteredDoc_name_Paediatric[doc.listGrid.rows[i][0]] = { name: doc.listGrid.rows[i][1], ouid: doc.listGrid.rows[i][2], inactive: doc.listGrid.rows[i][3], lastupdate: doc.listGrid.rows[i][4] }
                        if (doc.listGrid.rows[i][3] == true)
                            $scope.inactivedata[doc.listGrid.rows[i][0]] = 'true'
                    }

                })
                var count = 0; $scope.dataimport = $();

                $scope.neweventval = [];
                var case1 = 0, case2 = 0, case3 = 0;


                $scope.keyspresent = []; $scope.keyspresent_val = [];
                for (var j in $scope.eventDeWiseValueMap) {

                    if (j.includes('docname')) {
                        $scope.keyspresent[j] = $scope.eventDeWiseValueMap[j];

                    }

                }



                $scope.duplicateval = []

                $scope.key = Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }

                $scope.keyspresent = sortable.sort(function (a, b) { return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0); });
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    //var h=$scope.keyspresent[x+1][1];
                    if ((x + 1) < $scope.keyspresent.length - 1) {
                        if ($scope.keyspresent[x][1] == $scope.keyspresent[x + 1][1]) {
                            $scope.duplicateval.push($scope.keyspresent[x][1]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }
                    }

                }


                var new_sortable = [];
                for (var x = 0; x < $scope.keyspresent.length; x++) {
                    new_sortable[$scope.keyspresent[x][0]] = $scope.keyspresent[x][1];


                }

                $scope.keyspresent = new_sortable;

                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                for (var i = 0; i < $scope.duplicateval.length;) {
                    for (var x in $scope.keyspresent) {


                        if ($scope.keyspresent[x] == $scope.duplicateval[i]) {
                            var val1 = x.split('-');
                            $scope.neweventval.push(val1[0]);
                            //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                            //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                        }


                    }
                    i++;
                    $scope.neweventval = $scope.neweventval.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });

                    if ($scope.neweventval.length != 0) {
                        count++
                        $scope.FinalEnteredVal = getFinalvalue($scope.eventDeWiseValueMap, $scope.neweventval, $scope.programname);
                        var checkeddata = checkInactiveData($scope.FinalEnteredVal['eventuid'])
                        var specialist_name = $scope.FinalEnteredVal['docname'];
                        var org = getheirarchy($scope.FinalEnteredVal['orgunitid']);
                        var eventdate = getheirarchy($scope.FinalEnteredVal['orgunitid']);

                        var case1 = $scope.FinalEnteredVal['hTXa7qrYv3u'];
                        var case2 = $scope.FinalEnteredVal['vhG2gN7KaEK'];

                        var case3_value1 = $scope.FinalEnteredVal['zXdqhofvW2r'];
                        if (case3_value1 == undefined)
                            case3_value1 = 0;

                        var case3_value2 = $scope.FinalEnteredVal['ZZleevtpH87'];
                        if (case3_value2 == undefined)
                            case3_value2 = 0;

                        var case3 = (Math.round((case3_value1 / case3_value2) * 100)).toString();


                        var case4_value1_num = $scope.FinalEnteredVal['yQELYdrwRXg'];
                        if (case4_value1_num == undefined)
                            case4_value1_num = 0;
                        var case4_value2_num = $scope.FinalEnteredVal['jBlJz2IMl1S'];
                        if (case4_value2_num == undefined)
                            case4_value2_num = 0;
                        var case4_value3_num = $scope.FinalEnteredVal['DZMhZgqgKJa'];
                        if (case4_value3_num == undefined)
                            case4_value3_num = 0;
                        var case4_value1_dem = $scope.FinalEnteredVal['o1CRenXyXWt'];
                        if (case4_value1_dem == undefined)
                            case4_value1_dem = 0;
                        var case4_value2_dem = $scope.FinalEnteredVal['dq0j1v6wMhZ'];
                        if (case4_value2_dem == undefined)
                            case4_value2_dem = 0;
                        var case4_value3_dem = $scope.FinalEnteredVal['cvwppxdbycu'];
                        if (case4_value3_dem == undefined)
                            case4_value3_dem = 0;
                        var case4 = (Math.round(((case4_value1_num + case4_value2_num + case4_value3_num) / (case4_value1_dem + case4_value2_dem + case4_value3_dem)) * 100)).toString();

                        var case5 = $scope.FinalEnteredVal['Z3jhwUgahdh'];
                        var case1_load, case1_val, case1_point,
                            case2_load, case2_val, case2_point,
                            case3_Load, case3_val, case3_point,
                            case4_Load, case4_val, case4_point,
                            case5_Load, case5_val, case5_point;
                        ///case 1
                        if (case1 == undefined || case1 == "NAN" || case1 == "NaN" || case1 == "Infinity") {
                            case1_load = 0;
                            case1_val = 0;
                            case1_point = 0;

                        }
                        else {
                            if (case1 >= 1 && case1 <= 300) {
                                case1_load = "<300";
                                case1_val = case1;
                                case1_point = "2.5";
                            }
                            else if (case1 >= 301 && case1 <= 375) {
                                case1_load = "301 to 375";
                                case1_val = case1;
                                case1_point = "5";
                            }
                            else if (case1 >= 376 && case1 <= 450) {
                                case1_load = "376 to 450";
                                case1_val = case1;
                                case1_point = "7.5";
                            }
                            else if (case1 >= 451) {
                                case1_load = ">450";
                                case1_val = case1;
                                case1_point = "10";
                            }
                            else {
                                case1_load = "0";
                                case1_val = case1;
                                case1_point = "0";
                            }

                        }


                        ///////////case 2
                        if (case2 == undefined || case2 == "NAN" || case2 == "NaN" || case2 == "Infinity") {
                            case2_load = 0;
                            case2_val = 0;
                            case2_point = 0;
                        }
                        else {
                            if (case2 != undefined) {
                                if (case2 >= 1 && case2 <= 2) {
                                    case2_load = "<2";
                                    case2_val = case2;
                                    case2_point = "2.5";
                                }
                                else if (case2 >= 3 && case2 <= 5) {
                                    case2_load = "2 to 5";
                                    case2_val = case2;
                                    case2_point = "5";
                                }
                                else if (case2 >= 6 && case2 <= 10) {
                                    case2_load = "6 to 10";
                                    case2_val = case2;
                                    case2_point = "7.5";
                                }
                                else if (case2 >= 11) {
                                    case2_load = ">10";
                                    case2_val = case2;
                                    case2_point = "10";
                                }
                                else {
                                    case2_load = "0";
                                    case2_val = case2;
                                    case2_point = "0";
                                }
                            }
                        }
                        /////case 3

                        if (case3 == undefined || case3 == "NAN" || case3 == "NaN" || case3 == "Infinity") {
                            case3_Load = 0;
                            case3_val = 0;
                            case3_point = 0;
                        }
                        else {
                            if (case3 != undefined) {
                                if (case3 >= 1 && case3 <= 25) {
                                    case3_Load = "Upto 25%";
                                    case3_val = case3;
                                    case3_point = "2.5";
                                }
                                else if (case3 >= 26 && case3 <= 50) {
                                    case3_Load = "25% to 50%";
                                    case3_val = case3;
                                    case3_point = "5";
                                }
                                else if (case3 >= 51 && case3 <= 75) {
                                    case3_Load = "50% to 75%";
                                    case3_val = case3;
                                    case3_point = "7.5";
                                }
                                else if (case3 >= 76 && case3 <= 100) {
                                    case3_Load = "75% to 100%";
                                    case3_val = case3;
                                    case3_point = "10";
                                }
                                else if (case3 > 100) {
                                    case3_Load = "75% to 100%";
                                    case3_val = case3;
                                    case3_point = "10";
                                }
                                else if (case3 === "NaN") {
                                    case3_Load = "0";
                                    case3_val = "0";
                                    case3_point = "0";
                                }
                                else {
                                    case3_Load = "0";
                                    case3_val = case3;
                                    case3_point = "0";
                                }
                            }
                        }



                        //case 4
                        if (case4 == undefined || case4 == "NAN" || case4 == "NaN" || case4 == "Infinity") {
                            case4_Load = 0;
                            case4_val = 0;
                            case4_point = 0;
                        }
                        else {
                            if (case4 != undefined) {
                                if (case4 > 1 && case4 <= 25) {
                                    case4_Load = "upto 25% ";
                                    case4_val = case4;
                                    case4_point = "1.25";
                                }
                                else if (case4 >= 26 && case4 <= 50) {
                                    case4_Load = "25 to 50";
                                    case4_val = case4;
                                    case4_point = "2.5";
                                }
                                else if (case4 >= 51 && case4 <= 75) {
                                    case4_Load = "50% to 75%";
                                    case4_val = case4;
                                    case4_point = "3.75";
                                }
                                else if (case4 >= 76 && case4 <= 100) {
                                    case4_Load = ">100%";
                                    case4_val = case4;
                                    case4_point = "5";
                                }
                                else if (case4 === "NaN") {
                                    case4_Load = "0";
                                    case4_val = "0";
                                    case4_point = "0";
                                }
                                else {
                                    case4_Load = "0";
                                    case4_val = case4;
                                    case4_point = "0";
                                }
                            }
                        }


                        //case 5
                        if (case5 == undefined || case5 == 0 || case5 == "NAN" || case5 == "NaN" || case5 == "Infinity") {
                            case5_Load = "no", case5_val = 0, case5_point = 0;
                        }
                        else {
                            if (case5 != undefined) {
                                case5_Load = "yes", case5_val = case5, case5_point = "5";
                            }
                        }


                        $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point) + Number(case5_point)).toFixed(2);
                        var percen = 0;
                        if ($scope.total > 0 && $scope.total <= 10)
                            percen = "-20%"
                        if ($scope.total >= 11 && $scope.total <= 20)
                            percen = "50%"
                        if ($scope.total >= 21 && $scope.total <= 30)
                            percen = "75%"
                        if ($scope.total >= 31 && $scope.total <= 40)
                            percen = "100%"
                        if ($scope.total == "")
                            percen = ""

                        $scope.dataimport = $(
                            "<tr>" +
                            "<th>" + $scope.neweventval.length + "</th>"+
                            "<th></th>" +
                            "<th>" + org + "</th>" +
                            "<th>" + specialist_name + "</th>" +

                            "<th>" + case1_load + "</th>" +
                            "<th>" + case1_val + "</th>" +
                            "<th>" + case1_point + "</th>" +

                            "<th>" + case2_load + "</th>" +
                            "<th>" + case2_val + "</th>" +
                            "<th>" + case2_point + "</th>" +

                            "<th>" + case3_Load + "</th>" +
                            "<th>" + case3_val + "</th>" +
                            "<th>" + case3_point + "</th>" +

                            "<th>" + case4_Load + "</th>" +
                            "<th>" + case4_val + "</th>" +
                            "<th>" + case4_point + "</th>" +

                            "<th>" + case5_Load + "</th>" +
                            "<th>" + case5_val + "</th>" +
                            "<th>" + case5_point + "</th>" +

                            "<th>" + $scope.total + "</th>" +
                            "<th>" + percen + "</th>" +

                            "</tr>"

                        )
                        $("#showdata").append($scope.dataimport);
                        if (checkeddata == true) {
                            var tdd = $scope.dataimport[0].cells
                            for (i = 0; i < tdd.length; i++)
                                tdd[i].id = 'table-row'
                        }
                    }
                    $scope.neweventval = [];



                }


                $scope.duplicateval = $scope.duplicateval.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });


                $scope.final_keyspresent = []
                for (var k in $scope.keyspresent) {
                    $scope.keyspresent_val.push($scope.keyspresent[k]);
                }
                $scope.keyspresent_val = $scope.keyspresent_val.sort();

                var hhhh = [];

                for (var k = 0; k < $scope.duplicateval.length; k++) {
                    for (var jj = $scope.keyspresent_val.length - 1; jj >= 0; jj--) {
                        if ($scope.duplicateval[k] == $scope.keyspresent_val[jj]) {
                            $scope.keyspresent_val.splice(jj, 1);

                        }

                    }

                }



                $scope.final_singleval = []
                for (var x in $scope.keyspresent) {
                    for (var y = 0; y < $scope.keyspresent_val.length; y++) {
                        if ($scope.keyspresent_val[y] == $scope.keyspresent[x]) {
                            var val = x.split('-');
                            $scope.final_singleval.push(val[0]);
                        }
                    }

                }





                $scope.eventDeWiseValueMap_final = []

                for (var y = 0; y < $scope.final_singleval.length; y++) {
                    for (var x in $scope.eventDeWiseValueMap) {

                        var v = x.includes($scope.final_singleval[y]);
                        if (v) {
                            $scope.eventDeWiseValueMap_final[x] = $scope.eventDeWiseValueMap[x];
                        }

                    }
                }




                for (var i = 0; i < $scope.final_singleval.length; i++) {

                    var checkeddata = checkInactiveData($scope.final_singleval[i])
                    for (var j in $scope.eventDeWiseValueMap_final) {

                        var new_uid = j.split('-');

                        if ($scope.final_singleval[i] == new_uid[0]) {
                            count++

                            var specialist_name = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'docname'];
                            var org = getheirarchy($scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'orgunitid']);

                            var case1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'hTXa7qrYv3u'];
                            var case2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'vhG2gN7KaEK'];

                            var case3_value1 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'zXdqhofvW2r'];
                            if (case3_value1 == undefined)
                                case3_value1 = 0;

                            var case3_value2 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'ZZleevtpH87'];
                            if (case3_value2 == undefined)
                                case3_value2 = 0;

                            var case3 = (Math.round((case3_value1 / case3_value2) * 100)).toString();


                            var case4_value1_num = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'yQELYdrwRXg'];
                            if (case4_value1_num == undefined)
                                case4_value1_num = 0;
                            var case4_value2_num = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'jBlJz2IMl1S'];
                            if (case4_value2_num == undefined)
                                case4_value2_num = 0;
                            var case4_value3_num = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'DZMhZgqgKJa'];
                            if (case4_value3_num == undefined)
                                case4_value3_num = 0;
                            var case4_value1_dem = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'o1CRenXyXWt'];
                            if (case4_value1_dem == undefined)
                                case4_value1_dem = 0;
                            var case4_value2_dem = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'dq0j1v6wMhZ'];
                            if (case4_value2_dem == undefined)
                                case4_value2_dem = 0;
                            var case4_value3_dem = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'cvwppxdbycu'];
                            if (case4_value3_dem == undefined)
                                case4_value3_dem = 0;

                            var case4 = (Math.round(((case4_value1_num + case4_value2_num + case4_value3_num) / (case4_value1_dem + case4_value2_dem + case4_value3_dem)) * 100)).toString();

                            var case5 = $scope.eventDeWiseValueMap_final[$scope.final_singleval[i] + '-' + 'Z3jhwUgahdh'];
                            var case1_load, case1_val, case1_point,
                                case2_load, case2_val, case2_point,
                                case3_Load, case3_val, case3_point,
                                case4_Load, case4_val, case4_point,
                                case5_Load, case5_val, case5_point;
                            ///case 1
                            if (case1 == undefined || case1 == "NAN" || case1 == "NaN" || case1 == "Infinity") {
                                case1_load = 0;
                                case1_val = 0;
                                case1_point = 0;

                            }
                            else {
                                if (case1 >= 1 && case1 <= 300) {
                                    case1_load = "<300";
                                    case1_val = case1;
                                    case1_point = "2.5";
                                }
                                else if (case1 >= 301 && case1 <= 375) {
                                    case1_load = "301 to 375";
                                    case1_val = case1;
                                    case1_point = "5";
                                }
                                else if (case1 >= 376 && case1 <= 450) {
                                    case1_load = "376 to 450";
                                    case1_val = case1;
                                    case1_point = "7.5";
                                }
                                else if (case1 >= 451) {
                                    case1_load = ">450";
                                    case1_val = case1;
                                    case1_point = "10";
                                }
                                else {
                                    case1_load = "0";
                                    case1_val = case1;
                                    case1_point = "0";
                                }
                            }


                            ///////////case 2
                            if (case2 == undefined || case2 == "NAN" || case2 == "NaN" || case2 == "Infinity") {
                                case2_load = 0;
                                case2_val = 0;
                                case2_point = 0;
                            }
                            else {
                                if (case2 != undefined) {
                                    if (case2 >= 1 && case2 <= 2) {
                                        case2_load = "<2";
                                        case2_val = case2;
                                        case2_point = "2.5";
                                    }
                                    else if (case2 >= 3 && case2 <= 5) {
                                        case2_load = "2 to 5";
                                        case2_val = case2;
                                        case2_point = "5";
                                    }
                                    else if (case2 >= 6 && case2 <= 10) {
                                        case2_load = "6 to 10";
                                        case2_val = case2;
                                        case2_point = "7.5";
                                    }
                                    else if (case2 >= 11) {
                                        case2_load = ">10";
                                        case2_val = case2;
                                        case2_point = "10";
                                    }
                                    else {
                                        case2_load = "0";
                                        case2_val = case2;
                                        case2_point = "0";
                                    }
                                }
                            }
                            /////case 3

                            if (case3 == undefined || case3 == "NAN" || case3 == "NaN" || case3 == "Infinity") {
                                case3_Load = 0;
                                case3_val = 0;
                                case3_point = 0;
                            }
                            else {
                                if (case3 != undefined) {
                                    if (case3 > 1 && case3 <= 25) {
                                        case3_Load = "Upto 25%";
                                        case3_val = case3;
                                        case3_point = "2.5";
                                    }
                                    else if (case3 >= 26 && case3 <= 50) {
                                        case3_Load = "25% to 50%";
                                        case3_val = case3;
                                        case3_point = "5";
                                    }
                                    else if (case3 >= 51 && case3 <= 75) {
                                        case3_Load = "50% to 75%";
                                        case3_val = case3;
                                        case3_point = "7.5";
                                    }
                                    else if (case3 >= 76 && case3 <= 100) {
                                        case3_Load = "75% to 100%";
                                        case3_val = case3;
                                        case3_point = "10";
                                    }
                                    else if (case3 > 100) {
                                        case3_Load = "75% to 100%";
                                        case3_val = case3;
                                        case3_point = "10";
                                    }
                                    else {
                                        case3_Load = "0";
                                        case3_val = case3;
                                        case3_point = "0";
                                    }
                                }
                            }



                            //case 4
                            if (case4 == undefined || case4 == "NAN" || case4 == "NaN" || case4 == "Infinity") {
                                case4_Load = 0;
                                case4_val = 0;
                                case4_point = 0;
                            }
                            else {
                                if (case4 != undefined) {
                                    if (case4 > 1 && case4 <= 25) {
                                        case4_Load = "upto 25% ";
                                        case4_val = case4;
                                        case4_point = "1.25";
                                    }
                                    else if (case4 >= 26 && case4 <= 50) {
                                        case4_Load = "25 to 50";
                                        case4_val = case4;
                                        case4_point = "2.5";
                                    }
                                    else if (case4 >= 51 && case4 <= 75) {
                                        case4_Load = "50% to 75%";
                                        case4_val = case4;
                                        case4_point = "3.75";
                                    }
                                    else if (case4 >= 76 && case4 <= 100) {
                                        case4_Load = ">100%";
                                        case4_val = case4;
                                        case4_point = "5";
                                    }
                                    else {
                                        case4_Load = "0";
                                        case4_val = case4;
                                        case4_point = "0";
                                    }
                                }
                            }


                            //case 5
                            if (case5 == undefined || case5 == 0 || case5 == "NAN" || case5 == "NaN" || case5 == "Infinity") {
                                case5_Load = "no", case5_val = 0, case5_point = 0;
                            }
                            else {
                                if (case5 != undefined) {
                                    case5_Load = "yes", case5_val = case5, case5_point = "5";
                                }
                            }


                            $scope.total = (Number(case1_point) + Number(case2_point) + Number(case3_point) + Number(case4_point) + Number(case5_point)).toFixed(2);
                            var percen = 0;
                            if ($scope.total > 0 && $scope.total <= 10)
                                percen = "-20%"
                            if ($scope.total >= 11 && $scope.total <= 20)
                                percen = "50%"
                            if ($scope.total >= 21 && $scope.total <= 30)
                                percen = "75%"
                            if ($scope.total >= 31 && $scope.total <= 40)
                                percen = "100%"
                            if ($scope.total == "")
                                percen = ""

                            $scope.dataimport = $(
                                "<tr>" +
                                "<th></th>" +
                                "<th></th>" +
                                "<th>" + org + "</th>" +

                                "<th>" + specialist_name + "</th>" +

                                "<th>" + case1_load + "</th>" +
                                "<th>" + case1_val + "</th>" +
                                "<th>" + case1_point + "</th>" +

                                "<th>" + case2_load + "</th>" +
                                "<th>" + case2_val + "</th>" +
                                "<th>" + case2_point + "</th>" +

                                "<th>" + case3_Load + "</th>" +
                                "<th>" + case3_val + "</th>" +
                                "<th>" + case3_point + "</th>" +

                                "<th>" + case4_Load + "</th>" +
                                "<th>" + case4_val + "</th>" +
                                "<th>" + case4_point + "</th>" +

                                "<th>" + case5_Load + "</th>" +
                                "<th>" + case5_val + "</th>" +
                                "<th>" + case5_point + "</th>" +

                                "<th>" + $scope.total + "</th>" +
                                "<th>" + percen + "</th>" +

                                "</tr>"

                            )


                        }


                    }
                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                }
                var returnteiuid = checkteiuid($scope.eventDeWiseValueMap, programname, $scope.ALLregisteredDoc_name_Paediatric)
                if (returnteiuid[0].length != 0) {
                    for (var x = 0; x < returnteiuid[0].length; x++) {
                        var org = getheirarchy($scope.ALLregisteredDoc_name_Paediatric[returnteiuid[0][x]].ouid);
                        var specialist_name = $scope.ALLregisteredDoc_name_Paediatric[returnteiuid[0][x]].name;
                        var empty = "";
                         var lastupdate_date = '';
                                var checkeddata = checkInactiveData(returnteiuid[0][x])                       
                                if (checkeddata == "true") {
                                    lastupdate_date = $scope.ALLregisteredDoc_name_Paediatric[returnteiuid[0][x]].lastupdate;
                                }
                            

                        $scope.dataimport = $(
                            "<tr>" +
                            "<th></th>" +
                            "<th>" + lastupdate_date + "</th>" +
                            "<th>" + org + "</th>" +
                            "<th>" + specialist_name + "</th>" +

                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +

                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +

                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +

                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +

                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +
                            "<th>" + empty + "</th>" +

                            "<th>" + empty + "</th>" +


                            "</tr>"

                        )
                        $("#showdata").append($scope.dataimport);
                        if (checkeddata == 'true') {
                            var tdd = $scope.dataimport[0].cells
                            for (i = 0; i < tdd.length; i++)
                                tdd[i].id = 'table-row'
                        }
                    }
                }


                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            ///Paediatric - PBR monitoring
            //'idDnTQcDA3o',	'OZUfNtngt0T',	'ZmlLbYwR1Zm',	'Z3jhwUgahdh',	'C1Hr5tSOFhO',	'wmoYsnIYwXp',	'zXdqhofvW2r',	'PTDWef0EKBH',	'ZZleevtpH87',	'yQELYdrwRXg',	'jBlJz2IMl1S',	'DZMhZgqgKJa',	'fmgq14VGiJ8',	'hTXa7qrYv3u',	'CCNnr8s3rgE',	'o1CRenXyXWt',	'dq0j1v6wMhZ',	'cvwppxdbycu',

            if (programname == "Paediatric - PBR monitoring" && new_psuid == "PfRIIrvnjcU") {
                var count = 0; $scope.dataimport = $();
                for (var i = 0; i < $scope.eventList.length; i++) {
                    var checkeddata = checkInactiveData($scope.eventList[i])

                    for (var j in $scope.eventDeWiseValueMap) {

                        var new_uid = j.split('-');
                        if ($scope.eventList[i] == new_uid[0]) {
                            count++

                            var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                            var specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];
                            var org = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);

                            var case1 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'hTXa7qrYv3u'];
                            var case2 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'wmoYsnIYwXp'];

                            var case3_value1 = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'zXdqhofvW2r']);
                            if (case3_value1 == undefined)
                                case3_value1 = 0;

                            var case3_value2 = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'ZZleevtpH87']);
                            if (case3_value2 == undefined)
                                case3_value2 = 0;

                            var case3 = (Math.round((case3_value1 / case3_value2) * 100)).toString();


                            var case4_value1_num = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'yQELYdrwRXg']);
                            if (case4_value1_num == undefined)
                                case4_value1_num = 0;
                            var case4_value2_num = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'jBlJz2IMl1S']);
                            if (case4_value2_num == undefined)
                                case4_value2_num = 0;
                            var case4_value3_num = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'DZMhZgqgKJa'])
                            if (case4_value3_num == undefined)
                                case4_value3_num = 0;
                            var case4_value1_dem = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'o1CRenXyXWt']);
                            if (case4_value1_dem == undefined)
                                case4_value1_dem = 0;
                            var case4_value2_dem = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'dq0j1v6wMhZ']);
                            if (case4_value2_dem == undefined)
                                case4_value2_dem = 0;
                            var case4_value3_dem = Number($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'cvwppxdbycu']);
                            if (case4_value3_dem == undefined)
                                case4_value3_dem = 0;
                            var case4 = (Math.round(((case4_value1_num + case4_value2_num + case4_value3_num) / (case4_value1_dem + case4_value2_dem + case4_value3_dem)) * 100)).toString();

                            var case5 = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'Z3jhwUgahdh'];
                            var case1_val, case2_val, case3_val, case4_val, case5_val;
                            ///case 1
                            if (case1 == undefined || case1 == "NAN" || case1 == "NaN") {
                                case1_val = 0;
                            }
                            else {
                                case1_val = case1;
                            }


                            ///////////case 2
                            if (case2 == undefined || case2 == "NAN" || case2 == "NaN") {
                                case2_val = 0;
                            }
                            else {
                                case2_val = case2;

                            }


                            /////case 3
                            if (case3 == undefined || case3 == "NAN" || case3 == "NaN") {
                                case3_val = 0;
                            }
                            else {
                                case3_val = case3;
                            }



                            //case 4
                            if (case4 == undefined || case4 == "NAN" || case4 == "NaN") {
                                case4_val = 0;
                            }
                            else {
                                case4_val = case4;
                            }

                            //case 5
                            if (case5 == undefined || case5 == "NAN" || case5 == "NaN") {
                                case5_val = 0;
                            }
                            else {
                                case5_val = case5
                            }
                        }
                        if (case5_val == 0) {
                            $scope.dataimport = $(
                                "<tr>" +
                                "<th >" + event_date + "</th>" +
                                "<th >" + org + "</th>" +
                                "<th >" + specialist_name + "</th>" +
                                "<th >" + case1_val + "</th>" +
                                "<th >" + case2_val + "</th>" +
                                "<th >" + case3_val + "</th>" +
                                "<th >" + case4_val + "</th>" +
                                "<th >" + case5_val + "</th>" +
                                "</tr>"

                            )
                        }
                        else
                            $scope.dataimport = $(
                                "<tr>" +
                                "<th style='background-color:pink'>" + event_date + "</th>" +
                                "<th style='background-color:pink'>" + org + "</th>" +
                                "<th style='background-color:pink'>" + specialist_name + "</th>" +
                                "<th style='background-color:pink'>" + case1_val + "</th>" +
                                "<th style='background-color:pink'>" + case2_val + "</th>" +
                                "<th style='background-color:pink'>" + case3_val + "</th>" +
                                "<th style='background-color:pink'>" + case4_val + "</th>" +
                                "<th style='background-color:pink'>" + case5_val + "</th>" +
                                "</tr>"

                            )
                    }

                    $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }


                }
                document.getElementById("loader").style.display = "none";
                if (count == 0) {
                    document.getElementById("divId").style.display = "none";
                    document.getElementById("showdiv").style.display = "block";
                }
                else {
                    document.getElementById("divId").style.display = "block";
                    document.getElementById("showdiv").style.display = "none";

                }
            }

            ///Paediatric Anaesthetist Gynaecologist- Remark Report
            var dfd = $.Deferred(),  // Master deferred
                dfdNext = dfd; // Next deferred in the chain

            if (programname == "Paediatric Remarks Report" && new_psuid == "PfRIIrvnjcU" || $scope.programname == "Anaesthetist Remarks Report" || $scope.programname == "Gynaecologist Remarks Report") {
                for (var i = 0; i < $scope.eventList.length; i++) {
                    var organisation = [];
                    for (var j in $scope.eventDeWiseValueMap) {
                        var new_uid = j.split('-');
                        if ($scope.eventList[i] == new_uid[0]) {


                            var orgheirarchy = getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'orgunitid']);


                            $.when(orgheirarchy).then(function (res) {

                                $scope.contact_number = getcontactnumber($scope.eventList[i]);
                                var event_date = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'eventDate'];
                                var Remark = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'PTDWef0EKBH'];
                                var Challenges_faced = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'C1Hr5tSOFhO'];
                                $scope.specialist_name = $scope.eventDeWiseValueMap[$scope.eventList[i] + '-' + 'docname'];

                                if (Remark == undefined) {
                                    Remark = ""
                                }
                                if (Challenges_faced == undefined) {
                                    Challenges_faced = ""
                                }
                                if (Challenges_faced == undefined) {
                                    contact_number = ""
                                }

                                finalvalue(event_date, orgheirarchy, $scope.specialist_name, Remark, Challenges_faced, $scope.contact_number);




                            });

                        }
                    } $("#showdata").append($scope.dataimport);
                    if (checkeddata == true) {
                        var tdd = $scope.dataimport[0].cells
                        for (i = 0; i < tdd.length; i++)
                            tdd[i].id = 'table-row'
                    }
                    document.getElementById("loader").style.display = "none";
                }
            }

        }



        getcontactnumber = function (uid) {
            var contact = $scope.allContactNo[uid]
            if (contact == undefined)
                contact = "";
            return contact
        }

        finalvalue = function (event_date, orgheirarchy, specialist_name, Remark, Challenges_faced, contact_number) {
            $scope.dataimport = $(
                "<tr>" +
                "<th>" + event_date + "</th>" +
                "<th>" + orgheirarchy + "</th>" +
                "<th>" + specialist_name + "</th>" +
                "<th>" + contact_number + "</th>" +
                "<th>" + Challenges_faced + "</th>" +
                "<th>" + Remark + "</th>" +

                "</tr>"

            )



        }

        checkteiuid = function (eventDeWiseValueMap, programname, ALLregisteredDoc_name) {
            $scope.tei_uid = []
            for (var y in eventDeWiseValueMap) {
                if (y.includes('teiid')) {
                    $scope.tei_uid[eventDeWiseValueMap[y]] = "true";

                }
            }
            $scope.final_sp_uid = []
            var obj = []

            var regobj = Object.keys(ALLregisteredDoc_name)
            for (var i = 0; i < regobj.length; i++) {
                if ($scope.tei_uid[regobj[i]] != "true") {

                    obj.push(regobj[i])
                }

            }
            $scope.final_sp_uid.push(obj)

            var obj = []




            return $scope.final_sp_uid

        }
        getheirarchy = function (org) {
            $scope.hierarchy = $scope.orgunitheirarchy[org]
            return $scope.hierarchy;

        }

        getFinalvalue = function (eventDeWiseValueMap, neweventval, programname) {
            $scope.value_entered = [];
            $scope.Final_value_entered = [];
            var count = 0;
            var val1 = 0, val2 = 0, val3 = 0, val4 = 0, val5 = 0, val6 = 0, val7 = 0, val8 = 0, val9 = 0, val10 = 0, val11 = 0, specialistname, orgunit, orgunitid, docname;
            for (var y = 0; y < neweventval.length; y++) {
                for (var x in eventDeWiseValueMap) {

                    if (x.includes(neweventval[y])) {

                        $scope.value_entered[x] = eventDeWiseValueMap[x];
                        $scope.eventDeWiseValueMap.splice(x, 1);
                    }
                }
            }

            if (programname == "Anaesthetist - PBR monitoring(Aggregated)" || programname == "Anaesthetist - PBR monitoring(under CMO(Aggregated))" || programname == "Anaesthetist - PBR monitoring(under CMS(Aggregated))") {
                for (var i = 0; i < neweventval.length; i++) {
                    var case1 = $scope.value_entered[neweventval[i] + "-" + "qbgFsR4VWxU"];
                    var case2 = $scope.value_entered[neweventval[i] + "-" + "vhG2gN7KaEK"];
                    var case3 = $scope.value_entered[neweventval[i] + "-" + "zfMOVN2lc1S"];

                    if (case1 != undefined) {
                        val1 += Number(case1);
                    }
                    if (case2 != undefined) {
                        val2 += Number(case2);
                    }
                    if (case3 != undefined) {
                        val3 += Number(case3);
                    }
                    if (case1 == undefined && case2 == undefined && case3 == undefined) {
                        count++;
                    }
                    orgunit = $scope.value_entered[neweventval[i] + "-" + "orgUnit"];
                    orgunitid = $scope.value_entered[neweventval[i] + "-" + "orgunitid"];
                    docname = $scope.value_entered[neweventval[i] + "-" + "docname"];
                    eventuid = neweventval[i]
                }
                $scope.Final_value_entered["qbgFsR4VWxU"] = val1;
                $scope.Final_value_entered["vhG2gN7KaEK"] = val2;
                $scope.Final_value_entered["zfMOVN2lc1S"] = val3;
                $scope.Final_value_entered["orgunit"] = orgunit;
                $scope.Final_value_entered["orgunitid"] = orgunitid
                $scope.Final_value_entered["docname"] = docname
                $scope.Final_value_entered["count"] = count
                $scope.Final_value_entered["eventuid"] = eventuid
            }




            if (programname == "Gynaecologist - PBR monitoring(Aggregated)" || programname == "Gynaecologist - PBR monitoring(under CMO(Aggregated))" || programname == "Gynaecologist - PBR monitoring(under CMS(Aggregated))") {


                for (var i = 0; i < neweventval.length; i++) {
                    var case1 = $scope.value_entered[neweventval[i] + "-" + "kChiZJPd5je"];
                    var case2 = $scope.value_entered[neweventval[i] + "-" + "wTdcUXWeqhN"];
                    var case3 = $scope.value_entered[neweventval[i] + "-" + "eryy31EUorR"];
                    var case4 = $scope.value_entered[neweventval[i] + "-" + "cqw0HGZQzhD"];

                    if (case1 != undefined) {
                        val1 += Number(case1);
                    }
                    if (case2 != undefined) {
                        val2 += Number(case2);
                    }
                    if (case3 != undefined) {
                        val3 += Number(case3);
                    }
                    if (case4 != undefined) {
                        val4 += Number(case4);
                    }
                    if (case1 == undefined && case2 == undefined && case3 == undefined && case4 == undefined) {
                        count++;
                    }

                    orgunit = $scope.value_entered[neweventval[i] + "-" + "orgUnit"];
                    orgunitid = $scope.value_entered[neweventval[i] + "-" + "orgunitid"];
                    docname = $scope.value_entered[neweventval[i] + "-" + "docname"];
                    eventuid = neweventval[i]

                }

                $scope.Final_value_entered["kChiZJPd5je"] = val1;
                $scope.Final_value_entered["wTdcUXWeqhN"] = val2;
                $scope.Final_value_entered["eryy31EUorR"] = val3;
                $scope.Final_value_entered["cqw0HGZQzhD"] = val4;
                $scope.Final_value_entered["orgunit"] = orgunit;
                $scope.Final_value_entered["orgunitid"] = orgunitid
                $scope.Final_value_entered["docname"] = docname
                $scope.Final_value_entered["count"] = count
                $scope.Final_value_entered["eventuid"] = eventuid
            }



            if (programname == "Paediatric - PBR monitoring(Aggregated)") {

                for (var i = 0; i < neweventval.length; i++) {
                    var case1 = $scope.value_entered[neweventval[i] + "-" + "hTXa7qrYv3u"];
                    var case2 = $scope.value_entered[neweventval[i] + "-" + "wmoYsnIYwXp"];
                    var case3 = $scope.value_entered[neweventval[i] + "-" + "zXdqhofvW2r"];
                    var case4 = $scope.value_entered[neweventval[i] + "-" + "ZZleevtpH87"];
                    var case5 = $scope.value_entered[neweventval[i] + "-" + "yQELYdrwRXg"];
                    var case6 = $scope.value_entered[neweventval[i] + "-" + "jBlJz2IMl1S"];
                    var case7 = $scope.value_entered[neweventval[i] + "-" + "DZMhZgqgKJa"];
                    var case8 = $scope.value_entered[neweventval[i] + "-" + "o1CRenXyXWt"];
                    var case9 = $scope.value_entered[neweventval[i] + "-" + "dq0j1v6wMhZ"];
                    var case10 = $scope.value_entered[neweventval[i] + "-" + "cvwppxdbycu"];
                    var case11 = $scope.value_entered[neweventval[i] + "-" + "Z3jhwUgahdh"];

                    if (case1 != undefined) {
                        val1 += Number(case1);
                    }
                    if (case2 != undefined) {
                        val2 += Number(case2);
                    }
                    if (case3 != undefined) {
                        val3 += Number(case3);
                    }
                    if (case4 != undefined) {
                        val4 += Number(case4);
                    }
                    if (case5 != undefined) {
                        val5 += Number(case5);
                    }
                    if (case6 != undefined) {
                        val6 += Number(case6);
                    }
                    if (case7 != undefined) {
                        val7 += Number(case7);
                    }
                    if (case8 != undefined) {
                        val8 += Number(case8);
                    }
                    if (case9 != undefined) {
                        val9 += Number(case9);
                    }
                    if (case10 != undefined) {
                        val10 += Number(case10);
                    }
                    if (case11 != undefined) {
                        val11 += Number(case11);
                    }
                    if (case1 == undefined && case2 == undefined && case3 == undefined && case4 == undefined && case5 == undefined && case6 == undefined && case7 == undefined && case8 == undefined && case9 == undefined && case10 == undefined && case11 == undefined) {
                        count++;
                    }

                    orgunit = $scope.value_entered[neweventval[i] + "-" + "orgUnit"];
                    orgunitid = $scope.value_entered[neweventval[i] + "-" + "orgunitid"];
                    docname = $scope.value_entered[neweventval[i] + "-" + "docname"];
                    eventuid = neweventval[i]


                }
                $scope.Final_value_entered["hTXa7qrYv3u"] = val1;
                $scope.Final_value_entered["vhG2gN7KaEK"] = val2;
                $scope.Final_value_entered["zXdqhofvW2r"] = val3;
                $scope.Final_value_entered["ZZleevtpH87"] = val4;
                $scope.Final_value_entered["yQELYdrwRXg"] = val5;
                $scope.Final_value_entered["jBlJz2IMl1S"] = val6;
                $scope.Final_value_entered["DZMhZgqgKJa"] = val7;
                $scope.Final_value_entered["o1CRenXyXWt"] = val8;
                $scope.Final_value_entered["dq0j1v6wMhZ"] = val9;
                $scope.Final_value_entered["cvwppxdbycu"] = val10;
                $scope.Final_value_entered["Z3jhwUgahdh"] = val11;
                $scope.Final_value_entered["orgunit"] = orgunit;
                $scope.Final_value_entered["orgunitid"] = orgunitid
                $scope.Final_value_entered["docname"] = docname
                $scope.Final_value_entered["eventuid"] = eventuid
            }






            return $scope.Final_value_entered;

        }
        function checkorgunit(orgUnitid, programname) {

            var value;
            if (programname == "Anaesthetist - PBR monitoring(under CMO(Aggregated))" || programname == "Gynaecologist - PBR monitoring(under CMO(Aggregated))" || programname == "Anaesthetist - PBR monitoring(under CMO)" || programname == "Gynaecologist - PBR monitoring(under CMO)")
                value = $scope.orgunit_CMO[orgUnitid];

            if (programname == "Anaesthetist - PBR monitoring(under CMS(Aggregated))" || programname == "Gynaecologist - PBR monitoring(under CMS(Aggregated))" || programname == "Anaesthetist - PBR monitoring(under CMS)" || programname == "Gynaecologist - PBR monitoring(under CMS)")
                value = $scope.orgunit_CMS[orgUnitid];

            if (value == undefined)
                value = "false"

            return value

        }


        function checkInactiveData(eventuid) {

            return $scope.inactivedata[eventuid]

        }


    });