
(function($) {

	
	var noRejectedRequests = false;
	var totalRequests = "#edit-field-globaltotal-und-0-value"; 
	var totalRequestsWithFee = "#edit-field-requestswithfeetotal-und-0-value";
	var feeSum = "#edit-field-requestswithfeesum-und-0-value"; 
	var step5Counter = 0; 
	var errorMessageStep5 = 'נא להזין נתונים תקינים.';
	
	var totalReasons = '#edit-field-rejectedtotal-und-0-value';	
	var totalRejected = "#edit-field-r-year-und-0-value";

	Drupal.behaviors.hideTags = {
		attach: function(context, settings){
			if($('#items-node-form').get(0)){
				$('#items-node-form #edit-field-tags').hide();
				$('#items-node-form #edit-field-report-authority-und').blur(function(){
					$('#items-node-form #edit-field-tags-und').val($.trim($(this).val().replace(/\(.*\)/, "")));
				});
			}

			if($("body").hasClass('page-node-edit') && $("body").hasClass('node-type-searchpage')){
				$("#block-views-parentstock-block").remove();
			}
		}
	}

	Drupal.behaviors.limitInputs = {
		attach: function(context, settings){
			$('#edit-title').attr('maxlength', 50); 

			
			if($('#items-node-form').get(0)){
				$('#edit-field-govxmaintitle-und-0-value').attr('maxlength', 140);
			}

			
			if($('.node-type-homepage #homepage-node-form').get(0) || $('.page-node-add-homepage #homepage-node-form').get(0)){
				
				$('#edit-field-govxmaintitle-und-0-value').attr('maxlength', 60);

				
				$('#field-collection-news-values tr').each(function(){

					$('.field-name-field-newstitle .form-text', $(this)).attr('maxlength', 40);
				});

				
				$('#edit-field-collection-news-und-add-more').bind('click', function(){
					$('.field-name-field-newstitle .form-text', $(this)).attr('maxlength', 40);
				});
			}

			if($('#content-node-form').get(0)){
				$('#edit-field-govxmaintitle-und-0-value').attr('maxlength', 60);
			}
			
		}
	}

	Drupal.behaviors.flipInputs = {
		attach: function(context, settings) {
			if($(".page-node-edit").get(0) || $(".page-node-add").get(0)){
				$('form input[type="text"]').each(function(){
					$(this).css('direction', 'rtl');
					
					if(($(this).hasClass('form-autocomplete'))){
						$(this).css('background-position', 'left 4px');
					}
				});
				$("form textarea").each(function(){
					$(this).css('direction', 'rtl');
				});
			}
		}
	}


	Drupal.behaviors.addReport = {
    attach: function(context, settings){
      if( $('.page-node-add-report').get(0) || $('.page-node-edit').get(0) )
      {		  
			 	disableSendButton(); 
			 	$("#edit-field-report-authority-und").once().attr("disabled",true);
			 	$("#edit-field-mmdofficestypes-und").change(function(){
					$("#edit-field-report-authority-und").attr("disabled",false);
			 	});			 	
			 	$("#edit-submit").attr("value","שלח"); 

			 	
				$("#edit-field-status-handling2-und option[value='_none'], #edit-field-office-use-und option[value='_none'], #edit-field-reportingyear-und option[value='_none'], #edit-field-rejectedrequests-und-0-field-rejectedreason-und option[value='_none'], #edit-field-mmdofficestypes-und option[value='_none'], #edit-field-report-authority-und option[value='_none']").text("בחר/י ערך");
				
				
				$("#edit-field-report-authority-und").hover(function(){
					$('#edit-field-report-authority-und option').each(function(){
		        var text = $(this).text();
		        if (text.indexOf('&amp;') >= 0) {
		          text = text.replace("&amp;", "&");
		        }
		        if (text.indexOf('&#039;') >= 0) {
		          text = text.replace("&#039;", "'");
		        }
		        if (text.indexOf('&quot;') >= 0) {
		          	text = text.replace("&quot;", '"');
		        }
		        $(this).text(text);
		      });
				});

				
				$("#field-rejectedrequests-values th").html("<label> סיבות הדחייה </label><span class='description'>יש להזין את הנתונים בכל השדות גם במידה וערך השדה שווה ל-0</span>");
		
				
				$("#edit-field-mmdofficestypes-und, #edit-field-report-authority-und").change(function() {
					$('#node_report_form_group_user_info input.multipage-link-next').css('display','block');
					$('#node_report_form_group_user_info input.rm-new-input').css('display','none');
					$("#node_report_form_group_user_info .multipage-button .error_msg_before_next").remove();
				});

	
		$("#edit-field-reportingyear-und").change(function() {

			$('#node_report_form_group_info_about_requests input.multipage-link-next').css('display','block');
			$('#node_report_form_group_info_about_requests input.rm-new-input').css('display','none');
			$("#node_report_form_group_info_about_requests .multipage-button .error_msg_before_next").remove();

			
			$(".form-item-field--r-year-und-0-value label").html((($(".form-item-field--r-year-und-0-value label").html()).split(":")[0])+": "+$(this).val());
			
			
			$(".form-item-field-sum-ended-year2-und-0-value label").html((($(".form-item-field-sum-ended-year2-und-0-value label").html()).split(":")[0])+": "+$(this).val());
			
			
			if($("#edit-field-report-authority-und").val() != "_none"){
				$("#edit-title-field input").val($("#edit-field-report-authority-und option:selected").text()+" "+$(this).val());
			}
		});

		
		$("#edit-field-report-authority-und").change(function() {
			$("#edit-title-field input").val($("#edit-field-report-authority-und option:selected").text());
			
		
			if($("#edit-field-reportingyear-und").val() != "_none"){
				$("#edit-title-field input").val($("#edit-field-report-authority-und option:selected").text()+" "+$("#edit-field-reportingyear-und").val());
			}
		});

		
		$(".group-info-rejected-requests .multipage-pane-title").after("<span id='hide-screen-msg-step3'></span>");
		$(".group-requests-ended .multipage-pane-title").after("<span id='hide-screen-msg-step4'></span>");
		$(".group-requestswithfee .multipage-pane-title").after("<span id='hide-screen-msg-step5'></span>");
		
		
		$( "#edit-field-globalcompletainfo-und-0-value, #edit-field-globalpartinfo-und-0-value, #edit-field-globalrejectinfo-und-0-value, #edit-field-globalnopaystop-und-0-value, #edit-field-globalapplicantstopped-und-0-value, #edit-field-globalwasntended-und-0-value, #field-rejectedrequests-values .form-text, #node_report_form_group_requests_ended .form-text, #edit-field-requestswithfeetotal-und-0-value").attr('maxlength','4');
		$("#edit-field-requestswithfeesum-und-0-value").attr('maxlength','8');
		
		
		function IntValidation()
		{
				$( "#edit-field-requestswithfeetotal-und-0-value, #edit-field-requestswithfeesum-und-0-value, #node_report_form_group_requests_ended .form-text, #edit-field-phonenumber2-und-0-value, #edit-field-phonenumber-und-0-value, #edit-field-globalcompletainfo-und-0-value, #edit-field-globalpartinfo-und-0-value, #edit-field-globalrejectinfo-und-0-value, #edit-field-globalnopaystop-und-0-value, #edit-field-globalapplicantstopped-und-0-value, #edit-field-globalwasntended-und-0-value, #field-rejectedrequests-add-more-wrapper .form-text").keydown(function(e)
				{
	    
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	    
	            (e.keyCode == 65 && e.ctrlKey === true) || 
	    
	            (e.keyCode >= 35 && e.keyCode <= 39)) 
	        {
		
		        return;
	        }
	    
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }
				});
		}

	
		IntValidation();
		
	
		$( "#edit-field-globalcompletainfo-und-0-value, #edit-field-globalpartinfo-und-0-value, #edit-field-globalrejectinfo-und-0-value, #edit-field-globalnopaystop-und-0-value, #edit-field-globalapplicantstopped-und-0-value, #edit-field-globalwasntended-und-0-value" ).change(function()
		{
	
			$('#node_report_form_group_info_about_requests input.multipage-link-next').css('display','block');
			$('#node_report_form_group_info_about_requests input.rm-new-input').css('display','none');
			$("#node_report_form_group_info_about_requests .multipage-button .error_msg_before_next").remove();

			var sumGlobalTotal = 0;
			var sum_ended = 0;
			var rejected_requests_sum = 0;
			var tmp_num2 = parseInt($("#edit-field-globalcompletainfo-und-0-value").val());	
			if(!isNaN(tmp_num2))
			{
				sumGlobalTotal+=tmp_num2;
				sum_ended+=tmp_num2;
			}
			tmp_num2 = parseInt($("#edit-field-globalpartinfo-und-0-value").val());
			if(!isNaN(tmp_num2))
			{
				sumGlobalTotal+=tmp_num2;
				sum_ended+=tmp_num2;
				rejected_requests_sum+=tmp_num2;
			}
			tmp_num2 = parseInt($("#edit-field-globalrejectinfo-und-0-value").val());
			if(!isNaN(tmp_num2))
			{
				sum_ended+=tmp_num2; 
				sumGlobalTotal+=tmp_num2;
				rejected_requests_sum+=tmp_num2;
			}
			tmp_num2 = parseInt($("#edit-field-globalnopaystop-und-0-value").val());
			if(!isNaN(tmp_num2))
				sumGlobalTotal+=tmp_num2;
			tmp_num2 = parseInt($("#edit-field-globalapplicantstopped-und-0-value").val());
			if(!isNaN(tmp_num2))
				sumGlobalTotal+=tmp_num2;
			tmp_num2 = parseInt($("#edit-field-globalwasntended-und-0-value").val());
			if(!isNaN(tmp_num2))
				sumGlobalTotal+=tmp_num2;

			
			$("#edit-field-globaltotal-und-0-value").val(sumGlobalTotal);

			
			$("#edit-field-sum-ended-year2-und-0-value").val(sum_ended);

	    
			if(rejected_requests_sum === 0 )
			{
				noRejectedRequests = true; 
				$(".group-info-rejected-requests div div").css("display", "none");
				$("#hide-screen-msg-step3").html("לא נמסר מידע אודות בקשות שסורבו");

				
				
				$("#edit-field-rejectedrequests-und-0-field-rejectedreasonsum-und-0-value").val("0");
				$("#edit-field-rejectedrequests-und-0-field-rejectedreason-und").val("8(1) – הקצאת משאבים בלתי סבירה");
			}
	    else
	    {
	    	noRejectedRequests = false; 
	    	$("#edit-field-r-year-und-0-value").val(rejected_requests_sum);
	    	$(".group-info-rejected-requests div div").css("display", "inline-block");
	    	$("#hide-screen-msg-step3").html("");
	    	
	    	
				$("#edit-field-rejectedrequests-und-0-field-rejectedreasonsum-und-0-value").val("");
				$("#edit-field-rejectedrequests-und-0-field-rejectedreason-und").val("_none");
	    }

			if(sum_ended == 0 )
			{
				$(".group-requests-ended div div").css("display", "none");
				$("#hide-screen-msg-step4").html("לא נמסר מידע אודות זמני טיפול בבקשות שנענו");
				$("#edit-field-ended15-und-0-value, #edit-field-ended1630-und-0-value, #edit-field-ended3160-und-0-value, #edit-field-ended61120-und-0-value, #edit-field-ended120-und-0-value").val(0);
			}
			else
			{
				$(".group-requests-ended div div").css("display", "block");
		  	$("#edit-field-sum-ended-year-und-0-value").val(sum_ended);
		    $('#hide-screen-msg-step4').html("");
		    $("#edit-field-ended15-und-0-value, #edit-field-ended1630-und-0-value, #edit-field-ended3160-und-0-value, #edit-field-ended61120-und-0-value, #edit-field-ended120-und-0-value").val("");
				$('#node_report_form_group_requestswithfee input.multipage-link-next').css('display','none');
		   
			}
		    
		  
    	if (sumGlobalTotal == 0 )
    	{
    		$("#edit-field-requestswithfeetotal, #edit-field-requestswithfeesum, .group-requestswithfee .fieldset-description").css("display", "none");
      	$("#hide-screen-msg-step5").html("לא נמסר מידע אודות אגרות שניגבו");
      	$("#edit-field-requestswithfeetotal-und-0-value, #edit-field-requestswithfeesum-und-0-value").val(0);
      	enableSendButton();
      }
      else
      {
      	$("#edit-field-requestswithfeetotal, #edit-field-requestswithfeesum, .group-requestswithfee .fieldset-description").css("display", "block");
      	$('#hide-screen-msg-step5').html("");
      	$("#edit-field-requestswithfeetotal-und-0-value, #edit-field-requestswithfeesum-und-0-value").val("");
      }
		});
         
	 
     	function sumOfRejectedRequests(name)
     	{
				var sumRejectTotal = 0;
				var numberOfRejectFields =	$("input[id^='edit-field-rejectedrequests-und-'][id*=-field-rejectedreasonsum-und-]").length;
		    
		    
       	$("input[id^='edit-field-rejectedrequests-und-'][id*=-field-rejectedreasonsum-und-]").each(function(index)
       	{
       		number = parseInt($("input[name^='field_rejectedrequests[und]["+index+"][field_rejectedreasonsum][und][0][value]']").val());
       		if(!isNaN(number))
       			sumRejectTotal += number;
         
          $("#edit-field-rejectedtotal-und-0-value").val(sumRejectTotal);
         
          if(number == 0){
						alert('לא ניתן להזין אפס בסך הבקשות שנדחו עבור עילה ספציפית');
						$(this).val('');
          }
          	
        });
       }

        
        $("input[id^='edit-field-rejectedrequests-und-'][id*=-field-rejectedreasonsum-und-]").keyup(function()
        {
	        sumOfRejectedRequests($(this).attr("name"));
	    	});

	    
		$('html').bind("DOMSubtreeModified",function(){
			var first_element = $("#edit-field-rejectedrequests-und-0-field-rejectedreasonsum-und-0-value").val();
		
			$(".page-node-add-report .field-type-field-collection .form-text").attr('maxlength','4');
			IntValidation();

		
			if($("#node_report_form_group_requestswithfee").css('display') == 'block'){
			    
		
			    $("#edit-title-field-und-0-value, #edit-field-totalnoinfo-und-0-value, #edit-field-r-year-und-0-value, #edit-field-rejectedtotal-und-0-value, #edit-field-endedtotal-und-0-value, #edit-field-totalnoinfo-und, #edit-field-year-ended-r-und-0-value, #edit-field-globaltotal-und-0-value, #edit-field-sum-ended-year2-und-0-value").attr("disabled",false);
			}
			else{
        	
        		$("#edit-title-field-und-0-value, #edit-field-totalnoinfo-und-0-value, #edit-field-r-year-und-0-value, #edit-field-rejectedtotal-und-0-value, #edit-field-endedtotal-und-0-value, #edit-field-totalnoinfo-und, #edit-field-year-ended-r-und-0-value, #edit-field-globaltotal-und-0-value, #edit-field-sum-ended-year2-und-0-value").attr("disabled",true);
			}
		});
			
		
		$("#node_report_form_group_user_info .multipage-button .multipage-link-next").mouseover(function() {
		    var invalid= 0;
		    $('#node_report_form_group_user_info .required').each(function () {
		        if ($(this).val() == '' || $(this).val() == '_none') {
		            invalid++;
		        }
		    });

			if(invalid > 0){
				invalid= 0;
			  	if(!($("#node_report_form_group_user_info .multipage-button input").hasClass('rm-new-input'))) {
			  		$("#node_report_form_group_user_info .multipage-button").append('<input type="button" class="form-submit multipage-link-next rm-new-input" value="הבא"/>');
			  	}
			  	$('#node_report_form_group_user_info input.multipage-link-next').css('display','none');
			  	$('#node_report_form_group_user_info input.rm-new-input').css('display','block');

			  	if(!($("#node_report_form_group_user_info .multipage-button span").hasClass('error_msg_before_next'))) {
			  		$("#node_report_form_group_user_info .multipage-button").append('<span class="error_msg_before_next"> יש למלא את שדות החובה </span>');
			  	}
			}
			else{
				invalid= 0;
				$('#node_report_form_group_user_info input.multipage-link-next').css('display','block');
				$('#node_report_form_group_user_info input.rm-new-input').css('display','none');
				$("#node_report_form_group_user_info .multipage-button .error_msg_before_next").remove();
			}
			
		});

		
		$("#node_report_form_group_info_about_requests .multipage-button .multipage-link-next").mouseover(function() {
			
		    var invalid= 0;
		    $('#node_report_form_group_info_about_requests .required').each(function () {
		        if ($(this).val() == '' || $(this).val() == '_none') {
		            invalid++;
		        }
		    });

			if(invalid > 0){
				invalid= 0;
			  	if(!($("#node_report_form_group_info_about_requests .multipage-button input").hasClass('rm-new-input'))) {
			  		$("#node_report_form_group_info_about_requests .multipage-button").append('<input type="button" class="form-submit multipage-link-next rm-new-input" value="הבא"/>');
			  	}
			  	$('#node_report_form_group_info_about_requests input.multipage-link-next').css('display','none');
			  	$('#node_report_form_group_info_about_requests input.rm-new-input').css('display','block');

			  	if(!($("#node_report_form_group_info_about_requests .multipage-button span").hasClass('error_msg_before_next'))) {
			  		$("#node_report_form_group_info_about_requests .multipage-button").append('<span class="error_msg_before_next"> יש למלא את שדות החובה </span>');
			  	}
			}
			else{
				invalid= 0;
				$('#node_report_form_group_info_about_requests input.multipage-link-next').css('display','block');
				$('#node_report_form_group_info_about_requests input.rm-new-input').css('display','none');
				$("#node_report_form_group_info_about_requests .multipage-button .error_msg_before_next").remove();
			}
			
		});

		
		function validation_step_3()
		{
		
			$("#node_report_form_group_info_rejected_requests .multipage-button .multipage-link-next").mouseover(function()
			{
		    var invalid = 0;
		    var someFieldIsEmpty = false;
				var notEqual;

		
		    $('#node_report_form_group_info_rejected_requests .required').each(function()
		    {
		    
	        if ($(this).val() == '' || $(this).val() == '_none')
	        {
	        	invalid++;
	        	someFieldIsEmpty = true;
	        }
		    });

		    
		    
		    if(parseInt($(totalRejected).val()) > parseInt($(totalReasons).val()))
		    {
		    	invalid++;
		    	notEqual = true;
		    }
		    else{
		    	notEqual = false;
		    }

		    
				if(invalid > 0 && noRejectedRequests == false)
				{
					invalid = 0;
					
			  	if(!($("#node_report_form_group_info_rejected_requests .multipage-button input").hasClass('rm-new-input')))
			  	{
			  		$("#node_report_form_group_info_rejected_requests .multipage-button").append('<input type="button" class="form-submit multipage-link-next rm-new-input" value="הבא"/>');
			  	}
			  	$('#node_report_form_group_info_rejected_requests input.multipage-link-next').css('display','none');
			  	$('#node_report_form_group_info_rejected_requests input.rm-new-input').css('display','block');

			  	if(notEqual === false){
						$(".errorMsg2").hide();
			  	}
			  	else{
			  		$(".errorMsg2").show();
			  	}

			  	if(someFieldIsEmpty === false){
			  		$(".errorMsg1").hide();
			  	}
			  	else{
			  		$(".errorMsg1").show();
			  	}

			  	if(!($("#node_report_form_group_info_rejected_requests .multipage-button span").hasClass('error_msg_before_next')))
			  	{
			  		$(".errorMsg1").show();
			  		$("#node_report_form_group_info_rejected_requests .multipage-button").append('<span class="error_msg_before_next errorMsg1"> יש למלא את שדות החובה באופן תקין </span>');
			  		if(notEqual === true)
			  		{
			  			
							$(".errorMsg2").show();
							$("#node_report_form_group_info_rejected_requests .multipage-button").append('<span class="error_msg_before_next errorMsg2"><br />מספר הבקשות שנדחו אינו תואם את הנתונים שמילאת</span>');
			  		}
			  	}
				}
				else
				{
					invalid = 0;
					$('#node_report_form_group_info_rejected_requests input.multipage-link-next').css('display','block');
					$('#node_report_form_group_info_rejected_requests input.rm-new-input').css('display','none');
					if(notEqual === false && someFieldIsEmpty === false)
					{
						$("#node_report_form_group_info_rejected_requests .multipage-button .error_msg_before_next").remove();
					}
						
				}
				
			}); 
		} 
		validation_step_3();

		
		$("#edit-field-rejectedrequests-und-0-field-rejectedreason-und").change(function(){
			validation_step_3();
		});

		$("#edit-field-ended15-und-0-value, #edit-field-ended1630-und-0-value, #edit-field-ended3160-und-0-value, #edit-field-ended61120-und-0-value, #edit-field-ended120-und-0-value").live("keyup",function()
		{
	  	claculate_sum_requests_ended($(this).attr("name"));
	  });

		
		$("input[id^='edit-field-ended']").live("keyup",function()
		{
	    var invalid = 0;
	    var someFieldIsEmpty = false;
	    $('#node_report_form_group_requests_ended .required').each(function()
	    {
	      if ($(this).val() == '')
	      {
	      	invalid++;
	      	someFieldIsEmpty = true;
	      }
	    });

	  
	    var reportedAsFinished = $("#edit-field-sum-ended-year2-und-0-value").val();
	    var currentFilled = $("#edit-field-endedtotal-und-0-value").val();
	    var notEqual = false;
	    if(reportedAsFinished != currentFilled)
	    {
	    	invalid++;
	    	notEqual = true;
	    }

			if(invalid > 0)
			{
				invalid = 0;
		  	if(!($("#node_report_form_group_requests_ended .multipage-button input").hasClass('rm-new-input'))) {
		  		$("#node_report_form_group_requests_ended .multipage-button").append('<input type="button" class="form-submit multipage-link-next rm-new-input" value="הבא" tata="haim"/>');
		  	}
		  	$('#node_report_form_group_requests_ended input.multipage-link-next').css('display','none');
		  	$('#node_report_form_group_requests_ended input.rm-new-input').css('display','block');

		  	if(notEqual === false){
					$(".errorMsg2").hide();
		  	}
		  	else{
		  		$(".errorMsg2").show();
		  	}
		  	if(someFieldIsEmpty === false){
		  		$(".errorMsg1").hide();
		  	}
		  	else{
		  		$(".errorMsg1").show();
		  	}

		  	if(!($("#node_report_form_group_requests_ended .multipage-button span").hasClass('error_msg_before_next'))){
		  		if(someFieldIsEmpty == true)
		  			$("#node_report_form_group_requests_ended .multipage-button").append('<span class="error_msg_before_next errorMsg1"> יש למלא את שדות החובה </span>');
		  		if(notEqual == true)
		  			$("#node_report_form_group_requests_ended .multipage-button").append('<span class="error_msg_before_next errorMsg2"><br />סך הבקשות בהן הסתיים הטיפול אינו תואם את סך כל הפניות שמילאת</span>');
		  	}
			}
			else
			{
				invalid = 0;
				$('#node_report_form_group_requests_ended input.multipage-link-next').css('display','block');
				$('#node_report_form_group_requests_ended input.rm-new-input').css('display','none');
				$("#node_report_form_group_requests_ended .multipage-button .error_msg_before_next").remove();
			}	
		});



		
		function claculate_sum_requests_ended(name)
		{			
		
			$('#node_report_form_group_requests_ended input.rm-new-input').css('display','none');
			$("#node_report_form_group_requests_ended .multipage-button .error_msg_before_next").remove();

			var sum_requests_ended = 0;
			var tmp_num = parseInt($("#edit-field-ended15-und-0-value").val());
			if(!isNaN(tmp_num))
				sum_requests_ended+=tmp_num;
	 		tmp_num = parseInt($("#edit-field-ended1630-und-0-value").val());
			if(!isNaN(tmp_num))
				sum_requests_ended+=tmp_num;
	 		tmp_num = parseInt($("#edit-field-ended3160-und-0-value").val());
			if(!isNaN(tmp_num))
				sum_requests_ended+=tmp_num;
	 		tmp_num = parseInt($("#edit-field-ended61120-und-0-value").val());
			if(!isNaN(tmp_num))
				sum_requests_ended+=tmp_num;
	 		tmp_num = parseInt($("#edit-field-ended120-und-0-value").val());
			if(!isNaN(tmp_num))
				sum_requests_ended+=tmp_num;
		
      if(sum_requests_ended > parseInt($("#edit-field-sum-ended-year2-und-0-value").val()))
      {
      	alert("הנתונים שהוזנו אינם תואמים לכמות הבקשות שנענו!");
				sum_requests_ended -= $('[name="'+name+'"]').val();
				$('[name="'+name+'"]').val("");
      }
	    $("#edit-field-endedtotal-und-0-value").val(sum_requests_ended);
		}
		
	
		$(totalRequestsWithFee).keyup(function(){		
			checkStep5() == true ? enableSendButton() : disableSendButton();
		});

	
		$(feeSum).keyup(function(){
			checkStep5() == true ? enableSendButton() : disableSendButton();
		});

	
		$(totalRequestsWithFee).change(function(){
	
			$('#node_report_form_group_requestswithfee input.rm-new-input').css('display','none');
			$("#node_report_form_group_requestswithfee .multipage-button .error_msg_before_next").remove();
    });  

  		} 
		} 
  } 


  
  Drupal.behaviors.editWrongCharacters = {
    attach: function (context, settings) {
      var select = $("#edit-field-report-authority-und");
				$(select).change(function(){
				var options = $("#edit-field-report-authority-und option");
				for(var i=0,counter=0;i<options.length;i++)
				{
					
					if(options[i].innerHTML.indexOf("&amp;quot;") > -1)
					{
						options[i].innerHTML = options[i].innerHTML.replace(/&amp;quot;/g,'"');
					}
					if(options[i].innerHTML.indexOf("&#039;") > -1)
					{
						options[i].innerHTML = options[i].innerHTML.replace(/&#039;/g,"'"); 
					}
				}
			});     
    }
  };

  
  Drupal.behaviors.hideUnwantedReasons = {			
	  attach: function (context, settings){
	  	if($("#report-node-form").length)
	  	{
	    	for(var i=1;i<=3;i++)
	    	{
					$('option[value="עילה'+ i +'"]').remove();
	    	}  
  		}
		}
  };

  
  Drupal.behaviors.disableReportUserOptions = {			
	  attach: function (context, settings){
	  	if($("#edit-field-status-handling2.disableReportStatusFields").length)
	  	{
	  		$('#edit-field-status-handling2-und option[value="אצל המשרד"]').attr('disabled',true);
	  		$('#edit-field-status-handling2-und option[value="מפורסם"]').attr('disabled',true);
	  		$('#edit-field-status-handling2-und option[value="הועבר לטיפול"]').attr('selected','selected'); 
  		}
		}
  };

  
  Drupal.behaviors.checkRequestDuplicates = {			
	  attach: function (context, settings){
			$('select[id*="rejectedreason"]').change(function(){
				var reasonsArr = [];
				$('select[id*="rejectedreason"]').each(function(index){
					reasonsArr[index] = $(this).val();
				}); 

				if(checkDuplicates(reasonsArr) == false){
					alert('לא ניתן לבחור באותה עילה יותר מפעם אחת');
					$(this).val('- Select a value -');
				}		
	  	});
		}
  };

	
	function checkDuplicates(arr){
		arr.sort();
		for(i=0;i<arr.length;i++){
			if(arr[i] == arr[i+1]){
				return false;
			}
		}
		return true
	}

 
  function disableSendButton(){
 
  	if(window.location.pathname.indexOf('/edit') > 0){
  		return true;
  	}  		
  	$("#node_report_form_group_requestswithfee #edit-submit").attr("disabled","disabled");
		$("#node_report_form_group_requestswithfee #edit-submit").css("cursor","not-allowed");
  }

  function enableSendButton(){
		$("#node_report_form_group_requestswithfee #edit-submit").removeAttr("disabled");
		$("#node_report_form_group_requestswithfee #edit-submit").css("cursor","pointer");
  }

  function checkStep5(){
  	step5Counter = 0;
		$('.errorMessagePage5').remove();

  	
  	if( parseInt($(totalRequests).val()) < parseInt($(totalRequestsWithFee).val()) ){
  		displayErrorStep5('מספר הבקשות שנדחו אינו תואם את הנתונים שמילאת');
  		return false; 		
  	}
  	else{
  		step5Counter++;
  	}

  	
  	if( ( (parseInt($(totalRequestsWithFee).val()) == 0 || $(totalRequestsWithFee).val() == "") && parseInt($(feeSum).val()) != 0 ) || ( parseInt($(totalRequestsWithFee).val()) != 0 && (parseInt($(feeSum).val()) == 0 || $(feeSum).val() == "") ) )
  	{
  		displayErrorStep5('נא למלא את כל השדות בצורה תקינה.');
  		return false;
  	}
  	else{
  		step5Counter++;
  	}

  	if(step5Counter == 2){
  		
  		$('.errorMessagePage5').remove();
  		return true;
  	}
				
  	displayErrorStep5(errorMessageStep5);
  	return false;
  }

  function displayErrorStep5(text){
  	
		if(!$('.errorMessagePage5')[0]){			
			$("#edit-actions").after('<p class="errorMessagePage5">' + text + '</p>'); 
		}
  }


})(jQuery);