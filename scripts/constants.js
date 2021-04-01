/**
 * Created by harsh on 2/12/16.
 */
const CMO_uid='zn7QglcpZdg',CMS_uid='NPSH96qOxoV' 

const SQLQUERY_TEI_ATTR = "select tei.uid tei ,min(tea.name) attrname,tea.uid attruid,min(teav.value) attrvalue,ou.name,tei.created,pi.enrollmentdate enrolldate from programstageinstance psi INNER JOIN programinstance pi ON  psi.programinstanceid = pi.programinstanceid INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid INNER JOIN trackedentityattribute  tea ON teav.trackedentityattributeid = tea.trackedentityattributeid INNER JOIN programstage ps ON ps.programstageid = psi.programstageid INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid WHERE psi.programstageid IN (select programstageid from programstage where programid IN (select programid from program where uid = '${program}')) and psi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') and pi.enrollmentdate between '${startdate}' and '${enddate}' group by tei.uid,pi.enrollmentdate,tea.uid,ou.name,tei.created order by pi.enrollmentdate,tei.uid";

const SQLQUERY_TEI_ATTR_NAME = "TRACKER_REPORTS_TEI_ATTR_V1";

const SQLQUERY_DTR_ATTR_NAME = "TRACKER_REPORTS_DTR_ATTR_V1";

const SQLQUERY_TEI_DATA_VALUE = "select tei.uid tei,ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,de.uid deuid,min(de.name) dename,min(tedv.value) devalue,ou.name, pi.enrollmentdate enrollDate from programstageinstance psi INNER JOIN programinstance pi ON  psi.programinstanceid = pi.programinstanceid INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid INNER JOIN trackedentitydatavalue tedv ON tedv.programstageinstanceid = psi.programstageinstanceid INNER JOIN dataelement de ON de.dataelementid = tedv.dataelementid INNER JOIN programstage ps ON ps.programstageid = psi.programstageid INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid WHERE psi.programstageid IN (select programstageid from programstage where programid IN (select programid from program where uid = '${program}')) and psi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') and pi.enrollmentdate between '${startdate}' and '${enddate}' group by tei.uid,ps.uid,psi.uid,psi.executiondate,de.uid,ou.name, pi.enrollmentdate order by pi.enrollmentdate,tei.uid,psi.executiondate";

const SQLQUERY_TEI_DATA_VALUE_NAME = "TRACKER_REPORTS_TEI_DATA_VALUE_V1";

const SQLQUERY_DTR_DATA_VALUE_NAME = "TRACKER_REPORTS_DTR_DATA_VALUE_V1";

const SQLQUERY_EVENT= "select ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,de.uid deuid,min(de.name) dename,min(tedv.value) devalue,ou.name, psi.executiondate::DATE,ou.uid,ou.organisationunitid,ou.code,teav.value,tei.uid teiuid ,tei.inactive inactiveval from programstageinstance psi INNER JOIN programinstance pi ON  psi.programinstanceid = pi.programinstanceid INNER JOIN trackedentityinstance tei ON  tei.trackedentityinstanceid = pi.trackedentityinstanceid INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid INNER JOIN trackedentitydatavalue tedv ON tedv.programstageinstanceid = psi.programstageinstanceid INNER JOIN dataelement de ON de.dataelementid = tedv.dataelementid INNER JOIN programstage ps ON ps.programstageid = psi.programstageid INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid WHERE psi.programstageid IN (select programstageid from programstage where programid IN (select programid from program where uid = '${program}')) and psi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') and psi.executiondate between '${startdate}' and '${enddate}' and teav.trackedentityattributeid=38565533 group by ps.uid,psi.uid,psi.executiondate,de.uid,ou.name, psi.executiondate,ou.uid,ou.organisationunitid,ou.code,teav.value,tei.uid,tei.inactive order by psi.executiondate";

const SQLQUERY_EVENT_NAME = "TRACKER_REPORTS_EVENT_V1";

//new queries

const SQLQUERY_UPHMIS_Heirarchy="select ous.organisationunituid as orgunituid,CONCAT (ou2.name,'/',ou3.name,'/',ou4.name ,'/',ou5.name ,'/',ou6.name) as heirarchy from _orgunitstructure ous LEFT join organisationunit ou2 on ou2.organisationunitid = ous.idlevel2 LEFT join organisationunit ou3 on ou3.organisationunitid = ous.idlevel3 LEFT join organisationunit ou4 on ou4.organisationunitid = ous.idlevel4 LEFT join organisationunit ou5 on ou5.organisationunitid = ous.idlevel5 LEFT join organisationunit ou6 on ou6.organisationunitid = ous.idlevel6 group by ous.organisationunituid,ou2.name,ou3.name,ou4.name,ou5.name,ou6.uid,ou6.name;"

