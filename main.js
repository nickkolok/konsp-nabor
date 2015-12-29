var defaultKeyboardSet=[
	[
		['\\frac','\\frac{}{}'],
		['A','A'],
	],
	[
		['$\\in$','\\in'],
	],
];
//TODO: сделать хоть сколь-нибудь осмысленным


function createKeyboardSet(keyset){
	var targetElement=$('#keyboard-container');
	for(var row=0; row<keyset.length; row++){
		var targetRow=$('<div class="keyboard-row"></div>');
		for(var key=0; key<keyset[row].length; key++){
			var targetKey=$(
				'<span class="keyboard-key" data-texcode="'+
					keyset[row][key][1]+'" data-htmlcode="'+
					keyset[row][key][0]+'">'+keyset[row][key][0]+'</span>'
			);
			targetKey[0].onclick=generateClickHandler(keyset[row][key][1]);
			targetRow.append(targetKey);
		}
		targetElement.append(targetRow);
	}
	MathJax.Hub.Typeset('keyboard-container');
}

function makeKeyboardSortable(){
	$( "#keyboard-container" ).sortable({ disable: true });
	$( ".keyboard-row" ).sortable({
		disable: true,
		connectWith: '.keyboard-row',
	});
}

$(function() {
	loadKeyboardSetFromLocalStorage();
	makeKeyboardSortable();
	MathJax.Hub.Typeset("tex-result-wrapper");
});

function generateClickHandler(texcode){
	return function(){
		keyClicked(texcode);
	}
}

function keyClicked(texcode){
	$('#tex-text')[0].replaceSelectionWith(texcode);
}

function render(){
	$("#tex-result").text($('#tex-text').val());
	MathJax.Hub.Typeset("tex-result");
}

function getKeyboardSet(){
	var keyset=[];
	var rows=$('.keyboard-row');
	for(var row=0; row<rows.length; row++){
		keyset[row]=[];
		var keys=rows[row].getElementsByClassName('keyboard-key');//TODO: переписать на jQuery
		for(var key=0; key<keys.length; key++){
			keyset[row][key]=[
				keys[key].getAttribute('data-htmlcode'),
				keys[key].getAttribute('data-texcode')
			];
		}
	}
	return keyset;
}

function saveKeyboardSetToLocalStorage(){
	localStorage['texkeyboard-keyset']=JSON.stringify(getKeyboardSet());
}

function loadKeyboardSetFromLocalStorage(){
	var storedKeyboardSet;
	try{
		storedKeyboardSet=JSON.parse(localStorage['texkeyboard-keyset']);
		console.log(storedKeyboardSet);
		if(!storedKeyboardSet || storedKeyboardSet.length==0)
			storedKeyboardSet = defaultKeyboardSet;
	}catch(e){
		storedKeyboardSet = defaultKeyboardSet;
	}
	createKeyboardSet(storedKeyboardSet);
}

function addKeyboardRow(){
	$('#keyboard-container').append($('<div class="keyboard-row"></div>'));
	makeKeyboardSortable();
}

function onUnload(){
	saveKeyboardSetToLocalStorage();
}

HTMLTextAreaElement.prototype.replaceSelectionWith = function(str){
	var value = this.value;
	var selectionStart = this.selectionStart;
	this.value = value.substr(0,this.selectionStart)+str+value.substr(this.selectionEnd);
	this.selectionStart = this.selectionEnd = selectionStart + str.length;
}
Object.defineProperty(HTMLTextAreaElement.prototype, 'replaceSelectionWith', {enumerable: false});
