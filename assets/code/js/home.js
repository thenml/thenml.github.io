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
	$(card).mousemove( (e) => {
		rotateCard(e, card);
	});
	$(card).mouseleave( (e) => {
		resetCard(e, card);
	});
})



//#region background cubes
background = $('#background');

cubeAmmount = 40;
for (let i = 0; i < cubeAmmount; i++) {
	const width = (Math.random() * 50 + 25).toFixed();
	const posx = (Math.random() * 12 - 2).toFixed();
	const posy = (i * cubeAmmount / 4).toFixed();
	const direction = i % 2 ? 'left' : 'right';
	const rotation = (Math.random() * 360).toFixed();

	cube = $("<li></li>").css({
		'width': width + 'px',
		'height': width + 'px',
		'bottom': posy + '%',
		'rotate': rotation + 'deg',
	});
	cube.css(direction, posx + '%');
	cube.appendTo(background);
}

let previousTimeStamp;
function cubeAnimation(timestamp) {
	if (previousTimeStamp === undefined) {
		previousTimeStamp = timestamp;
	}
	const timeDelta = timestamp - previousTimeStamp;

	if (previousTimeStamp !== timestamp) {
		const move = 0.006 * timeDelta;
		const globalHeight = $(background).height();

		background.children().each((index, cube) => {
			const speed = parseInt($(cube).css('width')) / 50;
			const progress = parseFloat($(cube).css('bottom')) / globalHeight;

			const pos = (progress * 100 + move * speed) % 110;
			$(cube).css({
				'opacity': progress,
				'border-radius': progress * 50 + '%',
				'bottom': pos + '%'
			});
		});
	}

	previousTimeStamp = timestamp;
	window.requestAnimationFrame(cubeAnimation);
}

window.requestAnimationFrame(cubeAnimation);
setTimeout(function () {
	background.children().each((index, cube) => {
		$(cube).css('animation', 'cubes 8s linear infinite')
	});
}, 1000);
//#endregion