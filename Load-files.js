//* JS
;(() => {
	const eleScript = document.createElement("script")
	eleScript.type = "module"
	//"text/javascript"
	eleScript.src = chrome.runtime.getURL("/scripts/mainScript.js")
	//chrome-extension://<extension id>/main.css
	eleScript.defer = true
	document.body.insertBefore(eleScript, null)
})()

//*CSS file loading
;(() => {
	const linkCSS = document.createElement("link")
	linkCSS.type = "text/css"
	linkCSS.href = chrome.runtime.getURL("JumpComments.css")
	linkCSS.rel = "stylesheet"
	document.head.append(linkCSS)
})()
