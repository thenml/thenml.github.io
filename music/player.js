const lttrs = "ABCEGHIKLMNQRSTWXYZ"

const searchParamsp = new URLSearchParams(window.location.search);
let r = Number(searchParamsp.get("r")) || 15;
var s = searchParamsp.get("seed");

if (s){
    if ( !(lttrs.includes(s[0]) && lttrs.includes(s[1]) && s.length==2)){
        TSH=s=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return (((h^h>>>9)%361)+361)%361}
        s = TSH(s);
        s = lttrs[Math.floor(s/19)] + lttrs[s%19];
        searchParamsp.set("seed",s);
    }
    var seed = (lttrs.indexOf(s[0])*19 + lttrs.indexOf(s[1])%19);

    var inum = (Number(searchParamsp.get("idx")) || 1)-2;
}
else{
    var seed = Math.floor(Math.random() * 358) + 1;
    s = lttrs[Math.floor(seed/19)] + lttrs[seed%19];
    searchParamsp.set("seed",s);image.png

    var inum = -1;    
}

var randint = function(min, max) {
    var x = Math.sin(seed++) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min)) + min;
};
function biased_shuffle(m){
    var l = [...Array(m).keys()];

    for (let i = m; i > 0; i--) {
        var a = randint(Math.max(i-r,0), Math.min(i+r,m-1));
        var b = randint(Math.max(i-r,0), Math.min(i+r,m-1));
        [l[a], l[b]] = [l[b], l[a]];
    }
    return l
}



let thumbs = document.getElementsByClassName('player-thumb');
let btn_skip = document.getElementById('btn-skip');
let btn_r = document.getElementById('btn-r');
let btn_seed = document.getElementById('btn-seed');

btn_r.value = r;
btn_seed.value = s;

function loadNewVideo(){
    inum +=1;
    var num = shuffleList[inum];
    player.cueVideoById(videoList[num]);
    btn_skip.value = inum+1;
    for (let i = 0; i < 5; i++) {
        thumbs[i].src = 'https://img.youtube.com/vi/'+ videoList[shuffleList[i + Math.min(inum, videoCount-5)]] +'/1.jpg';        
        thumbs[i].parentElement.nextElementSibling.innerHTML = '#' + (i + Math.min(inum, videoCount-5)+1) + '<br>' + '('+(shuffleList[i + Math.min(inum, videoCount-5)]+1)+'/'+videoCount+')';
    }

    searchParamsp.set("idx",inum+1);
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParamsp.toString();
        window.history.pushState({path:newurl},'',newurl);
    }
}
function videoGoto(e){
    e = e || window.event;
    if(e.keyCode == 13) {
        var elem = e.srcElement || e.target;
        n = elem.value - 2;
        if (n > -2 && n < videoCount){
            inum = n;
            loadNewVideo();
        }
    }
}
function setR(e){
    e = e || window.event;
    if(e.keyCode == 13) {
        var elem = e.srcElement || e.target;
        if (elem.value > 0){
            searchParamsp.set("r",elem.value);
            window.location.search = searchParamsp;
        }
    }
}
function setSeed(e){
    e = e || window.event;
    if(e.keyCode == 13) {
        var elem = e.srcElement || e.target;
        n = elem.value.toUpperCase();
        if ( !(lttrs.includes(n[0]) && lttrs.includes(n[1]) && n.length==2)){
            if (n.length==0){n = Math.floor(Math.random() * 358) + 1;}
            else{
                TSH=s=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return (((h^h>>>9)%361)+361)%361}
                n = TSH(n);
            }
            n = lttrs[Math.floor(n/19)] + lttrs[n%19];
        }
        searchParamsp.set("seed",n);
        searchParamsp.set("idx",'');
        window.location.search = searchParamsp;
    }
}

//    https://developers.google.com/youtube/iframe_api_reference
//    This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//    This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var videoList, videoCount;
var userPlaylistURL = ''

function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
        events:
        {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },

        playerVars:
        {
            controls:1,
            autoplay:0,
            playsinline: 1
        }
    });
}

function onPlayerReady(event)
{
    // https://stackoverflow.com/questions/34635614/get-all-the-video-ids-from-a-youtube-playlist-into-a-php-array-using-youtube-ap
    // cue the playlist, to get the video's ids 
    /*
    */
    if (userPlaylistURL){
        event.target.cuePlaylist
        ({
            listType: 'playlist',
            list: userPlaylistURL,
            suggestedQuality:'small',
            autoplay: 0,
            index:0,
        });        
    }else{
        videoList = ids;
        videoCount = videoList.length;

        shuffleList = biased_shuffle(videoCount);
        console.log(shuffleList);

        loadNewVideo();
    }
}
function onPlayerStateChange(event)
{
    if(event.data == YT.PlayerState.CUED)
    {
        if (!videoList){
            videoList = event.target.getPlaylist();
            videoCount = videoList.length;
        }
        event.target.playVideo();
    }

    // randomize at each video ending
    if(event.data == 0)
    {
        loadNewVideo();
    }
}








function youtube_validate(url) {
    var regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
    return url.match(regExp)&&url.match(regExp).length>0;
}
//get playlist id from url
function youtube_playlist_parser(url){
    var reg = new RegExp("[&?]list=([a-z0-9_]+)","i");
    var match = reg.exec(url);

    if (match&&match[1].length>0&&youtube_validate(url)){
        return match[1];
    }else{
        return "nope";
    }

}    



var translations = {
    "en":{
        "st.seed":"seed",
        "st.rand":"randomness",
        "st.skip1":"skip to ",
        "st.skip2":" in queue",
        "st.warn":"the ui is not final",
    },
    "ru":{
        "st.seed":"сид",
        "st.rand":"случайность",
        "st.skip1":"перейти к ",
        "st.skip2":" в очереди",
        "st.warn":"этот интерфейс не финальный",
    }
}