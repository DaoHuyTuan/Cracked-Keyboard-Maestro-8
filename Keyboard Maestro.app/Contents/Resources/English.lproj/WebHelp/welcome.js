
var first = 1;
Event.observe( document, 'dom:loaded', FinishedLoading );

var MyUtils = {
  supershow: function(element, html){
    return $(element).removeClassName('hidden').show();
  }
};
Element.addMethods(MyUtils);

var gKMCurrentPage = "Welcome";
var gKMPageStack = [];
var gKMRecentMacros = [];
var gKMMacroTriggerCount;

var gKMWatchingMacrosID;
var gKMTestingTimeoutID;
var gKMCheckMacroTimeoutID;

if ( !window.KeyboardMaestro ) {
	window.KeyboardMaestro = {};
	window.KeyboardMaestro.AutoOpenWelcome = function() {
		return true;
	}
	window.KeyboardMaestro.NoteAutoOpenChanged = function( autoopen ) {
	}
	window.KeyboardMaestro.InitalPage = function() {
		return "Assistance:Expected";
	}
	window.KeyboardMaestro.StartTestingExpected = function() {
  		gKMTestingTimeoutID = window.setTimeout(function() { 
  			CheckEngineIsRunning( true );
  			CheckEngineIsLaunchedAtLogin( false );
			gKMTestingTimeoutID = window.setTimeout(function() { 
				CheckEngineCanCommunicate( true );
				gKMTestingTimeoutID = window.setTimeout(function() { 
					CheckTranslocateOK( true );
					gKMTestingTimeoutID = window.setTimeout(function() { 
						CheckSecureInputOK( true );
						gKMTestingTimeoutID = window.setTimeout(function() { 
							CheckAccessibilityOK( true );
						},1000);
					},1000);
				},1000);
			},1000);
  		},1000);
	}
	window.KeyboardMaestro.StopTestingExpected = function() {
		window.clearTimeout( gKMTestingTimeoutID );
		gKMTestingTimeoutID = undefined;
	}
	window.KeyboardMaestro.StartWatchingMacros = function() {
		gKMWatchingMacrosID = new PeriodicalExecuter(function(pe) {
			var r = Math.floor((Math.random() * 5) + 1);
			var s = "Nothing";
			if ( r == 1 ) { s = "Do Something" }
			if ( r == 2 ) { s = "Fix Things" }
			if ( r == 3 ) { s = "Mess Up" }
			if ( r == 4 ) { s = "Change Stuff" }
			if ( r == 5 ) { s = "Womble Around" }
			MacroTriggered( "12345-6789", s );
		}, 1);
	}
	window.KeyboardMaestro.StopWatchingMacros = function() {
		gKMWatchingMacrosID.stop();
		gKMWatchingMacrosID = undefined;
	}
	window.KeyboardMaestro.AllMacros = function() {
		return [
			["First", [
				["12345-6781", "Do Something"],
				["12345-6782", "Fix Things"],
				]],
			["Second", [
				["12345-6783", "Mess Up"],
				["12345-6784", "Change Stuff"],
				["12345-6785", "Womble Around"],
				]],
			];
	}
	window.KeyboardMaestro.SelectedMacroUID = function() {
		return "12345-6784";
	}
	window.KeyboardMaestro.StartCheckingMacro = function( uid ) {
		if ( gKMCheckMacroTimeoutID ) {
			window.clearTimeout( gKMCheckMacroTimeoutID );
		}
  		gKMCheckMacroTimeoutID = window.setTimeout(function() { 
  			MacroGroupEnabled( true );
			MacroEnabled( true );
			MacroHasNoActions();
			gKMCheckMacroTimeoutID = window.setTimeout(function() { 
				MacroGroupActive( true );
				MacroHasNoEnabledActions();
				gKMCheckMacroTimeoutID = window.setTimeout(function() { 
					MacroHasTriggers( true );
					MacroHasActions();
					MacroGroupActive( false );
					gKMCheckMacroTimeoutID = window.setTimeout(function() { 
						MacroGroupActive( true );
						gKMCheckMacroTimeoutID = window.setTimeout(function() { 
							CheckMacroTriggered();
							gKMCheckMacroTimeoutID = window.setTimeout(function() { 
								CheckMacroTriggered();
								gKMCheckMacroTimeoutID = undefined;
							},1000);
						},1000);
					},1000);
				},1000);
			},1000);
  		},1000);
	}
	window.KeyboardMaestro.StopCheckingMacro = function() {
		window.clearTimeout( gKMCheckMacroTimeoutID );
		gKMCheckMacroTimeoutID = undefined;
	}
	window.KeyboardMaestro.PerformTutorial = function() {
		alert( "PerformTutorial" );
	}
	window.KeyboardMaestro.PerformQuitEngine = function() {
		alert( "PerformQuitEngine" );
	}
	window.KeyboardMaestro.PerformLaunchEngine = function() {
		alert( "PerformLaunchEngine" );
	}
	window.KeyboardMaestro.EditMacro = function( arg ) {
		alert( "EditMacro: " + arg );
	}
	window.KeyboardMaestro.LinkThru = function( arg ) {
		alert( "LinkThru: " + arg );
	}
}

