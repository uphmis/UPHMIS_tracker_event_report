/**
 * Created by hisp on 2/12/15.
 */

var trackerReportsAppServices = angular.module('trackerReportsAppServices', [])
    .service('MetadataService',function(){
       return {
           getOrgUnit : function(id){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   async: false,
                   contentType: "application/json",
                   url: '../../organisationUnits/'+id+".json?fields=id,name,level,programs[id,name,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[options[code,displayName]]],sortOrder]]]&paging=false",
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           },
           filterCMO_CMS : function(uid){
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                contentType: "application/json",
                url: '../../organisationUnitGroups/'+uid+'.json?fields=organisationUnits[id]',
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
        getALLAttributes : function(){
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: '../../trackedEntityAttributes.json?fields=id,name,attributeValues[*,attribute[id,name,code]]&paging=false',
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
           getAllPrograms : function () {
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   async: false,
                   contentType: "application/json",
                   url: '../../programs.json?fields=id,name,withoutRegistration,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[options[code,displayName]],sortOrder]]]&paging=false',
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           },
           getheirarchyname : function(param){
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                async: false,
                dataType: "json",
                contentType: "application/json",
                url: "../../organisationUnits/"+param+".json?fields=name,level,parent[name,level,parent[id,name,level,parent[name,level,parent[name,level,parent[name,level,parent[name,level,parent[name,level,parent[name,level]]]]]",
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
        getheirarchynameprac : function(param){
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                async: false,
                dataType: "json",
                contentType: "application/json",
                url: "../../organisationUnits/"+param+".json?fields=path&paging=False",
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
           getSQLView : function(sqlViewUID,param){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   async: false,
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../sqlViews/'+sqlViewUID+"/data?"+param+"&paging=False",
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           },
           getSQLViewData : function(sqlViewUID){
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                async: false,
                dataType: "json",
                contentType: "application/json",
                url: '../../sqlViews/'+sqlViewUID+"/data?&paging=False",
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },


           getEnrollmentsBetweenDateProgramAndOu : function(ou,prog,start,end){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   async: false,
                   contentType: "application/json",
                   url: '../../enrollments.json?ou='+ou+'&ouMode=DESCENDANTS&program='+prog+'&programStartDate='+start+'&programEndDate='+end+'&skipPaging=true',
                   success: function (data) {
                       def.resolve(data);
                   }
               });
               return def;
           }
       }
    }).service('sqlviewservice',  function ($http){
        return {
            getAll: function () {

                var def = $.Deferred();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    async: false,
                    contentType: "application/json",
                    url: '../../sqlViews.json?fields=[id,name]&paging=false',
                    success: function (data) {
                        def.resolve(data);
                    }
                });
                return def;
            }
         
        }
    })