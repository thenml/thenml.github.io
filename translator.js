function jsonConcat(o1, o2) {
    for (var lang in o2) {
        for (var key in o2[lang]){
            o1[lang][key] = o2[lang][key];
    }}
    return o1;
}
translations = jsonConcat({ // global translations
    "en":{
        "navbar.home":"Home",
        "navbar.support":"Support"
    },
    "ru":{
        "navbar.home":"Главная",
        "navbar.support":"Поддержка"
    }
}, translations);

selected_lang = searchParams.get("lang");
if (!selected_lang){ // if no search params present
    selected_lang = getCookie("lang");
    if (!selected_lang){
        selected_lang = window.navigator.language.substring(0,2);
        if (!["en","ru"].includes(selected_lang)) { // if unsupported language
            selected_lang = "en"
        }
    }
}
setCookie("lang",selected_lang);

let allDom = document.getElementsByTagName("*");
for(var i =0; i < allDom.length; i++){ // loop through all translatable emements (tr-tag)
    var elem = allDom[i];
    var key = elem.getAttribute("tr-tag");
    var translated = undefined;
    if(key != null) {
        translated = translations[selected_lang][key];
    }
    if (key == ".auto"){
        translated = translations[selected_lang][elem.textContent];
    }
    if (translated) elem.innerHTML = translated;
};

[...document.querySelectorAll('a')].forEach(e=>{
    //add window url params to to the href's params
    if (e.href.includes("thenml.github.io/h/")){
        const url = new URL(e.href);
        url.searchParams.set("lang",selected_lang);
        e.href = url.toString();
    }
})

document.getElementById('langSelect').value = selected_lang;

function langSelect(language) {
    setCookie("lang",language);
    location.reload();
}