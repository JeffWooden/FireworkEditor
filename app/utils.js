function moveArray(list,old_index,new_index){
	if(new_index > list.length){
		var k = new_index - list.length +1;
		while(k--){
			list.push(undefined);
		}
	}
	list.splice(new_index, 0, list.splice(old_index,1)[0])
	return list;
}

function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return [(evt.clientX - rect.left) * scaleX, (evt.clientY - rect.top) * scaleY]
    // x:    // scale mouse coordinates after they have
    // y:      // been adjusted to be relative to element
}

function compare( a, b ) {
  if ( a.start < b.start ){
    return -1;
  }
  if ( a.start > b.start ){
    return 1;
  }
  return 0;
}

function extract(n){
  return (n - Math.floor(n)).toFixed(2)
}

function importSequence(command){
	var list = []
	n = 1;
	parts = command.split("/")
	for(i in parts){
		var fType;
		var fExplosion;
		var fPos;
		var fMotion;
		b = parts[i].split("*")
		if(b[1]){
			try{var obj = JSON.parse(b[1])}catch(err){var obj = {}}
			fType = (typeof obj.type !== "undefined") ? obj.type : "normal"
			fExplosion = (typeof obj.explosion !== "undefined") ? obj.explosion : ""
			fPos = (typeof obj.pos !== "undefined") ? obj.pos : [0,0,0]
			fMotion = (typeof obj.motion !== "undefined") ? obj.motion : [0,0,0]
		} else {
			fType = "normal"
			fExplosion = ""
		}
		a = b[0].split(";")
		a.splice(2,a.length-2)
		for(i in a){
			n = a[i]
			a[i] = Math.floor(n)*20+extract(n)*20
		}
		if(mode == 1) list.push({start:a[0],lifetime:a[1],index:n,explosion:fExplosion,type:fType,pos:fPos,motion:fMotion});
		if(mode == 2) list.push({start:a[0],lifetime:a[1]-a[0],index:n,explosion:fExplosion,type:fType,pos:fPos,motion:fMotion});
		if(mode == 3) list.push({start:a[0]-a[1],lifetime:a[1],index:n,explosion:fExplosion,type:fType,pos:fPos,motion:fMotion});
		n++;
	}
	list.sort(compare)
	if(list.length>1){
		for(i=1;i<list.length;i++){
			list[i-1].delay = list[i].start-list[i-1].start
		}
	}
	return list
}

// objs.sort( compare );

/*
Notes:
Une personne qui débute son spectacle devra rajouter x seconde(s) avant le début de la musique pour pouvoir éviter les desynchronisation*/