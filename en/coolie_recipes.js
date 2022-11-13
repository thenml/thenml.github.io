let tooltips = document.getElementsByClassName('mc-tooltip');
let mcguis = document.getElementsByClassName('mc-gui');

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
const onScroll = () =>{
    for(const item of tooltips) {
        item.style.display = 'none';
    }
}
function resizeItems(button){
    for(const item of mcguis) {
        item.classList.toggle('mc-gui-size-s')
    }    
    button.firstElementChild.classList.toggle('item-img-next')
}
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('scroll', onScroll);