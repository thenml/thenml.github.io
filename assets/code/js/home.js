function rotateCard(event, element) {
	const x = event.pageX - element.offsetLeft;
	const y = event.pageY - element.offsetTop;
	const middleX = $(element).width() / 2;
	const middleY = $(element).height() / 2;

	const offsetX = ((x - middleX) / middleX) * 25;
	const offsetY = ((y - middleY) / middleY) * 25;
	$(element).css({
		"--rotateX": offsetX,
		"--rotateY": -offsetY
	});
}
function resetCard(event, element) {
	$(element).css({
		"--rotateX": 0,
		"--rotateY": 0
	});
}

$('#cards').children().each((index, card) => {
	$(card).mousemove((e) => {
		rotateCard(e, card);
	});
	$(card).mouseleave((e) => {
		resetCard(e, card);
	});
})



//#region background cubes
cubeAmmount = 40;
for (let i = 0; i < cubeAmmount; i++) {
	const width = (Math.random() * 50 + 25).toFixed();
	const posx = (Math.random() - 0.25).toFixed(4);
	const direction = i % 2 ? '--left' : '--right';
	const rotation = (Math.random() * 360).toFixed();

	cube = $("<li></li>").css({
		'width': width + 'px',
		'rotate': rotation + 'deg',
		'--mobile': (i/cubeAmmount).toFixed(4)
	});
	cube.css(direction, posx);

	const duration = Math.random() * 5 + 20;
	const rotate = Math.random() * 4 + 8;
	const start = -duration * Math.random();
	cube.css('animation', `
		cubes ${duration}s linear infinite ${start}s,
		cubes-init 1s ease-out,
		cubes-rotate ${rotate}s linear infinite 1s
	`);

	cube.appendTo($('#background'));
}
//#endregion