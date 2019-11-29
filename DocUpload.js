var CannonFodder = CannonFodder || {};
		
CannonFodder.Utilities = function(){
	var currentDlg;
	var saveAttachment = function(){
		if(!validated()){
			jQuery('#lblResult').text("Please choose a file!");
			return;
		}
					
   		var dlgTitle;
   		var dlgMsg;
		var dlgWidth;
		var dlgHeight;
		dlgTitle = "Uploading Your File...";
		dlgMsg = "<br />Please wait whilst your file is being uploaded<br /><br />Please do not close your browser window.";
		dlgHeight = 300;
		dlgWidth = 500;
		
		if (currentDlg == null) {
		    currentDlg = SP.UI.ModalDialog.showWaitScreenWithNoClose(dlgTitle, dlgMsg, dlgHeight, dlgWidth);
		}
				
  		var file = jQuery("#AttachmentUploadField")[0].files[0];

		//Upload the file
		uploadFile(file);
	 };
	 
	var validated = function(){
		var file = jQuery("#AttachmentUploadField")[0].files[0];
 	
		if(file == null){		  
		   	return false;
		}
		else{
		    return true;
		}
	};
	
	var uploadFile = function (file) {
		 		proposalSiteUrl = jQuery('#ProposalSiteUrl option:selected').val();		
		
				if (proposalSiteUrl == _spPageContextInfo.webAbsoluteUrl) {
					uploadFileLocal(file);
				}
				else
				{
					uploadFileCrossSite(file, proposalSiteUrl);
				}
		 };
	
	var uploadFileLocal = function (file) {
		var digest = jQuery("#__REQUESTDIGEST").val();
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var libraryName = "Documents";

		var reader = new FileReader();
		var arrayBuffer;

		reader.onload = function (e) {
			arrayBuffer = reader.result;

			url = webUrl + "/_api/web/lists/getByTitle(@TargetLibrary)/RootFolder/files/add(url=@TargetFileName,overwrite='true')?" +
			   "@TargetLibrary='" + libraryName + "'" +
			   "&@TargetFileName='" + file.name + "'";

			jQuery.ajax({
				url: url,
				type: "POST",
				data: arrayBuffer,
				headers: {
					"Accept": "application/json; odata=verbose",
					"X-RequestDigest": digest
				},
				contentType: "application/json;odata=verbose",
				processData: false,
				success: function () {
				    jQuery('#lblResult').text("Successfully uploaded file locally.");
					if (currentDlg != null) {
			            currentDlg.close();
			        }
				},
				error: function (arr, error) {
  				    jQuery('#lblResult').text("Error uploading file locally.");
					if (currentDlg != null) {
			            currentDlg.close();
			        }
				}
			});
		};

		reader.readAsArrayBuffer(file);
	};

   	var uploadFileCrossSite = function (file, webUrl) {
		url = webUrl + "/_api/contextinfo";
		jQuery.ajax({
			url: url,
			type: "POST",
			headers: {
				"Accept": "application/json; odata=verbose"
			},
			contentType: "application/json;odata=verbose",
			success: function (data) {
				var digest = data.d.GetContextWebInformation.FormDigestValue;
				var libraryName = "Documents";

				var reader = new FileReader();
				var arrayBuffer;

				reader.onload = function (e) {
					arrayBuffer = reader.result;

					url = webUrl + "/_api/web/lists/getByTitle(@TargetLibrary)/RootFolder/files/add(url=@TargetFileName,overwrite='true')?" +
					   "@TargetLibrary='" + libraryName + "'" +
					   "&@TargetFileName='" + file.name + "'";

					jQuery.ajax({
						url: url,
						type: "POST",
						data: arrayBuffer,
						headers: {
							"Accept": "application/json; odata=verbose",
							"X-RequestDigest": digest
						},
						contentType: "application/json;odata=verbose",
						processData: false,
						success: function () {
						  jQuery('#lblResult').text("Successfully uploaded file to different site.");
						  if (currentDlg != null) {
			                  currentDlg.close();
			                  }
						},
						error: function () {
						  jQuery('#lblResult').text("Error uploading file to different site.");
						  if (currentDlg != null) {
			                  currentDlg.close();
			                  }

						}
					});
				};

				reader.readAsArrayBuffer(file);

			},
			error: function () {
 			   jQuery('#lblResult').text("Error accessing other site.");
			   if (currentDlg != null) {
			       currentDlg.close();
			   }
			 }
		   });
	};
return {
		SaveAttachment: saveAttachment
		};
	 
}();
 