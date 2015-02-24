$app.AppVarAttribute = 'data-var';
$app.Precision = 100000000;

window.addEventListener ('keypress', function (event) {
	if (event.keyCode == 13) {
		$app.update (event);
	}
});

var socket = io.connect('http://localhost:3000');

jQuery ('#gt-date').datetimepicker ({
	value: (new Date ()).dateFormat ('d.m.Y H:i:s'),
	mask: true,
	format: 'd.m.Y H:i:s'
});

jQuery ('#gu-date').datetimepicker ({
	mask: true,
	format: 'd.m.Y H:i:s'
});

socket.on ('swisseph result', function (result) {
    console.log (result);
	$copy ($app, result);
	$app.setVar ();
});

$app.update = function (event) {
	var dateVar;

	$app.varElements = $app.findNodesByAttr (document, $app.AppVarAttribute);

	$app.getVar ();

	if (event) {
		dateVar = event.target.getAttribute ($app.AppVarAttribute);
	} else {
		dateVar = '$app.date.gregorian.terrestrial';
	}

	$app.getGroupVar ('$app.date', dateVar);
	
    socket.emit ('swisseph', [{
    	func: 'calc',
    	args: [{
			date: $app.date,
			observer: $app.observer,
			body: $app.body
		}]
	}]);
};

$app.getGroupVar = function (varGroup, varName) {
	try {
		if (varName.indexOf (varGroup) == 0) {
			eval ('$app.varValue = ' + varName + '');
			eval ('delete ' + varGroup);
			$make (varName);
			eval ('' + varName + ' = $app.varValue');
		}
	} catch (exception) {
	}
};

$app.getVar = function () {
	for (var i = 0; i < $app.varElements.length; i ++) {
		var element = $app.varElements [i];
		var varName = element.getAttribute ($app.AppVarAttribute);
		try {
			$make (varName);
			if (
				element.tagName == 'INPUT' || element.tagName == 'SELECT'
			) {
				eval ('' + varName + ' = "' + element.value + '"');
			} else {
				eval ('delete ' + varName + '');
			}
		} catch (exception) {
		}
		element.setAttribute ('onchange', '$app.update (event)');
	}

	$app.date.gregorian.terrestrial = $app.parseDate ($app.date.gregorian.terrestrial);
	$app.date.gregorian.universal = $app.parseDate ($app.date.gregorian.universal);

	$app.date.julian.terrestrial = parseFloat ($app.date.julian.terrestrial);
	$app.date.julian.universal = parseFloat ($app.date.julian.universal);

	$app.observer.geographic.longitude = parseFloat ($app.observer.geographic.longitude);
	$app.observer.geographic.latitude = parseFloat ($app.observer.geographic.latitude);
	$app.observer.geographic.height = parseFloat ($app.observer.geographic.height);
};

$app.setVar = function () {
	$app.date.gregorian.terrestrial = $app.formatDate ($app.date.gregorian.terrestrial);
	$app.date.gregorian.universal = $app.formatDate ($app.date.gregorian.universal);

	$app.body.position.longitude.degreeMinuteSecond = $app.formatDegreeMinuteSecond ($app.body.position.longitude.decimalDegree);
	$app.body.position.latitude.degreeMinuteSecond = $app.formatDegreeMinuteSecond ($app.body.position.latitude.decimalDegree);

	for (var i = 0; i < $app.varElements.length; i ++) {
		var element = $app.varElements [i];
		try {
			if (element.tagName == 'INPUT') {
				element.value = eval ('(' + element.getAttribute ($app.AppVarAttribute) + ')');
			} else if (element.tagName != 'SELECT') {
				value = eval ('(' + element.getAttribute ($app.AppVarAttribute) + ')');
				if (typeof (value) == 'number') {
					value = Math.floor (value * $app.Precision) / $app.Precision;
				};
				element.innerText = value;
			}
		} catch (exception) {
		}
	}
};
