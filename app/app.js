var items = document.getElementById('items');
var items_section = document.getElementById('items-section');
var options = document.getElementsByClassName("options");
for(i=0;i<options.length;i++){options[i].addEventListener('change', save)}
document.addEventListener('keydown', function(e){interact(e)})
canvas.addEventListener('click', function(e){if(canvas.getAttribute("enable") == "true") set_pos(e)})

var id = {"maxId": 0, "current": -1};
var db = [];

function addItem(delay,lifetime, explosion, type, pos){
	types = []
	for(i=0;i<optionsFields.types.length;i++){
		types.push(optionsFields.types[i].value)
	}
	var delay = (typeof delay !== "undefined") ? delay : 20
	var lifetime = (typeof lifetime !== "undefined") ? lifetime : 40
	var explosion = (typeof explosion !== "undefined") ? explosion : ""
	var pos = (typeof pos !== "undefined") ? pos : [0,0]
	var type = (typeof type !== "undefined" && types.indexOf(type)>=0) ? type : "normal"
	var infos = {pos:pos,delay:delay,explosion:explosion,type:type,lifetime:lifetime}
	var obj = document.createElement('img');
	obj.src = 'assets/icons/fireworks/' + type + '.png'
	obj.setAttribute("class", "item-button")
	obj.setAttribute("width", "80")
	obj.setAttribute("onclick", "javascript: edit(this)")
	obj.setAttribute("clicked", "false")
	obj.setAttribute("UUID", id.maxId)
	db[id.maxId] = infos
	id.maxId++
	items.appendChild(obj)
	items.scroll({top:0,left:80*id.maxId,behavior:'smooth'})
	edit(obj)
}

function disabled(state, display, cursor, state2){
	var objs = document.getElementsByClassName("options");
	var text = document.getElementById("error-choose");
	for(i=0;i<objs.length;i++){
		if(state == true) objs[i].setAttribute("disabled", "true")
		if(state == false) try{objs[i].removeAttribute("disabled")}catch(err){return}
	}
	text.style.display = display;
	pos_pointer.style.cursor = cursor;
	pos_pointer.setAttribute("enable", state2)
}

function edit(obj){
	var status = obj.getAttribute("clicked")
	var objs = document.getElementsByClassName("item-button");
	for(i=0;i<objs.length;i++){objs[i].setAttribute("clicked","false")}
	if(status == "false"){
		obj.setAttribute("clicked", "true")
		disabled(false,"none", "pointer", "true")
		id.current = parseInt(obj.getAttribute("UUID"))
		type_select.value = db[id.current].type
		x.value = db[id.current].pos[0]
		y.value = db[id.current].pos[1]
		delay.value = db[id.current].delay
		lifetime.value = db[id.current].lifetime
		explosion.value = db[id.current].explosion
	} else {
		obj.setAttribute("clicked", "false")
		disabled(true,"block", "not-allowed", "false")
		id.current = -1;
	}
}

function save(){
	if(id.current >= 0){
		var obj = items.querySelectorAll('[uuid="' + id.current + '"]')[0];
		if(db[id.current].type != type_select.value) obj.src = "assets/icons/fireworks/" + type_select.value + ".png";
		db[id.current] = {pos:[x.value, y.value],delay:delay.value,explosion:explosion.value,type:type_select.value,lifetime:lifetime.value}
	}
}
function deleteItem(){
	var objs = items.querySelectorAll('.item-button');
	if(db.length >= 1 && objs.length >= 1){
		if(id.current >=0){
			var obj = items.querySelectorAll('[uuid="' + id.current + '"]')[0];
			items.removeChild(obj);
			db.splice(id.current,1);
			id.current -= 1;
			var newObj = items.querySelectorAll('[uuid="' + id.current + '"]')[0];
			if(typeof newObj == "undefined"){
				if(objs.length == 1){
					id.current = -1;
				} else {
					// newObj = items.querySelectorAll('.item-button')[0]
					id.current = -1
				}
			}
			if(id.current >= 0) edit(newObj)
		}
		if(db.length <= 0 || id.current <= -1){
			disabled(true,"block", "not-allowed", "false")
		}
	}
}
function activePos(){
	canvas.style.cursor = 'crosshair';
	canvas.setAttribute('enable', 'true')
}
function desactivePos(){
	canvas.style.cursor = 'default';
	canvas.setAttribute('enable', 'false')
}

