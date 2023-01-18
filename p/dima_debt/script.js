function update(rn){
    var hours = Math.floor(Math.abs(rn.getTime() - 1674054000000) / 36e5);
    var days = Math.floor(Math.abs(rn.getTime() - 1673035200000) / 864e5);

    debt = 400;
    for (let i = 0; i < hours; i++) {
        debt *= 1.001;
    }
    for (let i = 0; i < days; i++) {
        debt *= 1.01;
    }
    debt = Math.round(debt*100) / 100
    $('.ammount').empty()
    $('.ammount').append(
        `<h2>${debt} руб</h2>`
    )
}

update(new Date());
setInterval(function(){
    rn = new Date();
    if(rn.getMinutes() === 0) {
        update(rn);
    }
},60000)

var translations = {}