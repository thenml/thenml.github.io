const recipes = JSON.parse(data);
let mc_recipes = document.getElementById('recipes');

recipes.forEach(category => {
    let name = document.createElement("a");
    name.append(category.text);
    name.id = category.id;
    name.href = "#" + name.id
    name.className = "mc-nbt"
    
    let gui = document.createElement("div");
    gui.className = "mc-gui"

    category.recipes.forEach(recipe => {
        let el = document.createElement("div");
        el.className = "mc-items"

        let grid = document.createElement("div");
        grid.className = "craft-grid"
        recipe.grid.forEach(item => {
            grid.appendChild( makeItem(item, 's') );
        });

        let arrow = document.createElement("div");
        arrow.className = "arrow item-img"
        arrow.style = "--x: 4;--y: 10"

        let result = document.createElement("div");
        result.appendChild( makeItem(recipe.result, 'm') );

        if (recipe.extra){
            if (recipe.extra.includes("shapeless")){
                arrow.className += " extra-icon"
                arrow.innerHTML = '<div class="item-img" style="--x: 5;--y: 10"><div class="mc-tooltip">Shapeless recipe</div></div>'
            }
        }


        el.appendChild(grid);
        el.appendChild(arrow);
        el.appendChild(result);

        gui.appendChild(el);
    });


    mc_recipes.append(name);
    mc_recipes.append(gui);
});


function makeText(json) {
    if (!json.text) return document.createElement("br");

    let text = document.createElement("div");
    text.append(json.text);
    text.className = "mctc-" + (json.color || "white")
    if (json.extra){
        if (json.extra.includes("inline")) text.className += " mctc-extra"
    }

    return text;
}


function makeItem(json, size) {
    let cell = document.createElement("div");
    cell.className = "cell cell-" + size

    if (!json.tooltip) return cell;

    let img = document.createElement("img");
    img.className = "item-img"
    img.style.setProperty('--x', json.texture[0]);
    img.style.setProperty('--y', json.texture[1]);
    
    let tooltip = document.createElement("div");
    tooltip.className = "mc-tooltip"
    json.tooltip.forEach(text =>{
        tooltip.append( makeText(text) );
    });

    cell.appendChild(img);
    cell.appendChild(tooltip)
    return cell;
}




let tooltips = document.getElementsByClassName('mc-tooltip');
let mcguis = document.getElementsByClassName('mc-gui');

const onMouseMove = (e) =>{
    for(const item of tooltips) {
        if (item.parentElement.matches(':hover')){
            item.style.display = 'block'
            item.style.left = e.pageX + 15 + 'px'
            item.style.top = e.pageY - 20 - window.pageYOffset + 'px'

            let rect = item.getBoundingClientRect();
            if (rect.right > (window.innerWidth || document.documentElement.clientWidth)-25){
                item.style.left = (window.innerWidth || document.documentElement.clientWidth) - rect.width - 25 + 'px'
            }
        }else{
            item.style.display = 'none'
        }
    }
}
const onScroll = () =>{
    for(const item of tooltips) {
        item.style.display = 'none'
    }
}
function resizeItems(button){
    for(const item of mcguis) {
        item.classList.toggle('mc-gui-size-s');
    }    
    button.firstElementChild.classList.toggle('item-img-next');
}

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('scroll', onScroll)