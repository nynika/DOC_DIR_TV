var PAGE_DISPLAY_DURATION = 9000;
var DATA_FETCHING_DURATION = 30000;
// var SERVER_STRING = "http://192.168.1.104";
// var SERVER_STRING = "http://192.168.0.158";
var SERVER_STRING = "http://192.168.15.12";
var MAX_DOCTOR_PER_PAGE = 5;
var totalDoc = 0,
  deptIndex = 0,
  totalDocInCrntDept = 0,
  docListPendingToShow = 0,
  pendingDocListStartIndex = 0,
  slideIndex = 0;
var tickerIndexArray = [];
var tickerIndexRef = 0,
  docListTimer = 0;
var myDepartArray = [];
var finalArrObj = {};
var config1 = null,
  config2 = null;
var fullDeptList = [];
var slide = [];
var showImage = true;

$(document).ready(function () {
  jssor_1_slider_init();
  app_init();
});

function jssor_1_slider_init() {
  var jssor_1_options = {
    $AutoPlay: 2,
    $Align: 0,
  };

  var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

  var MAX_WIDTH = 1080; // 720;
  var MAX_HEIGHT = 1280;

  function ScaleSlider() {
    var containerElement = jssor_1_slider.$Elmt.parentNode;
    var containerWidth = containerElement.clientWidth;
    var containerHeight = containerElement.clientHeight;

    if (containerWidth) {
      var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
      var expectedHeight = Math.min(
        MAX_HEIGHT || containerHeight,
        containerHeight
      );

      jssor_1_slider.$ScaleWidth(expectedWidth);
      //   jssor_1_slider.$ScaleSize(expectedWidth, expectedHeight);
    } else {
      window.setTimeout(ScaleSlider, 30);
    }
  }

  ScaleSlider();

  $Jssor$.$AddEvent(window, "load", ScaleSlider);
  $Jssor$.$AddEvent(window, "resize", ScaleSlider);
  $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
  /*#endregion responsive code end*/
}

function extractDoctorDetails(id) {
  let doctor = null;

  for (let i = 0; i < config2.length; i += 1) {
    if (id === config2[i].id) {
      doctor = {};
      doctor.id = id;
      doctor.name = config2[i].name;
      doctor.specialization = config2[i].specialization;
      doctor.designation = config2[i].designation;
      doctor.image = SERVER_STRING + config2[i].image;
      break;
    }
  }
  return doctor;
}

function multiplePages() {
	let k, id, index, docListAvailable;
	let doctor_id, doctorDetails, subdepartments, newDoctorArr;
	let hasSubDepartments = false;

    if(showImage) {
		$("#slide1").show();
		$("#slide2").hide();
		showImage = false
		return
	}

	if (config1 == null || config1 == undefined || config2 == null || config2 === undefined || !config1.length || !config2.length) {
		return;
	}

	$(".drBg").hide();
	$(".drBg").removeClass("show");

	$(".drName").html("");
	$(".qualitifcation").html("");
	$(".designation").html("");
	$(".subdepartment").html("");
	//$(".drphoto").html("");
        $(".drphoto").attr("src", "img/doctor.png");
	$("#hdrText").html("");

	$("#slide1").hide();
	$("#slide2").show();
	slide = [...new Set(fullDeptList.map((item) => item.slide))]
	slide.sort();
	
	newDoctorArr1 = fullDeptList.filter(function (item) {
		index = config2.findIndex((doc) => doc.id === item.id)
		if(index >= 0 && item.slide === slide[slideIndex])
		{
			return true;
		}
		return false;
	});

	newDoctorArr = [...new Map(newDoctorArr1.map(item => [item['id'], item])).values()]

	newDoctorArr.sort((a, b) => {
		if (a.slide === b.slide) {
			return a.position < b.position ? -1 : 1;
		} else {
			return a.slide < b.slide ? -1 : 1;
		}
	});
    totalDocInCrntDept = newDoctorArr.length;

	k = 0;
	if (newDoctorArr[0].heading === 'Yes') {
		$("#hdrText").html(newDoctorArr[0].department);
		$('#hdrText').css("font-size", "36px");
		if (newDoctorArr[0].department.length >= 32) {
			$('#hdrText').css("font-size", "28px");
		} else if (newDoctorArr[0].department.length >= 28) {
			$('#hdrText').css("font-size", "32px");
		}
	}

	for (let i = pendingDocListStartIndex; i < totalDocInCrntDept; i += 1) {
		doctor_id = newDoctorArr[i].id;
		doctorDetails = extractDoctorDetails(doctor_id);

		if (doctorDetails !== null) {
			$(`#drphoto${k + 1}`).attr("src", doctorDetails.image);
			$(`#drphoto${k + 1}`).show();
			$(`#drName${k + 1}`).html(doctorDetails.name);
			$(`#drName${k + 1}`).show();

			$(`#qualification${k + 1}`).html(doctorDetails.specialization);
			if (doctorDetails.specialization.length >= 80) {
				$(`#qualification${k + 1}`).css("font-size", "1.2em");
			} else if (doctorDetails.specialization.length >= 36) {
				$(`#qualification${k + 1}`).css("font-size", "1.4em");
			} else {
				$(`#qualification${k + 1}`).css("font-size", "1.6em");
			}
			$(`#qualification${k + 1}`).show();

			$(`#designation${k + 1}`).html(doctorDetails.designation);
			if (doctorDetails.designation.length >= 80) {
				$(`#designation${k + 1}`).css("font-size", "1.0em");
			} else if (doctorDetails.designation.length >= 36) {
				$(`#designation${k + 1}`).css("font-size", "1.3em");
			} else {
				$(`#designation${k + 1}`).css("font-size", "1.6em");
			}
			$(`#designation${k + 1}`).show();

			subdepartment = newDoctorArr[i].subdepartment === "" || newDoctorArr[i].subdepartment === undefined ? myDepartArray[deptIndex] : newDoctorArr[i].subdepartment;
			$(`#subdepartment${k + 1}`).html(subdepartment);
			if (subdepartment !== '') {
				if (subdepartment.length >= 80) {
					$(`#subdepartment${k + 1}`).css("font-size", "1.0em");
				} else if (subdepartment.length >= 36) {
				$(`#subdepartment${k + 1}`).css("font-size", "1.3em");
				} else {
					$(`#subdepartment${k + 1}`).css("font-size", "1.6em");
				}
				$(`#subdepartment${k + 1}`).show();
			}
		
			$(`#doctor${k + 1}`).show();
			docListAvailable = true;
		}

		k += 1;
		if (k >= MAX_DOCTOR_PER_PAGE) {
		break;
		}
	}

	setTimeout(addShowClass, 500);

	pendingDocListStartIndex += k;
	if (pendingDocListStartIndex < totalDocInCrntDept) {
		docListPendingToShow = 1;
	} else {
		pendingDocListStartIndex = 0;
		docListPendingToShow = 0;
		slideIndex += 1;
		if (slideIndex >= slide.length) {
			slideIndex = 0;
			// myCallback();
			// mApp.onCompleted();
			showImage = true
		}
	}
}