const SQLQUERY_UPHMIS_Heirarchy_Name="UPHMIS_Heirarchy"

const SQLQUERY_Get_contactno="SELECT  psi.uid ,teival.value from trackedentityattributevalue teival INNER JOIN programinstance pi on teival.trackedentityinstanceid=pi.trackedentityinstanceid INNER JOIN programstageinstance psi on pi.programinstanceid = psi.programinstanceid where teival.trackedentityattributeid=38565537;"

const Get_contactno_Name="Get_contactno"

const SQLQUERY_GetOrgUnitId="SELECT organisationunitid, uid, name, parentid, hierarchylevel  FROM organisationunit where uid='${orgUnitId}';"

const GetOrgUnitId_Name="GetOrgUnitId"

const SQLQUERY_TRACKER_ALLDOC_CMO="select tei.uid teiuid,teav.value ,ou.uid ouuid,tei.inactive inactiveval, tei.lastupdated::DATE lastupdate  from trackedentityinstance tei INNER JOIN trackedentityattributevalue teav ON teav.trackedentityinstanceid = tei.trackedentityinstanceid INNER JOIN programinstance pi on tei.trackedentityinstanceid = pi.trackedentityinstanceid  Inner JOIN orgunitgroupmembers oum on pi.organisationunitid=oum.organisationunitid INNER JOIN organisationunit ou on ou.organisationunitid = pi.organisationunitid INNER JOIN program prog on prog.programid = pi.programid where teav.trackedentityattributeid=38565533 and oum.orgunitgroupid=55191215 and prog.uid='${programuid}' and  pi.organisationunitid in (Select  organisationunitid FROM organisationunit  where parentid IN ( Select  organisationunitid FROM organisationunit  where parentid IN(Select organisationunitid FROM organisationunit  where parentid IN( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}') ) or organisationunitid In( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}'))or organisationunitid In( Select  organisationunitid FROM organisationunit  where parentid IN (Select organisationunitid FROM organisationunit  where parentid IN( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}')) or organisationunitid In( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}')) );"

const TRACKER_ALLDOC_CMO_Name="TRACKER_ALLDOC_CMO"

const SQLQUERY_TRACKER_ALLDOC_CMS="select tei.uid teiuid,teav.value ,ou.uid ouuid,tei.inactive inactiveval, tei.lastupdated::DATE lastupdate  from trackedentityinstance tei INNER JOIN trackedentityattributevalue teav ON teav.trackedentityinstanceid = tei.trackedentityinstanceid INNER JOIN programinstance pi on tei.trackedentityinstanceid = pi.trackedentityinstanceid Inner JOIN orgunitgroupmembers oum on pi.organisationunitid=oum.organisationunitid INNER JOIN organisationunit ou on ou.organisationunitid = pi.organisationunitid INNER JOIN program prog on prog.programid = pi.programid where teav.trackedentityattributeid=38565533 and oum.orgunitgroupid=55190770 and prog.uid='${programuid}' and  pi.organisationunitid in (Select  organisationunitid FROM organisationunit  where parentid IN ( Select  organisationunitid FROM organisationunit  where parentid IN(Select organisationunitid FROM organisationunit  where parentid IN( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}') ) or organisationunitid In( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}'))or organisationunitid In( Select  organisationunitid FROM organisationunit  where parentid IN (Select organisationunitid FROM organisationunit  where parentid IN( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}')) or organisationunitid In( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgunitid}' or parentid='${orgunitid}')) )"

const TRACKER_ALLDOC_CMS_Name="TRACKER_ALLDOC_CMS"



const SQLView_Init = [
    {
        name : SQLQUERY_TEI_ATTR_NAME,
        query :SQLQUERY_TEI_ATTR,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_TEI_DATA_VALUE_NAME,
        query :SQLQUERY_TEI_DATA_VALUE,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_EVENT_NAME,
        query :SQLQUERY_EVENT,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_UPHMIS_Heirarchy_Name,
        query :SQLQUERY_UPHMIS_Heirarchy,
        desc : "",
        type : "QUERY"
    },
    {
        name : Get_contactno_Name,
        query :SQLQUERY_Get_contactno,
        desc : "",
        type : "QUERY"
    },
    {
        name : GetOrgUnitId_Name,
        query :SQLQUERY_GetOrgUnitId,
        desc : "",
        type : "QUERY"
    },
    {
        name : TRACKER_ALLDOC_CMO_Name,
        query :SQLQUERY_TRACKER_ALLDOC_CMO,
        desc : "",
        type : "QUERY"
    },
    {
        name : TRACKER_ALLDOC_CMS_Name,
        query :SQLQUERY_TRACKER_ALLDOC_CMS,
        desc : "",
        type : "QUERY"
    },
  
];

const SQLView_Init_Map = prepareIdToObjectMap(SQLView_Init,"name");

