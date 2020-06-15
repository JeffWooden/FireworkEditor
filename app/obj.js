type_select = document.getElementById("type-select")
x = document.getElementById("x")
y = document.getElementById("y")
pos_pointer = document.getElementById("pos-pointer")
delay = document.getElementById("delay")
lifetime = document.getElementById("lifetime")
explosion = document.getElementById("explosion")
index = document.getElementById("index")
mode = 1;
instructions = {mode:["Lancement;Explosion","Lancement;Durée de vie","Explosion;Durée de vie"]}
optionsFields = {types:[{"display":"Normale","value":"normal"},{"display":"Tirs multiples","value":"multi"},{"display":"Fontaine","value":"fountain"},{"display":"Chandelle romaine","value":"roman"},{"display":"Arbre","value":"tree"},{"display":"Explosions multiples","value":"big"},{"display":"Tirs à répétition","value":"repetition"}]}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var dot = {radius:5}

/*navigator.clipboard.writeText("<presse-papiers vide>").then(function() {
  // console.log("Yes")
}, function() {
  // console.log("No")
});*/