sap.ui.define(["oft/fiori/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast","oft/fiori/models/formatter","sap/ui/model/Filter"],function(e,t,s,o,a){"use strict";return e.extend("oft.fiori.controller.mobileView",{formatter:o,onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.clearForm();this.oRouter.attachRoutePatternMatched(this.herculis,this);var e=this.getModel("local").getProperty("/CurrentUser");if(e){var t=this.getModel("local").oData.AppUsers[e].UserName;this.getView().byId("idUser").setText(t)}},onSearchNo:function(e){var t=e.getParameter("value");var s=this.getView().byId("idRecent");if(t.indexOf("@")!=-1||this.getView().byId("keySearch").getSelected()){s.bindAggregation("items",{path:"/Inquries",template:new sap.m.DisplayListItem({label:"{EmailId} - {CourseName} - {Country} - {Phone}",value:"{fees} {currency} / {CreatedOn}-{CreatedBy}"}),filters:[new a({filters:[new a("EmailId",sap.ui.model.FilterOperator.Contains,t)],and:false})]})}else{s.bindAggregation("items",{path:"/Inquries",template:new sap.m.DisplayListItem({label:"{EmailId} - {CourseName} - {Country} - {Phone}",value:"{fees} {currency} / {CreatedOn}-{CreatedBy}"}),filters:[new a({filters:[new a("Phone",sap.ui.model.FilterOperator.EQ,t)],and:false})]})}s.attachUpdateFinished(this.counter)},clearForm:function(){},passwords:"",onEmail:function(){var e=this;var t=e.getView().byId("idRecent").getSelectedContexts();for(var s=0;s<t["length"];s++){var o=t[s].getModel().getProperty(t[s].getPath());if(this.passwords===""){this.passwords=prompt("Please enter your password","");if(this.passwords===""){sap.m.MessageBox.error("Blank Password not allowed");return}}o.password=this.passwords;o.DollerQuote=this.getView().byId("doller").getSelected();$.post("/sendInquiryEmail",o).done(function(e,t){sap.m.MessageToast.show("Email sent successfully")}).fail(function(t,s,o){e.passwords="";sap.m.MessageBox.error(t.responseText)})}},onDataExport:function(e){$.ajax({type:"GET",url:"InquiryDownload",success:function(e){sap.m.MessageToast.show("File Downloaded succesfully")},error:function(e,t,s){sap.m.MessageToast.show("error in downloading the excel file")}})},onDelete:function(e){var s=this;t.confirm("Do you want to delete the selected records?",function(e){if(e=="OK"){var t=s.getView().byId("idRecent").getSelectedContexts();for(var o=0;o<t["length"];o++){s.ODataHelper.callOData(s.getOwnerComponent().getModel(),t[o].sPath,"DELETE",{},{},s).then(function(e){sap.m.MessageToast.show("Deleted succesfully")}).catch(function(e){s.getView().setBusy(false);s.oPopover=s.getErrorMessage(e);s.getView().setBusy(false)})}}},"Confirmation")},onBack:function(){sap.ui.getCore().byId("idApp").to("idView1")},onItemSelect:function(e){var t=e.getParameter("listItem").getBindingContextPath();var s=t.split("/")[t.split("/").length-1];this.oRouter.navTo("detail2",{suppId:s})},onPress:function(){sap.m.MessageBox.alert("Button was clicked")},onHover:function(){sap.m.MessageBox.alert("Button was Hovered")},onCourseSelect:function(e){var t=this.getView().byId("country").getSelectedKey();var s=this.getView().byId("course").getSelectedKey();var o=this.getView().getModel("local").getProperty("/courses");if(t==="IN"){for(var a=0;a<o.length;a++){if(o[a].courseName===s){this.getView().getModel("local").setProperty("/newLead/fees",o[a].fee);this.getView().getModel("local").setProperty("/newLead/currency","INR");break}}}else{for(var a=0;a<o.length;a++){if(o[a].courseName===s){this.getView().getModel("local").setProperty("/newLead/fees",o[a].usdFee);this.getView().getModel("local").setProperty("/newLead/currency","USD");break}}}},herculis:function(e){if(e.getParameter("name")!=="newlead"){return}},counter:function(e){var t=e.getSource();var s=t.getItems().length;t.getHeaderToolbar().getContent()[0].setText("Found : "+s);var o=t.mAggregations.items;var a;var n;var r;for(var i=0;i<o.length;i++){n=o[i].mProperties.value.split("-")[0];r=o[i].mProperties.value.split("-")[1];if(this.getModel("local").getProperty("/AppUsers")[r]){a=this.getModel("local").getProperty("/AppUsers")[r].UserName;t.getItems()[i].setValue(n+" - "+a)}}},supplierPopup:null,oInp:null,onPopupConfirm:function(e){var t=e.getParameter("selectedItem");this.oInp.setValue(t.getLabel())},oSuppPopup:null,onFilter:function(){if(!this.oSuppPopup){this.oSuppPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.getView().addDependent(this.oSuppPopup);this.oSuppPopup.setTitle("Suppliers");this.oSuppPopup.bindAggregation("items",{path:"/suppliers",template:new sap.m.DisplayListItem({label:"{name}",value:"{city}"})})}this.oSuppPopup.open()},onRequest:function(e){this.oInp=e.getSource();if(!this.supplierPopup){this.supplierPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.supplierPopup.setTitle("Cities");this.getView().addDependent(this.supplierPopup);this.supplierPopup.bindAggregation("items",{path:"/cities",template:new sap.m.DisplayListItem({label:"{cityName}",value:"{famousFor}"})})}this.supplierPopup.open()},onConfirm:function(e){if(e==="OK"){s.show("Your fruit has been approved successfully");this.getView().byId("idApr").setVisible(false)}},onSave:function(e){var t=e;console.log(this.getView().getModel("local").getProperty("/newLead"));var s=this;s.getView().setBusy(true);var o=this.getView().getModel("local").getProperty("/newLead");if(!this.getView().byId("inqDate").getDateValue()){sap.m.MessageToast.show("Enter a valid Date");return""}var a={EmailId:o.emailId.toLowerCase(),CourseName:o.course,FirstName:o.FirstName,LastName:o.LastName,Date:this.getView().byId("inqDate").getDateValue(),Country:o.country,Phone:o.phone,Subject:o.subject,Message:o.message,fees:o.fees,currency:o.currency,CreatedOn:new Date,CreatedBy:"Minakshi",SoftDelete:false};if(o.country==="IN"&&o.phone!=="null"&&o.phone!=="0"&&o.phone!==""){try{var n=o.FirstName;var r=o.phone;var i={};i.msgType="inquiry";i.userName=n;i.courseName=o.course;i.Number=r;$.post("/requestMessage",i).done(function(e,t){sap.m.MessageToast.show("Message sent successfully")}).fail(function(e,t,s){sap.m.MessageBox.error(e.responseText)})}catch(e){}finally{}}this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Inquries","POST",{},a,this).then(function(e){s.getView().setBusy(false);sap.m.MessageToast.show("Inquiry Saved successfully");s.destroyMessagePopover();if(s.getView().byId("idRecent").getBinding("items")){s.getView().byId("idRecent").getBinding("items").refresh()}}).catch(function(e){s.getView().setBusy(false);if(e.responseText.indexOf(":")!==-1){var t="Inquiry already Exists";var o=e.responseText.split(":")[e.responseText.split(":").length-1].replace(" ","");try{var n=s.getView().getModel("local").getProperty("/AppUsers")[o].UserName}catch(e){n="unknown"}try{var r=e.responseText.split(":")[e.responseText.split(":").length-2].replace(" ","").replace(" & Created by ","")}catch(e){r="US"}t=e.responseText.replace(o,n)+"Do you want to send again?"}if(s.oLeadDuplicate===undefined){var i;s.oLeadDuplicate=i=new sap.ui.xmlfragment("oft.fiori.fragments.Dialog",this);s.getView().addDependent(i);i.setTitle("Already Exist");var l=s;i.addButton(new sap.m.Button({text:"Yes",press:function(){if(l.passwords===""){l.passwords=prompt("Please enter your password","");if(l.passwords===""){sap.m.MessageBox.error("Blank Password not allowed");return}}var e=a;e.password=l.passwords;e.DollerQuote=l.getView().byId("doller").getSelected();e.Country=r;var t=l.getView().getModel("local").getProperty("/courses");if(e.Country==="IN"){for(var s=0;s<t.length;s++){if(t[s].courseName===e.CourseName){e.fees=t[s].fee;e.currency="INR";break}}}else{for(var s=0;s<t.length;s++){if(t[s].courseName===e.CourseName){e.fees=t[s].usdFee;e.currency="USD";break}}}$.post("/sendInquiryEmail",e).done(function(e,t){sap.m.MessageToast.show("Email sent successfully")}).fail(function(e,t,s){l.passwords="";sap.m.MessageBox.error(e.responseText)});i.close();i.destroyContent()}}));i.addButton(new sap.m.Button({text:"Close",press:function(){i.close();i.destroyContent()}}))}if(e.responseText.indexOf(":")!==-1){s.oLeadDuplicate.addContent(new sap.m.Text({text:t}));s.oLeadDuplicate.open()}else{this.getErrorMessage(e);s.oLeadDuplicate.destroyContent()}})},onApprove:function(){t.confirm("Do you want to approve this fruit",{title:"confirmation",onClose:this.onConfirm.bind(this)})},onGetNext:function(){$.post("/MoveNextAc",{}).done(function(e,t){if(e.accountNo==="114705500444"){sap.m.MessageBox.confirm("Hello ,"+"\n"+"\n"+"Thanks for your confirmation, Please transfer the funds to below bank account"+"\n"+"\n"+"Bank Name    : "+e.BankName+"\n"+"Account Name : "+e.accountName+"\n"+"Account No   : "+e.accountNo+"\n"+"IFSC Code    : "+e.ifsc+"\n"+"\n"+"You can also pay with barcode scan of UPI https://www.anubhavtrainings.com/upi-payment-gateway"+"\n"+"\n"+"Note: Please share the screenshot of payment once done.")}else{sap.m.MessageBox.confirm("Hello ,"+"\n"+"\n"+"Thanks for your confirmation, Please transfer the funds using to below bank account"+"\n"+"\n"+"Bank Name    : "+e.BankName+"\n"+"Account Name : "+e.accountName+"\n"+"Account No   : "+e.accountNo+"\n"+"IFSC Code    : "+e.ifsc+"\n"+"\n"+"Note: Please share the screenshot of payment once done.")}}).fail(function(e,t,s){sap.m.MessageBox.error(e.responseText)})}})});