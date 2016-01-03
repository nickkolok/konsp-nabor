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

function createKeyboardKey(props){
	var targetKey=$(
			'<span class="keyboard-key" data-texcode="'+
				props[1]+'" data-htmlcode="'+
				props[0]+'">'+props[0]+'</span>'
		);
	targetKey[0].onclick=generateClickHandler(props[1]);
	return targetKey;
}

function createKeyboardSet(keyset){
	var targetElement=$('#keyboard-container');
	for(var row=0; row<keyset.length; row++){
		var targetRow=$('<div class="keyboard-row"></div>');
		for(var key=0; key<keyset[row].length; key++){
			targetRow.append(createKeyboardKey(keyset[row][key]));
		}
		targetElement.append(targetRow);
	}
	MathJax.Hub.Typeset('keyboard-container');
}

function makeKeyboardSortable(){
	$( ".row-container" ).sortable({
		disable: true,
		connectWith: '.row-container',
	});
	$( ".keyboard-row" ).sortable({
		disable: true,
		connectWith: '.keyboard-row',
	});
	updateSaveButton();
}

$(function() {
	loadKeyboardSetFromLocalStorage();
	makeKeyboardSortable();
	MathJax.Hub.Typeset("tex-result-wrapper");
	chasStorage.domData.load();
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
	var rows=$('#keyboard-container .keyboard-row');
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

function addKeyboardKey(){
	var rows = $('#keyboard-container .keyboard-row');
	var lastRow = $(rows[rows.length-1]); //TODO: last на jQuery
	var newKey = createKeyboardKey([ $('#adding-html').val(), $('#adding-tex').val() ]);
	lastRow.append(newKey);
	makeKeyboardSortable();
	MathJax.Hub.Typeset(newKey[0]);
}

function updateSaveButton(){
	var blob = new Blob([JSON.stringify(getKeyboardSet()).replace(/\],\[/g,"],\r\n[")], {
		type: "text/plain;charset=utf-8"
	});
	var a = document.createElement('a');
	a.download = "saved.keyboard.json";
	a.href = URL.createObjectURL(blob);
	a.innerHTML = "<button>Сохранить клавиатуру в файл</button>";
	document.getElementById('span-save').innerHTML='';
	document.getElementById('span-save').appendChild(a);
}

function onUnload(){
	saveKeyboardSetToLocalStorage();
	chasStorage.domData.save();
}

HTMLTextAreaElement.prototype.replaceSelectionWith = function(str){
	var value = this.value;
	var selectionStart = this.selectionStart;
	this.value = value.substr(0,this.selectionStart)+str+value.substr(this.selectionEnd);
	this.selectionStart = this.selectionEnd = selectionStart + str.length;
}
Object.defineProperty(HTMLTextAreaElement.prototype, 'replaceSelectionWith', {enumerable: false});

//{{ Блок работы с картинкой-образцом
function scaleImagePlus(){
	$('#template-image')[0].width*=1.1;
}

function scaleImageMinus(){
	$('#template-image')[0].width/=1.1;
}

function updateImage(){
	$('#template-image')[0].src=$('#image-url').val();
}
//}}
