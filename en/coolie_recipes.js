let tooltips = document.getElementsByClassName('mc-tooltip');
const onMouseMove = (e) =>{
    for(const item of tooltips) {
        if (item.parentElement.matches(':hover')){
            item.style.display = 'block';
            item.style.left = e.pageX + 15 + 'px';
            item.style.top = e.pageY - 20 - window.pageYOffset + 'px';
        }else{
            item.style.display = 'none';
        }
    }
}
document.addEventListener('mousemove', onMouseMove);