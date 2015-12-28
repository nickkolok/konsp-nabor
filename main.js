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
				'<span data-texcode="'+keyset[row][key][1]+'">'+keyset[row][key][0]+'</span>'
			);
			targetKey[0].onclick=generateClickHandler(keyset[row][key][1]);
			targetRow.append(targetKey);
		}
		targetElement.append(targetRow);
	} 
}
createKeyboardSet(keyboardSet);

$(function() {
	$( "#keyboard-container" ).sortable({ disable: true });
	$( ".keyboard-row" ).sortable({
		disable: true,
		connectWith: '.keyboard-row',
	});
});

function generateClickHandler(texcode){
	return function(){
		keyClicked(texcode);
	}
}

function keyClicked(texcode){
	$('#tex-text')[0].value+=texcode;
}