function addShowClass() {
  $(".drBg").addClass("show");
}

function getDocListOnce() {
	let totalDept, index , k;

	totalDept = 0;
	mApp.getIDataByIndex(0);
	config1 = mApp.getConfig();

	mApp.getIDataByIndex(1);
	config2 = mApp.getConfig();
	if (config1 == null || config1 == undefined) {
		return;
	}
	if (config2 == null || config2 == undefined) {
		config2 = undefined;
	}

	k = 0;
	fullDeptList = [];
	for (let i = 0; i < config1.length; i += 1) {
		for (let j = 0; j < config1[i].members.value.length; j += 1) {
			index = config2.findIndex((item) => item.id === config1[i].members.value[j].id)
			if (index >= 0) {
				fullDeptList.push(config1[i].members.value[j]);
				fullDeptList[k].department = config1[i].name;
				k += 1;
			}
		}
	}

	for(let i = 0; i < config1[deptIndex].members.value.length; i += 1) {
		index = config2.findIndex((item) => item.id === config1[deptIndex].members.value[i].id)
		if (index >= 0) {
			totalDocInCrntDept += 1;
		}
	}

	myDepartArray = [];
  //totalDept = config1.length;
  // config1.sort();
	//config1.sort((a, b) =>
	//	a.position > b.position ? 1 : -1
	//);

	config2.sort((a, b) =>
		a.id > b.id ? 1 : -1
	);
  //for (let i = 0; i < totalDept; i++) {
  //  myDepartArray.push(config1[i].name);
  //}
}

function getDoctorList() {
  if (config1 == null || config1 == undefined) {
    getDocListOnce();
    if (config1 == null || config1 == undefined) {
      return;
    }
  }
  if (docListTimer) {
    window.clearInterval(docListTimer);
    // multiplePages();
  }
}

function app_init() {
  mApp = $.myapp();
  mApp.init();

  doctorListIndex = 0;
  mApp.setCallback(myCallback);
  myTimer();
  heartBeatTimer = window.setInterval(myTimer, 1000);

  $("#slide1").show();
  $("#slide2").hide();

  getDoctorList();
  docListTimer = window.setInterval(getDoctorList, DATA_FETCHING_DURATION);
  if (config1 !== null && config2 !== null) {
    multiplePages();
  }
  pageNumTimer = window.setInterval(multiplePages, PAGE_DISPLAY_DURATION);
}

function dateFromISO8601(isostr) {
  var parts = isostr.match(/\d+/g);
  return new Date(
    parts[2],
    parts[1] - 1,
    parts[0],
    parts[3],
    parts[4],
    parts[5]
  );
}

function myTimer() {
  try {
    mApp.devCheck(); //console.log("dev Hearbeat Update");
  } catch (e) {
    console.log("Heartbeat Error");
  }
}

function myCallback() {
  //handle stop event
  window.clearInterval(heartBeatTimer);
  window.clearInterval(pageNumTimer);
  window.clearInterval(docListTimer);
  console.log("Heart Beat Event call back cleared..");
}
