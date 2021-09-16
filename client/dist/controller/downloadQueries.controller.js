sap.ui.define(["oft/fiori/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast","oft/fiori/models/formatter"],function(e,t,o,r){"use strict";return e.extend("oft.fiori.controller.downloadQueries",{formatter:r,onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.attachRoutePatternMatched(this.herculis,this)},JSON2CSV:function(e){var t=typeof e!="object"?JSON.parse(e):e;var o="";var r="";if($("#labels").is(":checked")){var a=t[0];if($("#quote").is(":checked")){for(var n in t[0]){var s=n+"";r+='"'+s.replace(/"/g,'""')+'",'}}else{for(var n in t[0]){r+=n+","}}r=r.slice(0,-1);o+=r+"\r\n"}for(var l=0;l<t.length;l++){var r="";if($("#quote").is(":checked")){for(var n in t[l]){var s=t[l][n]+"";r+='"'+s.replace(/"/g,'""')+'",'}}else{for(var n in t[l]){r+=t[l][n]+","}}r=r.slice(0,-1);o+=r+"\r\n"}return o},updateInq:function(){var e=this;$.post("/updateAllInq").done(function(e,t){sap.m.MessageBox.error("Done")}).fail(function(e,t,o){sap.m.MessageBox.error("Error in upload")})},TakeBackup:function(){$.post("/TakeBackup").done(function(e,t){sap.m.MessageBox.error("Backup taken successfully")}).fail(function(e,t,o){sap.m.MessageBox.error("Error in backup")})},fillColl:function(){var e=this;this.Students=[];this.Courses=[];e.ODataHelper.callOData(e.getOwnerComponent().getModel(),"/Students","GET",{},null,e).then(function(t){if(t.results.length>0){for(var o=0;o<t.results.length;o++){e.Students[t.results[o].id]=t.results[o]}debugger}}).catch(function(e){debugger});e.ODataHelper.callOData(e.getOwnerComponent().getModel(),"/Courses","GET",{},null,e).then(function(t){if(t.results.length>0){for(var o=0;o<t.results.length;o++){e.Courses[t.results[o].id]=t.results[o]}debugger}}).catch(function(e){debugger})},handleUploadComplete:function(e){var t=e.getParameter("response");if(t){var r="";debugger;var a=/^\[(\d\d\d)\]:(.*)$/.exec(t);if(a[1]=="200"){$.post("/upload",{files:e.getSource().getFocusDomRef().files[0]}).done(function(e,t){sap.m.MessageBox.error("Done")}).fail(function(e,t,o){sap.m.MessageBox.error("Error in upload")});r="Return Code: "+a[1]+"\n"+a[2]+"(Upload Success)";e.getSource().setValue("")}else{r="Return Code: "+a[1]+"\n"+a[2]+"(Upload Error)"}o.show(r)}},handleUploadPress:function(e){var t=this.byId("fileUploader");t.upload()},onBack:function(){sap.ui.getCore().byId("idApp").to("idView1")},onSave:function(){console.log(this.getView().getModel("local").getProperty("/newBatch"))},onExecute:function(){},onStartChange:function(e){var t=e.getSource().getValue();var o=t.split(".");var r=new Date(o[2],o[1]-1,o[0]);var a=this.formatter.getIncrementDate(r,2.5);this.getView().getModel("local").setProperty("/newBatch/endDate",a);var n=this.formatter.getIncrementDate(r,8);this.getView().getModel("local").setProperty("/newBatch/blogDate",n);console.log(a);console.log(n)},herculis:function(e){this.getView().getModel("local").setProperty("/newBatch/startDate",this.formatter.getFormattedDate(0));this.getView().getModel("local").setProperty("/newBatch/demoDate",this.formatter.getFormattedDate(0));this.getView().getModel("local").setProperty("/newBatch/endDate",this.formatter.getFormattedDate(2.5));this.getView().getModel("local").setProperty("/newBatch/blogDate",this.formatter.getFormattedDate(8))}})});