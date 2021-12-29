$OPT = @{
	'async' = 1;
	'start' = 0;
}

Write-Host -ForegroundColor green "Installing trainify..."
if ($OPT['async']) {
	Write-Host -ForegroundColor magenta "Async enabeled."
	Start-Process powershell { -noe npm install; npm start }
	Start-Process powershell { -noe Set-Location frontend; npm install --save @stripe/react-stripe-js @stripe/stripe-js; npm start }
}
else {
	npm install
	if (!$?) { "FAIL: " + "npm install"; exit }

	Set-Location frontend
	npm install --save @stripe/react-stripe-js @stripe/stripe-js
	if (!$?) { "FAIL: " + "npm install --save @stripe/react-stripe-js @stripe/stripe-js"; exit }

	if ($OPT['start']) {
		Start-Process powershell { -noe npm start }
		Start-Process powershell { -noe Set-Location ..; npm start }
	}

	Set-Location ..
}