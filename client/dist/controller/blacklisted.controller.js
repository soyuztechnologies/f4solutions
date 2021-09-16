sap.ui.define(["oft/fiori/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast","oft/fiori/models/formatter","sap/ui/model/Filter","sap/viz/ui5/format/ChartFormatter","sap/viz/ui5/api/env/Format"],function(e,t,a,o,s,r,i){"use strict";return e.extend("oft.fiori.controller.blacklisted",{formatter:o,onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.attachRoutePatternMatched(this.herculis,this);var e=this.getModel("local").getProperty("/CurrentUser");if(e){var t=this.getModel("local").oData.AppUsers[e].UserName;this.getView().byId("idUser").setText(t)}},setCountryData:function(e,t){var a=e.split(", ");var o="";var a=a.filter(function(e){return e!=null}).filter(function(){return true});var s=[];var a=$.each(a,function(e,t){if($.inArray(t,s)===-1)s.push(t)});for(var r=0;r<s.length;r++){if(r>0){o=s[r]+", "+o}else{o=s[r]}}if(o===""){o="no past history found"}t.setText(o)},onSplitName:function(e){var t=e.getParameter("value");if(t.indexOf(" ")!==-1){var a=t.split(" ")[0];var o=t.split(" ")[1];this.getView().getModel("local").setProperty("/block/FirstName",a);this.getView().getModel("local").setProperty("/block/LastName",o)}},setOtherData:function(e){if(e.FirstName!==""&&e.FirstName!=="null"&&e.FirstName!==undefined){this.getView().getModel("local").setProperty("/block/FirstName",e.FirstName)}else{this.getView().getModel("local").setProperty("/block/FirstName","")}if(e.LastName!==""&&e.LastName!=="null"&&e.LastName!==undefined){this.getView().getModel("local").setProperty("/block/LastName",e.LastName)}else{this.getView().getModel("local").setProperty("/block/LastName","")}if(e.Country!==""&&e.Country!=="null"&&e.Country!==undefined){this.getView().byId("country").setSelectedKey(e.Country)}else{this.getView().byId("country").setSelectedKey("IN")}if(e.Phone!==""&&e.Phone!==0&&e.Phone!==undefined){this.getView().getModel("local").setProperty("/block/Phone",e.Phone)}else{this.getView().getModel("local").setProperty("/block/Phone","")}},onLiveChange:function(e){var t=e.getParameter("value");var a=this;var o=this.getView().byId("countrydata");if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(t)){o.setText("");$.post("/checkStudentById",{emailId:t}).done(function(e,t){if(e){a.setCountryData(e.country,o);if(e.inq){a.setOtherData(e.inq)}}}).fail(function(e,t,a){o.setText("no past history")})}else{}},getUserId:function(e){return this.getModel("local").getData().CurrentUser},passwords:"",onDataExport:function(e){$.ajax({type:"GET",url:"BlackDownload",success:function(e){sap.m.MessageToast.show("File Downloaded succesfully")},error:function(e,t,a){sap.m.MessageToast.show("error in downloading the excel file")}})},onDelete:function(e){var a=this;t.confirm("Do you want to delete the selected records?",function(e){if(e=="OK"){var t=a.getView().byId("idRecent").getSelectedContexts();for(var o=0;o<t["length"];o++){a.ODataHelper.callOData(a.getOwnerComponent().getModel(),t[o].sPath,"DELETE",{},{},a).then(function(e){sap.m.MessageToast.show("Deleted succesfully")}).catch(function(e){a.getView().setBusy(false);a.oPopover=a.getErrorMessage(e);a.getView().setBusy(false)})}}},"Confirmation")},onBack:function(){sap.ui.getCore().byId("idApp").to("idView1")},herculis:function(e){if(e.getParameter("name")!=="blacklisted"){return}this.getView().getModel("local").setProperty("/block/date",this.formatter.getFormattedDate(0));this.getView().byId("inqDate").setValue(this.formatter.getFormattedDate(0));this.getView().getModel("local").setProperty("/block/country","IN");var t=new Date;t.setHours(0,0,0,0);var a=new sap.ui.model.Sorter("CreatedOn",true);var o=this.getView().byId("idRecent");o.bindAggregation("items",{path:"/Blocks",template:new sap.m.DisplayListItem({label:"{EmailId} - {message}",value:"{CreatedOn}-{CreatedBy}"})});o.attachUpdateFinished(this.counter);var s=this;i.numericFormatter(r.getInstance())},counter:function(e){var t=e.getSource();var a=t.getItems().length;t.getHeaderToolbar().getContent()[0].setText("Today : "+a);var o=t.mAggregations.items;var s;var r;var i;for(var n=0;n<o.length;n++){r=o[n].mProperties.value.split("-")[0];i=o[n].mProperties.value.split("-")[1];if(this.getModel("local").getProperty("/AppUsers")[i]){s=this.getModel("local").getProperty("/AppUsers")[i].UserName;t.getItems()[n].setValue(r+" - "+s)}}},onSave:function(e){var t=e;var a=this;a.getView().setBusy(true);var o=this.getView().getModel("local").getProperty("/block");if(!this.getView().byId("inqDate").getDateValue()){sap.m.MessageToast.show("Enter a valid Date");return""}if(o.phone){o.phone=this.formatter.extractNo(o.phone).replace(/,/g,"")}var s={EmailId:o.emailId.toLowerCase(),CourseName:o.course,FirstName:o.FirstName,Date:this.getView().byId("inqDate").getDateValue(),Country:o.country,Phone:o.phone,Message:o.message,CreatedOn:new Date,CreatedBy:"Minakshi"};this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Blocks","POST",{},s,this).then(function(e){a.getView().setBusy(false);sap.m.MessageToast.show("Entry Saved successfully");a.destroyMessagePopover();if(a.getView().byId("idRecent").getBinding("items")){a.getView().byId("idRecent").getBinding("items").refresh()}}).catch(function(e){a.getView().setBusy(false);a.getErrorMessage(e)})}})});