function set_pos(e){
	db[id.current].pos = getMousePos(canvas,e);
	x.value = Math.floor(db[id.current].pos[0]-canvas.width/2);
	y.value = Math.floor(db[id.current].pos[1]-canvas.height/2);
	save()
}

function interact(e){
	var classObj = e.srcElement.classList[0]
	if(e.key == "Delete" && classObj !== "options") deleteItem();
	if(e.key == "D") console.log("Duplicate");
	if(e.key == "s" && classObj !== "options"){
		if(pos_pointer.getAttribute("enable") == "true" && canvas.getAttribute("enable") == "false"){
			activePos()
		} else {desactivePos()}
	}
	if(e.key == "Escape"){
		try{items.querySelectorAll('[uuid="' + id.current + '"]')[0].setAttribute("clicked", "false")}catch(err){};
		id.current = -1;
		disabled(true,"block", "not-allowed", "false");
		desactivePos();
	}
	if(e.key.toLowerCase() == "n" && classObj !== "options") addItem();
	if(e.key.toLowerCase() == "m" && classObj !== "options"){
		importSequenceFromClipboard()
	}
}

function importSequenceFromClipboard(){
	var command = document.querySelector('#import').value
	// var command = prompt("Importation commande:\nEspacez chaque objet avec \"/\" (Exemple: objet1/objet2).\nChaque objet comporte deux parties, séparées par \";\" (Exemple: " + instructions.mode[mode-1] + ").\nNotez que vous pouvez insérer des nombresà virgule en mettant un \".\" à la place d'une \",\".\n(faites \"Echap\" pour annuler)")
	if(command == null) return console.log("Annulation");
	var importData = importSequence(command)
	for(i in importData){
		addItem(importData[i].delay,importData[i].lifetime,importData[i].explosion,importData[i].type,importData[i].pos)
	}
}

function exportSequence(){
	var objs = document.getElementsByClassName("item-button");
	if(objs.length >= 1){
		if(true){
			var list = []
			for(i=0;i<objs.length;i++){
				temp = parseInt(objs[i].getAttribute("uuid"))
				if(typeof db[temp] !== "undefined"){
					obj = db[temp]
					// {pos:[0,0],delay:delay,explosion:"",type:"normal",lifetime:lifetime}
					list.push("{pos:[" + obj.pos + "],motion:[" + obj.motion + "],delay:" + obj.delay + ",explosion:[" + obj.explosion + "],type:\"" + obj.type +"\",lifetime:" + obj.lifetime +"}")
				}
			}
			console.log("[" + list.join(',') + "]")
			var content = 'data merge storage fireworks:fire {Show:[' + list.join(",") + ']}';
			var filename = "export_fireworksSimulator.mcfunction";

			var blob = new Blob([content], {
			 type: "text/plain;charset=utf-8"
			});

			saveAs(blob, filename);
		} else {
			console.error("Erreur, la base de donnée et les items ne sont pas synchronisés")
		}
	}	
}

setInterval(function(){
	ctx.clearRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black";
	for(i=0;i<db.length;i++){
		try{ctx.fillRect(db[i].pos[0]-dot.radius/2+canvas.width/2,db[i].pos[1]-dot.radius/2+canvas.height/2,dot.radius,dot.radius)}catch(err){}
	}
	ctx.fillStyle = "red";
	if(id.current > -1 && db.length >= 1) try{ctx.fillRect(db[id.current].pos[0]-dot.radius/2+canvas.width/2,db[id.current].pos[1]-dot.radius/2+canvas.height/2,dot.radius,dot.radius)}catch(err){}
}, 60)