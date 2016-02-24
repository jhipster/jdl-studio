var app = app || {}

$(function (){

	var storage = null
	var jqCanvas = $('#canvas')
	var viewport = $(window)
	var jqBody = $('body')
	var lineNumbers = $('#linenumbers')
	var lineMarker = $('#linemarker')
	var storageStatusElement = $('#storage-status')
	var tooltip = $('#tooltip')[0]
	var errorTooltip = $('#error-tooltip')[0]
	var textarea = document.getElementById('textarea')
	var imgLink = document.getElementById('savebutton')
	var fileLink = document.getElementById('saveTextbutton')
	var linkLink = document.getElementById('linkbutton')
	var canvasElement = document.getElementById('canvas')
	var canvasPanner = document.getElementById('canvas-panner')
	var canvasTools = document.getElementById('canvas-tools')
	var defaultSource = document.getElementById('defaultGraph').innerHTML
	var fileName;
	var zoomLevel = 0
	var offset = {x:0, y:0}
	var mouseDownPoint = false
	var vm = skanaar.vector

	var editor = CodeMirror.fromTextArea(textarea, {
		lineNumbers: true,
		mode: 'jdl',
		matchBrackets: true,
		autoCloseBrackets: true,
		theme: 'solarized dark',
		keyMap: 'sublime',
		extraKeys: {
			"Ctrl-Space": "autocomplete"
	   }
	});

	$(document).bind('keydown', function(e) {
		if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
			e.preventDefault()
			fileLink.click()
			return false
		}
	});

	var editorElement = editor.getWrapperElement()

	window.addEventListener('hashchange', reloadStorage);
	window.addEventListener('resize', _.throttle(sourceChanged, 750, {leading: true}))
	editor.on('changes', _.debounce(sourceChanged, 300))
	canvasPanner.addEventListener('mouseenter', classToggler(jqBody, 'canvas-mode', true))
	canvasPanner.addEventListener('mouseleave', classToggler(jqBody, 'canvas-mode', false))
	canvasTools.addEventListener('mouseenter', classToggler(jqBody, 'canvas-mode', true))
	canvasTools.addEventListener('mouseleave', classToggler(jqBody, 'canvas-mode', false))
	canvasPanner.addEventListener('mousedown', mouseDown)
	window.addEventListener('mousemove', _.throttle(mouseMove,50))
	canvasPanner.addEventListener('mouseup', mouseUp)
	canvasPanner.addEventListener('mouseleave', mouseUp)
	canvasPanner.addEventListener('wheel', _.throttle(magnify, 50))
	initImageDownloadLink(imgLink, canvasElement)
	initFileDownloadLink(fileLink)
	initToolbarTooltips()
	initDialog('.upload-dialog')
	reloadStorage()

	function initDialog(className) {

		$(className).magnificPopup({
			type: 'inline',
			fixedContentPos: false,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			removalDelay: 300,
			mainClass: 'my-mfp-slide-bottom'
		});
	}
	function classToggler(element, className, state){
		var jqElement = $(element)
		return _.bind(jqElement.toggleClass, jqElement, className, state)
	}

	function mouseDown(e){
		$(canvasPanner).css({width: '100%'})
		mouseDownPoint = vm.diff({ x: e.pageX, y: e.pageY }, offset)
	}

	function mouseMove(e){
		if (mouseDownPoint){
			offset = vm.diff({ x: e.pageX, y: e.pageY }, mouseDownPoint)
			sourceChanged()
		}
	}

	function mouseUp(){
		mouseDownPoint = false
		$(canvasPanner).css({width: '33%'})
	}

	function magnify(e){
		zoomLevel = Math.min(10, zoomLevel - (e.deltaY < 0 ? -1 : 1))
		sourceChanged()
	}

	app.magnifyViewport = function (diff){
		zoomLevel = Math.min(10, zoomLevel + diff)
		sourceChanged()
	}

	app.resetViewport = function (){
		zoomLevel = 0
		offset = {x: 0, y: 0}
		sourceChanged()
	}

	app.toggleSidebar = function (id){
		var sidebars = ['reference', 'about']
		_.each(sidebars, function (key){
			if (id !== key) $(document.getElementById(key)).toggleClass('visible', false)
		})
		$(document.getElementById(id)).toggleClass('visible')
	}

	app.confirmDiscardCurrentGraph = function (){
		$.magnificPopup.open({
			items: {
				src: '#discard-dialog'
			},
			type: 'inline',
			fixedContentPos: false,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			removalDelay: 300,
			mainClass: 'my-mfp-slide-bottom'
		});
	}
	app.dismissDialog = function (){
		$.magnificPopup.close();
	}

	app.discardCurrentGraph = function (){
		app.dismissDialog()
		setCurrentText(defaultSource)
		sourceChanged()
	}

	app.saveViewModeToStorage = function (){
		var question =
		'Do you want to overwrite the diagram in ' +
		'localStorage with the currently viewed diagram?'
		if (confirm(question)){
			storage.moveToLocalStorage()
			window.location = './'
		}
	}

	app.exitViewMode = function (){
		window.location = './'
	}

	app.importJDL = function() {
		app.dismissDialog()
		//Retrieve the first (and only!) File from the FileList object
		var f = document.getElementById('jdlFileInput').files[0]

		if(!f) {
			alert("Failed to load file")
		} else if (!f.type.match('text.*') && !f.name.endsWith('.jh')) {
			alert(f.name + " is not a valid JDL or text file.")
		} else {
			var r = new FileReader()
			r.onload = function(e) {
				var contents = e.target.result;
				console.log( "Got the file\n"
					+"name: " + f.name + "\n"
					+"type: " + f.type + "\n"
					+"size: " + f.size + " bytes\n"
					+ "starts with: " + contents.substr(0, contents.indexOf("\n"))
				)
				setCurrentText(contents)
			}
			r.readAsText(f)
		}
	}

	// Adapted from http://meyerweb.com/eric/tools/dencoder/
	function urlEncode(unencoded) {
		return encodeURIComponent(unencoded).replace(/'/g,'%27').replace(/"/g,'%22')
	}

	function urlDecode(encoded) {
		return decodeURIComponent(encoded.replace(/\+/g, ' '))
	}

	function setShareableLink(str){
		var base = '#view/'
		linkLink.href = base + urlEncode(str)
	}

	function buildStorage(locationHash){
		var key = 'nomnoml.lastSource'
		if (locationHash.substring(0,6) === '#view/')
		return {
			read: function (){ return urlDecode(locationHash.substring(6)) },
			save: function (){ setShareableLink(currentText()) },
			moveToLocalStorage: function (){ localStorage[key] = currentText() },
			isReadonly: true
		}
		return {
			read: function (){ return localStorage[key] || defaultSource },
			save: function (source){
				setShareableLink(currentText())
				localStorage[key] = source
			},
			moveToLocalStorage: function (){},
			isReadonly: false
		}
	}

	function initImageDownloadLink(link, canvasElement){
		link.addEventListener('click', downloadImage, false);
		function downloadImage(){
			var url = canvasElement.toDataURL('image/png')
			link.href = url;
		}
	}

	function initFileDownloadLink(link){
		link.addEventListener('click', downloadFile, false);
		function downloadFile(){
			var textToWrite = currentText()
			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'})
			var URL = window.URL || window.webkitURL
			if (URL != null) {
				link.href = window.URL.createObjectURL(textFileAsBlob)
			}
		}
	}



	function initToolbarTooltips(){
		$('.tools a').each(function (i, link){
			link.onmouseover = function (){ tooltip.textContent  = $(link).attr('title') }
			link.onmouseout = function (){ tooltip.textContent  = '' }
		})
	}

	function positionCanvas(rect, superSampling, offset){
		var w = rect.width / superSampling
		var h = (rect.height / superSampling) - 60
		jqCanvas.css({
			top: (300 * (1 - h/viewport.height()) + offset.y) + 50,
			left: 150 + (viewport.width() - w)/2 + offset.x,
			width: w,
			height: h
		})
	}

	function setFilename(filename){
		fileLink.download = filename + '.jh'
		imgLink.download = filename + '.png'
	}

	function reloadStorage(){
		storage = buildStorage(location.hash)
		editor.setValue(storage.read())
		sourceChanged()
		if (storage.isReadonly) storageStatusElement.show()
		else storageStatusElement.hide()
	}

	function currentText(){
		return editor.getValue()
	}

	function setCurrentText(value){
		return editor.setValue(value)
	}

	function handleError(e){
		lineNumbers.toggleClass('error', true)
		if (e.location){
			var lineHeight = parseFloat($(editorElement).css('line-height'))
			lineMarker.css('top', 3 + lineHeight*e.location.start.line)
			errorTooltip.textContent = e.message
		} else {
			throw e
		}
	}

	function sourceChanged(){
		try {
			lineMarker.css('top', -30)
			lineNumbers.toggleClass('error', false)
			errorTooltip.textContent = ''
			var superSampling = window.devicePixelRatio || 1
			var scale = superSampling * Math.exp(zoomLevel/10)

			var model = nomnoml.draw(canvasElement, currentText(), scale)
			positionCanvas(canvasElement, superSampling, offset)
			setFilename(model.config.title)
			storage.save(currentText())
		} catch (e){
			handleError(e)
		}
	}
})
