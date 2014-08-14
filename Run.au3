#include <EditConstants.au3>
#include <GUIConstantsEx.au3>
#include <WindowsConstants.au3>
#include <ButtonConstants.au3>
#include <StaticConstants.au3>
#include <constants.au3>
#include <WinAPI.au3>
#include <debug.au3>
#include "UIAWrappers.au3"

#Region ### START Koda GUI section ### Form=
$Form1 = GUICreate("GLSpace Launcher", 650, 400, 200, 200)
$Label1 = GUICtrlCreateLabel("Chrome location", 280, 10, 600, 20)
$Input1 = GUICtrlCreateInput("C:\Program Files (x86)\Google\Chrome\Application\", 25, 30, 600, 20)
$Label2 = GUICtrlCreateLabel("First Website", 280, 70, 600, 20)
$Input2 = GUICtrlCreateInput("www.facebook.com", 25, 90, 600, 20)
$Label3 = GUICtrlCreateLabel("Second Website", 280, 130, 600, 20)
$Input3 = GUICtrlCreateInput("www.ymail.com", 25, 150, 600, 20)
$Label4 = GUICtrlCreateLabel("Third Website", 280, 190, 600, 20)
$Input4 = GUICtrlCreateInput("www.gmail.com", 25, 210, 600, 20)
$Button1 = GUICtrlCreateButton("Launch Chrome!", 25, 250, 600, 120)
GUISetState(@SW_SHOW)
#EndRegion ### END Koda GUI section ###

While 1
	$nMsg = GUIGetMsg()
	Switch $nMsg
		Case $GUI_EVENT_CLOSE
Exit
	    Case $Button1

#AutoIt3Wrapper_UseX64=Y  ;Should be used for stuff like tagpoint having right struct etc. when running on a 64 bits os

$strChromeExeFolder="C:\Program Files (x86)\Google\Chrome\Application\"
;$strChromeExeFolder=$Input1
$strChromeStartup="--force-renderer-accessibility --enable-usermedia-screen-capturing --allow-http-screen-capture --disable-popup-blocking"
$strChromeExe=$strChromeExeFolder & "chrome.exe "

if fileexists($strChromeExe) Then
    if not processexists("chrome.exe") Then
        run($strChromeExe & $strChromeStartup,"", @SW_SHOWNORMAL )
        ProcessWait("chrome.exe")
        sleep(1000)
    endif
Else
    consolewrite("No clue where to find chrome on your system, please start manually:" & @CRLF )
    consolewrite($strChromeExe & $strChromeStartup & @CRLF)
EndIf

$oChrome=_UIA_getFirstObjectOfElement($UIA_oDesktop,"class:=Chrome_WidgetWin_1", $treescope_children)
$oChrome.setfocus()

if isobj($oChrome) Then
$oChromeToolbar=_UIA_getFirstObjectOfElement($oChrome,"name:=Google Chrome Toolbar" , $treescope_subtree)
$oChromeAddressBar=_UIA_getFirstObjectOfElement($oChromeToolbar,"controltype:=" & $UIA_EditControlTypeId , $treescope_subtree) ;works in chrome 29
$oValueP=_UIA_getpattern($oChromeAddressBar,$UIA_ValuePatternId)

$myText=""
$oValueP.CurrentValue($myText)
consolewrite("address: " & $myText & @CRLF)

$oChromeTabs=_UIA_getFirstObjectOfElement($oChrome,"controltype:=" & $UIA_TabControlTypeId, $treescope_subtree)
 _UIA_DumpThemall($oChromeTabs,$treescope_children)

dim $pCondition, $pTrueCondition
dim $pElements, $iLength

$UIA_oUIAutomation.CreateTrueCondition($pTRUECondition)

$oCondition=ObjCreateInterface($pTrueCondition, $sIID_IUIAutomationCondition,$dtagIUIAutomationCondition)

$oChromeTabs.FindAll($treescope_children, $oCondition, $pElements)
$oAutomationElementArray = ObjCreateInterFace($pElements, $sIID_IUIAutomationElementArray, $dtagIUIAutomationElementArray)

$oAutomationElementArray.Length($iLength)

_UIA_action($oChromeAddressBar,"leftclick")
_UIA_action($oChromeAddressBar,"setvalue using keys",GUICtrlRead($Input2) & "/{ENTER}^n")

$oChromeNewTab=_UIA_getFirstObjectOfElement($oChromeTabs,"controltype:=" & $UIA_ButtonControlTypeId, $treescope_subtree)
EndIf

$oChrome=_UIA_getFirstObjectOfElement($UIA_oDesktop,"class:=Chrome_WidgetWin_1", $treescope_children)
$oChrome.setfocus()

if isobj($oChrome) Then
$oChromeToolbar=_UIA_getFirstObjectOfElement($oChrome,"name:=Google Chrome Toolbar" , $treescope_subtree)
$oChromeAddressBar=_UIA_getFirstObjectOfElement($oChromeToolbar,"controltype:=" & $UIA_EditControlTypeId , $treescope_subtree) ;works in chrome 29
$oValueP=_UIA_getpattern($oChromeAddressBar,$UIA_ValuePatternId)

$myText=""
$oValueP.CurrentValue($myText)
consolewrite("address: " & $myText & @CRLF)

$oChromeTabs=_UIA_getFirstObjectOfElement($oChrome,"controltype:=" & $UIA_TabControlTypeId, $treescope_subtree)
 _UIA_DumpThemall($oChromeTabs,$treescope_children)

dim $pCondition, $pTrueCondition
dim $pElements, $iLength

$UIA_oUIAutomation.CreateTrueCondition($pTRUECondition)

$oCondition=ObjCreateInterface($pTrueCondition, $sIID_IUIAutomationCondition,$dtagIUIAutomationCondition)

$oChromeTabs.FindAll($treescope_children, $oCondition, $pElements)
$oAutomationElementArray = ObjCreateInterFace($pElements, $sIID_IUIAutomationElementArray, $dtagIUIAutomationElementArray)

$oAutomationElementArray.Length($iLength)

_UIA_action($oChromeAddressBar,"leftclick")
_UIA_action($oChromeAddressBar,"setvalue using keys",GUICtrlRead($Input3) & "/{ENTER}^n")

$oChromeNewTab=_UIA_getFirstObjectOfElement($oChromeTabs,"controltype:=" & $UIA_ButtonControlTypeId, $treescope_subtree)
EndIf

$oChrome=_UIA_getFirstObjectOfElement($UIA_oDesktop,"class:=Chrome_WidgetWin_1", $treescope_children)
$oChrome.setfocus()

if isobj($oChrome) Then
$oChromeToolbar=_UIA_getFirstObjectOfElement($oChrome,"name:=Google Chrome Toolbar" , $treescope_subtree)
$oChromeAddressBar=_UIA_getFirstObjectOfElement($oChromeToolbar,"controltype:=" & $UIA_EditControlTypeId , $treescope_subtree) ;works in chrome 29
$oValueP=_UIA_getpattern($oChromeAddressBar,$UIA_ValuePatternId)

$myText=""
$oValueP.CurrentValue($myText)
consolewrite("address: " & $myText & @CRLF)

$oChromeTabs=_UIA_getFirstObjectOfElement($oChrome,"controltype:=" & $UIA_TabControlTypeId, $treescope_subtree)
 _UIA_DumpThemall($oChromeTabs,$treescope_children)

dim $pCondition, $pTrueCondition
dim $pElements, $iLength

$UIA_oUIAutomation.CreateTrueCondition($pTRUECondition)

$oCondition=ObjCreateInterface($pTrueCondition, $sIID_IUIAutomationCondition,$dtagIUIAutomationCondition)

$oChromeTabs.FindAll($treescope_children, $oCondition, $pElements)
$oAutomationElementArray = ObjCreateInterFace($pElements, $sIID_IUIAutomationElementArray, $dtagIUIAutomationElementArray)

$oAutomationElementArray.Length($iLength)

_UIA_action($oChromeAddressBar,"leftclick")
_UIA_action($oChromeAddressBar,"setvalue using keys",GUICtrlRead($Input4) & "/{ENTER}^n")

$oChromeNewTab=_UIA_getFirstObjectOfElement($oChromeTabs,"controltype:=" & $UIA_ButtonControlTypeId, $treescope_subtree)
EndIf

$oChrome=_UIA_getFirstObjectOfElement($UIA_oDesktop,"class:=Chrome_WidgetWin_1", $treescope_children)
$oChrome.setfocus()

if isobj($oChrome) Then
$oChromeToolbar=_UIA_getFirstObjectOfElement($oChrome,"name:=Google Chrome Toolbar" , $treescope_subtree)
$oChromeAddressBar=_UIA_getFirstObjectOfElement($oChromeToolbar,"controltype:=" & $UIA_EditControlTypeId , $treescope_subtree) ;works in chrome 29
$oValueP=_UIA_getpattern($oChromeAddressBar,$UIA_ValuePatternId)

$myText=""
$oValueP.CurrentValue($myText)
consolewrite("address: " & $myText & @CRLF)

$oChromeTabs=_UIA_getFirstObjectOfElement($oChrome,"controltype:=" & $UIA_TabControlTypeId, $treescope_subtree)
 _UIA_DumpThemall($oChromeTabs,$treescope_children)

dim $pCondition, $pTrueCondition
dim $pElements, $iLength

$UIA_oUIAutomation.CreateTrueCondition($pTRUECondition)

$oCondition=ObjCreateInterface($pTrueCondition, $sIID_IUIAutomationCondition,$dtagIUIAutomationCondition)

$oChromeTabs.FindAll($treescope_children, $oCondition, $pElements)
$oAutomationElementArray = ObjCreateInterFace($pElements, $sIID_IUIAutomationElementArray, $dtagIUIAutomationElementArray)

$oAutomationElementArray.Length($iLength)

_UIA_action($oChromeAddressBar,"leftclick")
_UIA_action($oChromeAddressBar,"setvalue using keys","localhost:8080/launcher.html{ENTER}")

$oChromeNewTab=_UIA_getFirstObjectOfElement($oChromeTabs,"controltype:=" & $UIA_ButtonControlTypeId, $treescope_subtree)

EndIf
exit
	EndSwitch
WEnd