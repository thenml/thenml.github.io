const recipes = JSON.parse(data);
let mc_recipes = document.getElementById('recipes');

recipes.forEach(category => {
    let name = document.createElement("a");
    name.append(category.text);
    name.id = category.id;
    name.href = "#" + name.id;
    name.className = "mc-nbt"
    name.setAttribute("tr-tag", ".auto");
    
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
                arrow.innerHTML = '<div class="item-img" style="--x: 5;--y: 10""><div class="mc-tooltip"><div tr-tag="coolie.shapeless">Shapeless recipe</div></div></div>'
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
    text.setAttribute("tr-tag", ".auto");
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
let cells = document.getElementsByClassName('cell');

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
    if (button.getAttribute("onclick").includes("eraseCookie")) {
        button.setAttribute("onclick", 'resizeItems(this); setCookie("coolie-small")');
    }
    else {
        button.setAttribute("onclick", 'resizeItems(this); eraseCookie("coolie-small")');
    }
    for(const item of mcguis) {
        item.classList.toggle('mc-gui-size-s');
    }    
    button.firstElementChild.classList.toggle('item-img-next');
}
function changeTheme(button){
    if (button.getAttribute("onclick").includes("eraseCookie")) {
        button.setAttribute("onclick", 'changeTheme(this); setCookie("coolie-dark")');
    }
    else {
        button.setAttribute("onclick", 'changeTheme(this); eraseCookie("coolie-dark")');
    }
    for(const item of mcguis) {
        item.classList.toggle('mc-gui-dark');
    }    
    for(const item of cells) {
        item.classList.toggle('mc-gui-dark');
    }    
    button.firstElementChild.classList.toggle('item-img-next');
}

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('scroll', onScroll)

if(getCookie("coolie-small")){resizeItems(document.getElementById("settings.ch_size"));}
if(getCookie("coolie-dark")){changeTheme(document.getElementById("settings.ch_theme"));}



var translations = {
    "en":{
        "coolie.settings":"Settings",
        "coolie.settings.ch_size":"Change size",
        "coolie.settings.ch_theme":"Toggle dark mode",
        "coolie.shapeless":"Shapeless recipe"
    },
    "ru":{
        "coolie.settings":"Настройки",
        "coolie.settings.ch_size":"Изменить размер",
        "coolie.settings.ch_theme":"Переключить тёмный режим",
        "coolie.shapeless":"Рецепт без формы",
        
        "General Items":"Основные предметы",
        "Decoration / Joke Items":"Украшения / Шуточные прдеметы",
        //#region CooliePack Items
        "Rod of Discord":"Жезл раздора",
        "Right click to teleport":"ПКМ чтобы телепортироваться",
        "deals damage!":"наносит урон!",
        "Bizzare Cap":"Bizzare Cap",
        "Yare Yare Daze":"Yare Yare Daze",
        "thanks tapo4ken":"спасибо tapo4ken",
        "Placeable Creeper":"Установочный крипер",
        "Pocket Explosives":"Пачка живой взрывчатки у меня в кармане",
        "my reaction:":"моя реакция:",
        "3d_saul_saul_goodman.gif":"3d_saul_saul_goodman.gif",
        "Rickroll":"Рикролл",
        "40m blade":"40-метровый клинок",
        "Dirt Rod":"Жезл зeмли",
        "Right click to steal dirt":"ПКМ чтобы украсть землю",
        "Polish Cow":"Польская корова",
        "Grappling Hook":"Крюк-Кошка",
        "”Later Idiots!”":"Держись крепче!",
        "Pigman Sword":"Меч свинозомби",
        "the deadliest sword in skyblock":"самый смертельный меч",
        "Magnet":"Магнит",
        "Attracts items in a 4 block radius":"Притягивает предметы в радиусе 4 блоков",
        "Works in offhand!":"Работает во второй руке!",
        "Diamond Magnet":"Алмазный Магнит",
        "Attracts items in a 15 block radius":"Притягивает предметы в радиусе 15 блоков",
        "Teleport to ":"Телепортироваться к ",
        "Wormhole Potion":"Зелье червоточины",
        "Teleports to a player":"Телепортирует к игроку",
        "Reselect to switch selected player":"Выбери для смены игрока",
        "Ultra Haste Potion":"Зелье ультра спешки",
        "Enough to instamine Deepslate":"Достаточно чтобы мгновенно сломать Глубинный Сланец",
        "Omega Expierence Bottle":"Гиганское зелье опыта",
        "Gives a lot of Expierence":"Даёт очень много Опыта",
        "Rainbow concrete":"Радужный бетон",
        "Ice Rod":"Ледяной жезл",
        "Summons a block of ice":"Размещает блок льда",
        "Invincibility Star":"Звезда неуязвимости",
        "Invincibility for 10 seconds":"Неуязвимость на 10 секунд",
        "Escape Rope":"Верёвка для побега",
        "A long, durable rope.":"Длинная, прочная верёвка.",
        "Use it to escape instantly from a cave or a dungeon.":"Используется чтобы мгновенно сбежать из данжа или пещеры.",
        "Riddle":"Загадка",
        "Emerald Sword": "Изумрудный меч",
        "Treecapitator":"Трекапитейтор",
        "Long Fall Boots":"Сапоги прыгуна",
        "”I'm not gonna lie to you, it's expensive as hell.”":"Полезные чтобы не повредить броню",
        "Farming Scythe":"Фермерская коса",
        "Hold seeds in offhand to replant":"Садит семена из второй руки",
        "Potion of Health Boost":"Зелье здоровья",
        "Potion of Bad Omen":"Зелье дурного знамени",
        "Potion of Dolphins Grace":"Зелье грации дельфина",
        "Potion of Glowing":"Зелье свечения",
        "Potion of Heroes":"Зелье героя деревни",
        "Cat Ears":"Кошачьи уши",
        "nyaaa~~ :3":"ньяяя~~ :3",
        "Throw to propel yourself forwards":"Кинь чтобы броситься вперёд",
        "Right click to place a temporary ice block":"Использовать чтобы поставить временный блок льда",
        "Teleports you to the surface":"Телепортирует на поверхность",
        "Disables fall damage":"Выключает урон от падения",
        "Works on all seeds and nether wart":"Работает на всех семянах и незерском наросте",
        "Breaks wood in a chain":"Ломает дерево в цепочке",
        "From lvl 0 to lvl 20 in an instant":"От уровня 0 до 20 в мгновении",
        "You can disalow teleports to you via ":"Можно запретить телепорты к вам с помощью ",
        "this item is animated!":"этот предмет анимирован!",
        "Solve this riddle to craft...":"Реши эту загадку чтобы создать",
        " something?":" что-то?",
        "Flying Ender Chest":"Эндер-сундук с крыльями",
        "Right click to summon a temporary ender chest":"Использовать чтобы поставить временный эндер-сундук",
        //#endregion
        //#region mc Items
        "Stone":"Камень",
        "Sugar":"Сахар",
        "Paper":"Бумага",
        "Leather":"Кожа",
        "Purpur Block":"Пурпук",
        "Netherite Ingot":"Незеритовый слиток",
        "Eye of Ender":"Око Эндера",
        "Stick":"Палка",
        "String":"Нить",
        "Tripwire Hook":"Крюк",
        "Iron Ingot":"Железный слиток",
        "Iron Sword":"Железный меч",
        "Gunpowder":"Порох",
        "Green Dye":"Зелёный краситель",
        "Dirt":"Зесля",
        "Block of Emerald":"Изумрудный блок",
        "Block of Netherite":"Незеритовый блок",
        "Ladder":"Лестница",
        "Lead":"Поводок",
        "Slime Block":"Блок слизи",
        "Gold Ingot":"Золотой слиток",
        "Diamond Pickaxe":"Алмазная кирка",
        "Snowball":"Снежок",
        "Ice":"Лёд",
        "Block of Gold":"Золотой блок",
        "Leather Cap":"Кожаный шлем",
        "Purple Dye":"Фиолетовый краситель",
        "Glowstone Dust":"Светокаменная пыль",
        "Red Wool":"Красная шерсть",
        "Lightning Rod":"Громоотвод",
        "Blue Wool":"Синяя шерсть",
        "Redstone Block":"Редстоуновый блок",
        "Bottle o' Enchanting":"Пузырёк опыта",
        "Cooked Porkchop":"Жареная свинина",
        "Orange Wool":"Оранжевая шерсть",
        "Yellow Wool":"Жёлтая шерсть",
        "Green Wool":"Зелёная шерсть",
        "Purple Wool":"Фиолетовая шерсть",
        "Red Concrete":"Красный бетон",
        "Orange Concrete":"Оранжевый бетон",
        "Yellow Concrete":"Жёлтый бетон",
        "Lime Concrete":"Лаймовый бетон",
        "Light Blue Concrete":"Голубой бетон",
        "Magenta Concrete":"Пурпурный бетон",
        "Book":"Книга",
        "Note Block":"Нотный блок",
        "Wither Rose":"Роза визера",
        "Tinted Glass":"Тонированное стекло",
        "Pink Wool":"Розовая шерсть",
        "White Wool":"Белая шерсть",
        "Light Blue Wool":"Голубая шерсть",
        "Jungle Wood":"Тропическое дерево",
        "Blaze Rod":"Огненный стержень",
        "Diamond":"Алмаз",
        "Black Carpet":"Чёрный ковёр",
        "Black Wool":"Чёрная шерсть",
        "Iron Hoe":"Железная мотыга",
        "Bone Meal":"Костная мука",
        "Nether Brick":"Незерский кирпич",
        "Ominous Banner":"Зловещий флаг",
        "Water Bottle":"Бутылочка воды",
        "Emerald":"Изумруд",
        "Spectral Arrow":"Спектральная стрела",
        "Raw Cod":"Сырая треска",
        "Kelp":"Ламинария",
        "Seagrass":"Морская трава",
        "Glistering Melon Slice":"Сверкающий ломтик арбуза",
        "Golden Apple":"Золотое яблоко",
        "Feather":"Перо",
        "Phantom Membrane":"Мембрана фантома",
        "Ender Chest":"Эндер-сундук",
        //#endregion
        //#region extra mc
        "Any Leaves":"Любые листья",
        "Unbreakable":"Неразрушаемый",
        "When on Head:":"Когда надето на голову:",
        "When in Main Hand:":"Когда в ведущей руке:",
        "When Applied:":"При применении:",
        " 1 Attack Damage":" 1 Урон",
        " 3 Attack Damage":" 3 Урон",
        " 5 Attack Damage":" 5 Урон",
        " 6 Attack Damage":" 6 Урон",
        " 9 Attack Damage":" 9 Урон",
        " 10 Attack Damage":" 10 Скорость атаки",
        " 1 Attack Speed":" 1 Скорость атаки",
        " 1.2 Attack Speed":" 1.2 Скорость атаки",
        " 1.6 Attack Speed":" 1.6 Скорость атаки",
        " 3 Attack Speed":" 3 Скорость атаки",
        " 4 Attack Speed":" 4 Скорость атаки",
        "-50% Speed":"-50% Скорость",
        "+10% Speed":"+10% Скорость",
        "+60% Speed":"+60% Скорость",
        "+16 Max Health":"+16 Максимальное здоровье",
        "+1 Armor":"+1 Броня",
        "Luck V":"Удача V",
        "No Effects":"Без эффектов",
        "Haste VIII (1:00)":"Спешка VIII (1:00)",
        "Bad Omen (10:00)":"Дурное знамение (10:00)",
        "Bad Omen V (10:00)":"Дурное знамение V (10:00)",
        "Hero of the Village (1:00)":"Герой деревни (1:00)",
        "Glowing (5:00)":"Свечение (5:00)",
        "Dolphin's Grace (1:00)":"Грация дельфина (1:00)",
        "Health Boost IV (1:30)":"Прилив здоровья IV (1:30)",
        //#endregion
    }
}