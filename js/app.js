
(function() {
    'use strict';

	angular.module('jdlStudio', []);
	angular.module('jdlStudio').controller('workspaceController', WorkspaceController);

	WorkspaceController.$inject = ['$scope', '$document'];

	function WorkspaceController($scope, $document) {
		var app = this;

		var storage = null,
		jqCanvas = $('#canvas'),
		viewport = $(window),
		jqBody = $('body'),
		lineMarker = $('#linemarker'),
		tooltip = $('#tooltip')[0],
		imgLink = document.getElementById('savebutton'),
		fileLink = document.getElementById('saveTextbutton'),
		linkLink = document.getElementById('linkbutton'),
		canvasElement = document.getElementById('canvas'),
		canvasPanner = document.getElementById('canvas-panner'),
		canvasTools = document.getElementById('canvas-tools'),
		defaultSource,
		fileName,
		zoomLevel = 0,
		offset = {x:0, y:0},
		mouseDownPoint = false,
		editorElement, editor,
		vm = skanaar.vector;

		app.editorLoaded = editorLoaded;
		app.magnifyViewport = magnifyViewport;
		app.resetViewport = resetViewport;
		app.confirmDiscardCurrentGraph = confirmDiscardCurrentGraph;
		app.toggleSidebar = toggleSidebar;
		app.dismissDialog = dismissDialog;
		app.discardCurrentGraph = discardCurrentGraph;
		app.saveViewModeToStorage = saveViewModeToStorage;
		app.exitViewMode = exitViewMode;
		app.importJDL = importJDL;

		app.sidebarVisible = '';
		app.showStorageStatus = false;

		window.addEventListener('hashchange', reloadStorage);
		window.addEventListener('resize', _.throttle(sourceChanged, 750, {leading: true}));
		window.addEventListener('mousemove', _.throttle(mouseMove, 50));
		window.addEventListener('keydown', saveAs);
		canvasPanner.addEventListener('mouseenter', classToggler(jqBody, 'canvas-mode', true));
		canvasPanner.addEventListener('mouseleave', classToggler(jqBody, 'canvas-mode', false));
		canvasPanner.addEventListener('mousedown', mouseDown);
		canvasPanner.addEventListener('mouseup', mouseUp);
		canvasPanner.addEventListener('mouseleave', mouseUp);
		canvasPanner.addEventListener('wheel', _.throttle(magnify, 50));
		canvasTools.addEventListener('mouseenter', classToggler(jqBody, 'canvas-mode', true));
		canvasTools.addEventListener('mouseleave', classToggler(jqBody, 'canvas-mode', false));

		initImageDownloadLink(imgLink, canvasElement);
		initFileDownloadLink(fileLink);
		initToolbarTooltips();
		initDialog('.upload-dialog');

		function editorLoaded(_editor) {
			loadSample(reloadStorage);
			editor = _editor;
			editor.on('changes', _.debounce(sourceChanged, 300));
			editorElement = editor.getWrapperElement();
		}

		function magnifyViewport(diff){
			zoomLevel = Math.min(10, zoomLevel + diff);
			sourceChanged();
		}

		function resetViewport(){
			zoomLevel = 0;
			offset = {x: 0, y: 0};
			sourceChanged();
		}

		function toggleSidebar(id) {
			app.sidebar = 'partials/' + id + '.html';

			if (app.sidebarContent == id) {
				app.sidebarContent = null;
				app.sidebarVisible = '';
			} else {
				app.sidebarContent = id;
				app.sidebarVisible = 'visible';
			}
		}

		function confirmDiscardCurrentGraph(){
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
		function dismissDialog(){
			$.magnificPopup.close();
		}

		function discardCurrentGraph(){
			dismissDialog();
			loadSample(function(data) {
				setCurrentText(defaultSource);
				sourceChanged();
		    });

		}

		function saveViewModeToStorage(){
			var question =
			'Do you want to overwrite the diagram in ' +
			'localStorage with the currently viewed diagram?';
			if (confirm(question)){
				storage.moveToLocalStorage();
				window.location = './';
			}
		}

		function exitViewMode(){
			window.location = './';
		}

		function importJDL() {
			dismissDialog();
			//Retrieve the first (and only!) File from the FileList object
			var f = document.getElementById('jdlFileInput').files[0];

			if(!f) {
				alert("Failed to load file");
			} else if (!f.type.match('text.*') && !f.name.endsWith('.jh')) {
				alert(f.name + " is not a valid JDL or text file.");
			} else {
				var r = new FileReader();
				r.onload = function(e) {
					var contents = e.target.result;
					console.log( "Got the file\n"
						+"name: " + f.name + "\n"
						+"type: " + f.type + "\n"
						+"size: " + f.size + " bytes\n"
						+ "starts with: " + contents.substr(0, contents.indexOf("\n"))
					);
					setCurrentText(contents);
				};
				r.readAsText(f);
			}
			ga('send', 'event', 'JDL File', 'upload', 'JDL File upload');
			ga('jdlTracker.send', 'event', 'JDL File', 'upload', 'JDL File upload');
		}

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

		function loadSample(cb) {
			$.get('sample.jdl', function(data) {
				defaultSource = data;
				cb();
			});
		}

		function saveAs(e) {
			if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				fileLink.click();
				return false;
			}
		}

		function classToggler(element, className, state){
			var jqElement = $(element);
			return _.bind(jqElement.toggleClass, jqElement, className, state);
		}

		function mouseDown(e){
			$(canvasPanner).css({width: '100%'});
			mouseDownPoint = vm.diff({ x: e.pageX, y: e.pageY }, offset);
		}

		function mouseMove(e){
			if (mouseDownPoint){
				offset = vm.diff({ x: e.pageX, y: e.pageY }, mouseDownPoint);
				sourceChanged();
			}
		}

		function mouseUp(){
			mouseDownPoint = false;
			$(canvasPanner).css({width: '45%'});
		}

		function magnify(e){
			zoomLevel = Math.min(10, zoomLevel - (e.deltaY < 0 ? -1 : 1));
			sourceChanged();
		}

		// Adapted from http://meyerweb.com/eric/tools/dencoder/
		function urlEncode(unencoded) {
			return encodeURIComponent(unencoded).replace(/'/g,'%27').replace(/"/g,'%22');
		}

		function urlDecode(encoded) {
			return decodeURIComponent(encoded.replace(/\+/g, ' '));
		}

		function setShareableLink(str){
			var base = '#/view/';
			linkLink.href = base + urlEncode(str);
		}

		function initImageDownloadLink(link, canvasElement) {
			link.addEventListener('click', downloadImage, false);
			function downloadImage(){
				var url = canvasElement.toDataURL('image/png');
				link.href = url;
				ga('send', 'event', 'JDL Image', 'download', 'JDL Image download');
				ga('jdlTracker.send', 'event', 'JDL Image', 'download', 'JDL Image download');
			}
		}

		function initFileDownloadLink(link){
			link.addEventListener('click', downloadFile, false);
			function downloadFile(){
				var textToWrite = currentText();
				var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
				var URL = window.URL || window.webkitURL;
				if (URL != null) {
					link.href = window.URL.createObjectURL(textFileAsBlob);
				}
				ga('send', 'event', 'JDL File', 'download', 'JDL File download');
				ga('jdlTracker.send', 'event', 'JDL File', 'download', 'JDL File download');
			}
		}



		function initToolbarTooltips(){
			$('.tools a').each(function (i, link){
				link.onmouseover = function (){ tooltip.textContent  = $(link).attr('title') };
				link.onmouseout = function (){ tooltip.textContent  = '' };
			})
		}

		function positionCanvas(rect, superSampling, offset){
			var w = rect.width / superSampling;
			var h = (rect.height / superSampling) - 60;
			jqCanvas.css({
				top: (300 * (1 - h/viewport.height()) + offset.y) + 50,
				left: 150 + (viewport.width() - w)/2 + offset.x,
				width: w,
				height: h
			});
		}

		function setFilename(filename){
			fileLink.download = filename + '.jh';
			imgLink.download = filename + '.png';
		}

		function buildStorage(locationHash) {
			var key = 'jdlstudio.lastSource';
			if (locationHash.substring(0,7) === '#/view/') {
	    		return {
	    			read: function (){ return urlDecode(locationHash.substring(7)) },
	    			save: function (){ setShareableLink(currentText()) },
	    			moveToLocalStorage: function (){ localStorage[key] = currentText() },
	    			isReadonly: true
	    		};
			}
			return {
				read: function (){ return localStorage[key] || defaultSource },
				save: function (source){
					setShareableLink(currentText());
					localStorage[key] = source;
				},
				moveToLocalStorage: function (){},
				isReadonly: false
			};
		}

		function reloadStorage(){
			storage = buildStorage(location.hash);
			setCurrentText(storage.read());
			sourceChanged();
			$scope.$apply(function () {
				if (storage.isReadonly) app.showStorageStatus = true;
				else app.showStorageStatus = false;
			});

		}

		function currentText(){
			return app.jdlText;
		}

		function setCurrentText(value){
			$scope.$apply(function () {
				app.jdlText = value;
			});
		}

		function sourceChanged(){
			try {
				$scope.$apply(function () {
					app.lineMarkerTop = -35;
					app.hasError = false;
		            app.errorTooltip = '';
		        });
				var superSampling = window.devicePixelRatio || 1;
				var scale = superSampling * Math.exp(zoomLevel/10);

				var model = nomnoml.draw(canvasElement, currentText(), scale);
				positionCanvas(canvasElement, superSampling, offset);
				setFilename(model.config.title);
				storage.save(currentText());
			} catch (e){
				handleError(e);
			}
		}

		function handleError(e){
			var msg = '', top = 0;
			if (e.location){
				var lineHeight = parseFloat($(editorElement).css('line-height'));
				top = 35 + lineHeight * e.location.start.line;
				msg = e.message + ' -> line: ' + e.location.start.line;
			} else {
				throw e;
			}
			$scope.$apply(function () {
				app.lineMarkerTop = top;
				app.hasError = true;
				app.errorTooltip = msg;
			});
		}
	}
})();