function FinishedLoading() {
	if ( first ) {
		first = 0;

		var ip = window.KeyboardMaestro.InitalPage();
		var ips = ip.split( ":" );
		for (var i = 0; i < ips.length; i++) {
			SwitchTo( ips[i] );
		}

		$('autoopen').checked = window.KeyboardMaestro.AutoOpenWelcome();
	}
}

// MARK: Page Switching

function JustSwitchTo( arg )
{
	$(gKMCurrentPage).hide();
	if ( arg == "Welcome" ) {
		$('SideSupport').hide();
		$('SideAssistance').supershow();
	} else if ( arg == "Assistance" ) {
		$('SideAssistance').hide();
		$('SideSupport').supershow();
	}
	$(arg).supershow();
}

function FinishSwitchTo( arg )
{
	if ( gKMCurrentPage == "Expected" ) {
		StopTestingExpected();
	}
	if ( gKMCurrentPage == "Unexpected" ) {
		StopWatchingMacros();
	}
	if ( gKMCurrentPage == "Expected2" ) {
		StopExpected2();
	}
	gKMCurrentPage = arg;
	if ( gKMCurrentPage == "Welcome" ) {
		window.document.title = "Welcome to Keyboard Maestro"
	}
	if ( gKMCurrentPage == "Assistance" ) {
		window.document.title = "Assistance"
	}
	if ( gKMCurrentPage == "Expected" ) {
		StartTestingExpected();
	}
	if ( gKMCurrentPage == "Unexpected" ) {
		StartWatchingMacros();
	}
	if ( gKMCurrentPage == "Expected2" ) {
		StartExpected2();
	}
}

function SwitchTo( arg ) // FROM KM
{
	JustSwitchTo( arg );
	if ( arg == "Welcome" ) {
		gKMPageStack = [];
	} else if ( arg == "Assistance" ) {
		gKMPageStack = ["Welcome"];
	} else {
		gKMPageStack.push( gKMCurrentPage );
	}
	FinishSwitchTo( arg );
}

function SwitchBack()
{
	var n = gKMPageStack.pop();
	JustSwitchTo( n );
	FinishSwitchTo( n );
}

function CurrentPage() // FROM KM
{
	return gKMCurrentPage;
}

// MARK: Unexpected

function StartWatchingMacros()
{
	gKMRecentMacros = [];
	UpdateMacroDisplay();
	window.KeyboardMaestro.StartWatchingMacros();
}

function StopWatchingMacros()
{
	window.KeyboardMaestro.StopWatchingMacros();
}

function MacroTriggered( uid, name ) // FROM KM
{
	gKMRecentMacros.push( [uid, name] );
	if ( gKMRecentMacros.length > 3 ) {
		gKMRecentMacros.shift();
	}
	UpdateMacroDisplay();
}

function UpdateMacroDisplay() {
	if ( gKMRecentMacros.length == 0 ) {
		$("Macros0").show();
	} else {
		$("Macros0").hide();
	}
	if ( gKMRecentMacros.length >= 1 ) {
		UpdateMacroDisplayFor( "Macros1", gKMRecentMacros[0][0], gKMRecentMacros[0][1] );
	} else {
		$("Macros1").hide();
	}
	if ( gKMRecentMacros.length >= 2 ) {
		UpdateMacroDisplayFor( "Macros2", gKMRecentMacros[1][0], gKMRecentMacros[1][1] );
	} else {
		$("Macros2").hide();
	}
	if ( gKMRecentMacros.length >= 3 ) {
		UpdateMacroDisplayFor( "Macros3", gKMRecentMacros[2][0], gKMRecentMacros[2][1] );
	} else {
		$("Macros3").hide();
	}
}

function UpdateMacroDisplayFor( id, uid, name )
{
	$(id+"Link").innerHTML = name;
	$(id+"Link").onclick = function() { 
		EditMacro( uid )
	}
	$(id).show();
}

// MARK: Expected

function StartTestingExpected()
{
 	$("CheckEngine").className = "checking";
 	$("CheckEngineLogin").className = "checking";
 	$("ChecCommunicate").className = "checking";
 	$("CheckTranslocation").className = "checking";
 	$("CheckSecureInput").className = "checking";
 	$("CheckAccessibility").className = "checking";
 	$("CheckChecking").className = "checking";
	window.KeyboardMaestro.StartTestingExpected();
}

function StopTestingExpected()
{
	window.KeyboardMaestro.StopTestingExpected();
}

function CheckEngineIsRunning( good ) // FROM KM
{
	$("CheckEngine").className = good ? "good" : "bad";
	CheckContinue();
}

