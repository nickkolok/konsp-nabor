var keyboardSet=[
	[
		['\\frac','\\frac{}{}'],
		['A','A'],
	],
	[
		['$\\in$','\\in'],
	],
];


function createKeyboardSet(keyset){
	var targetElement=$('#keyboard-container');
	for(var row=0; row<keyset.length; row++){
		var targetRow=$('<div class="keyboard-row"></div>');
		for(var key=0; key<keyset[row].length; key++){
			var targetKey=$(
				'<span class="keyboard-key" data-texcode="'+keyset[row][key][1]+'">'+keyset[row][key][0]+'</span>'
			);
			targetKey[0].onclick=generateClickHandler(keyset[row][key][1]);
			targetRow.append(targetKey);
		}
		targetElement.append(targetRow);
	}
	MathJax.Hub.Typeset('keyboard-container');
}

$(function() {
	createKeyboardSet(keyboardSet);
	$( "#keyboard-container" ).sortable({ disable: true });
	$( ".keyboard-row" ).sortable({
		disable: true,
		connectWith: '.keyboard-row',
	});
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

HTMLTextAreaElement.prototype.replaceSelectionWith = function(str){
	var value = this.value;
	var selectionStart = this.selectionStart;
	this.value = value.substr(0,this.selectionStart)+str+value.substr(this.selectionEnd);
	this.selectionStart = this.selectionEnd = selectionStart + str.length;
}
Object.defineProperty(HTMLTextAreaElement.prototype, 'replaceSelectionWith', {enumerable: false});
