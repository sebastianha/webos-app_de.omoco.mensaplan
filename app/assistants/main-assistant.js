function MainAssistant() {

}

var selectorsModel = {currentMensa: "Bitte warten..."};
var stations = [];
stations.push({label:$L("Universität Mensa"), value:"Universität Mensa"});
stations.push({label:$L("Universität Westend"), value:"Universität Westend"});
stations.push({label:$L("Fachhochschule Mensa"), value:"Fachhochschule Mensa"});

var menus = [];

foundMenus = []
var listModel = {listTitle:$L('Aktueller Speiseplan'), items:foundMenus};

MainAssistant.prototype.setup = function() {
	var url = "http://188.40.91.170/~sebastian/mensaplan/index_today_text.php";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.vrrRequestSuccess.bind(this),
		onFailure: this.vrrRequestFailure.bind(this)
	});

	this.controller.listen('mensaSelector', Mojo.Event.propertyChange, this.selectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('mensaSelector', {label: $L('Ort'), choices: stations, modelProperty:'currentMensa'}, selectorsModel);

	this.controller.setupWidget(
		"menuList",
		this.attributes = {
			itemTemplate: 'main/static-list-entry', listTemplate: 'main/static-list-container', emptyTemplate:'main/emptylist'
		},
		listModel
	);	

}

MainAssistant.prototype.setMensa = function(mensa) {
	foundMenus = [];

	if(mensa == "Universität Mensa") {
		foundMenus = [
				{header:$L("Menü 1"), menu:$L(menus[0])},
				{header:$L("Menü 2"), menu:$L(menus[1])},
				{header:$L("Menü Vegetarisch"), menu:$L(menus[2])},
				{header:$L("Menü Eintopf"), menu:$L(menus[3])},
			]
	}
	if(mensa == "Universität Westend") {
		foundMenus = [
				{header:$L("Menü 1"), menu:$L(menus[4])},
				{header:$L("Menü 2"), menu:$L(menus[5])},
				{header:$L("Menü 3"), menu:$L(menus[6])},
			]
	}
	if(mensa == "Fachhochschule Mensa") {
		foundMenus = [
				{header:$L("Menü Fleisch"), menu:$L(menus[7])},
				{header:$L("Menü Vegetarisch"), menu:$L(menus[8])},
				{header:$L("Menü Suppe"), menu:$L(menus[9])},
			]
	}
	listModel.items = foundMenus;
	this.controller.modelChanged(listModel);
}

MainAssistant.prototype.selectorChanged = function(event) {
	var cookie = new Mojo.Model.Cookie("MensaplanPrefs");
	cookie.put({ mensa: selectorsModel.currentMensa });

	this.setMensa(selectorsModel.currentMensa);
}

MainAssistant.prototype.vrrRequestSuccess = function(transport) {
	menus = [];
	menus.push(transport.responseText.split(";;;")[0]);
	menus.push(transport.responseText.split(";;;")[1]);
	menus.push(transport.responseText.split(";;;")[2]);
	menus.push(transport.responseText.split(";;;")[3]);
	menus.push(transport.responseText.split(";;;")[4]);
	menus.push(transport.responseText.split(";;;")[5]);
	menus.push(transport.responseText.split(";;;")[6]);
	menus.push(transport.responseText.split(";;;")[7]);
	menus.push(transport.responseText.split(";;;")[8]);
	menus.push(transport.responseText.split(";;;")[9]);

	var cookie = new Mojo.Model.Cookie("MensaplanPrefs");
	var MensaplanPrefs = cookie.get();
	if(MensaplanPrefs != null)	{
		mensa = MensaplanPrefs.mensa;
	}
	else {
		mensa = "Fachhochschule Mensa";
	}
	this.setMensa(mensa);
	selectorsModel.currentMensa = mensa;
	this.controller.modelChanged(selectorsModel);
}

MainAssistant.prototype.vrrRequestFailure = function(transport) {
	Mojo.Controller.errorDialog("Konnte die Menüs nicht abfragen.");
};

MainAssistant.prototype.activate = function(event) {

}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {

}