function CheckEngineIsLaunchedAtLogin( good ) // FROM KM
{
	$("CheckEngineLogin").className = good ? "good" : "bad";
}

function CheckEngineCanCommunicate( good ) // FROM KM
{
	$("ChecCommunicate").className = good ? "good" : "bad";
	CheckContinue();
}

function CheckTranslocateOK( good ) // FROM KM
{
	$("CheckTranslocation").className = good ? "good" : "bad";
	CheckContinue();
}

function CheckSecureInputOK( good ) // FROM KM
{
	$("CheckSecureInput").className = good ? "good" : "bad";
	CheckContinue();
}

function CheckAccessibilityOK( good ) // FROM KM
{
	$("CheckAccessibility").className = good ? "good" : "bad";
	CheckContinue();
}

function CheckContinue()
{
	var ids = ["CheckEngine","ChecCommunicate","CheckTranslocation","CheckSecureInput","CheckAccessibility"];
	var checkings = 0;
	var goods = 0;
	var bads = 0;
	for ( var i = 0; i < ids.length; i++ ) {
		var className = $(ids[i]).className;
		if ( className == "checking" ) {
			checkings++;
		} else if ( className == "good" ) {
			goods++;
		} else if ( className == "bad" ) {
			bads++;
		}
	}
	if ( checkings > 0 ) {
		$("CheckChecking").className = "checking";
	} else if ( bads > 0 ) {
		$("CheckChecking").className = "bad";
	} else {
		$("CheckChecking").className = "good";
	}
}

function RetryCheck()
{
	StartTestingExpected();
}

// MARK: Expected2

function StartExpected2()
{
	var ms = window.KeyboardMaestro.AllMacros();
	var s = window.KeyboardMaestro.SelectedMacroUID();
	var r = "";
	for (var i = 0; i < ms.length; i++) {
		var mg = ms[i];
		var mgname = mg[0];
		var mgm = mg[1];
		if ( mgm.length > 0 ) {
			r = r + "<optgroup label='" + mgname + "'>";
			for ( var j = 0; j < mgm.length; j++ ) {
				var m = mgm[j];
				var uid = m[0];
				var name = m[1];
				if ( !s ) {
					s = uid;
				}
				r = r + "<option value='" + uid + "'";
				if ( s == uid ) {
					r = r + " selected='selected'";
				}
				r = r + ">" + name + "</option>";
			}
			r = r + "</optgroup>";
		}
	}
	$("MacroSelection").innerHTML = r;
	MacroSelectionChanged();
}

function MacroSelectionChanged()
{
	window.KeyboardMaestro.StopCheckingMacro();
 	$("MacroGroupEnabled").className = "checking";
 	$("MacroGroupActive").className = "checking";
 	$("MacroEnabled").className = "checking";
 	$("MacroHasTriggers").className = "checking";
 	$("MacroHasActions").className = "checking";
 	$("MacroHasTriggered").className = "checking";
	gKMMacroTriggerCount = 0;
	var select = $('MacroSelection');
	window.KeyboardMaestro.StartCheckingMacro( select.options[select.selectedIndex].value );
}

function MacroGroupEnabled( good ) // FROM KM
{
	$("MacroGroupEnabled").className = good ? "good" : "bad";
}

function MacroGroupActive( good ) // FROM KM
{
	$("MacroGroupActive").className = good ? "good" : "bad";
}

function MacroEnabled( good ) // FROM KM
{
	$("MacroEnabled").className = good ? "good" : "bad";
}

function MacroHasTriggers( good ) // FROM KM
{
	$("MacroHasTriggers").className = good ? "good" : "bad";
}

function MacroHasActions() // FROM KM
{
	$("MacroHasActions").className = "good";
}

function MacroHasNoActions() // FROM KM
{
	$("MacroHasActions").className = "bad";
}

function MacroHasNoEnabledActions() // FROM KM
{
	$("MacroHasActions").className = "bad2";
}

function CheckMacroTriggered() // FROM KM
{
	gKMMacroTriggerCount++;
	if ( gKMMacroTriggerCount == 1 ) {
		$('TriggerCount').innerHTML = "once";
	} else {
		$('TriggerCount').innerHTML = "" + gKMMacroTriggerCount + " times";
	}
	$("MacroHasTriggered").className = "good";
}

function StopExpected2()
{
	window.KeyboardMaestro.StopCheckingMacro();
}

// MARK: Call Keyboard Maestro

function PerformTutorial()
{
	window.KeyboardMaestro.PerformTutorial();
}

function PerformQuitEngine()
{
	window.KeyboardMaestro.PerformQuitEngine();
}

function PerformLaunchEngine()
{
	window.KeyboardMaestro.PerformLaunchEngine();
}

function LinkThru( arg )
{
	window.KeyboardMaestro.LinkThru( arg );
}

function PerformAction( arg )
{
	window.KeyboardMaestro.PerformAction( arg );
}

function EditMacro( arg )
{
	window.KeyboardMaestro.EditMacro( arg );
}

