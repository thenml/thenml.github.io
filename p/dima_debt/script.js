function update(rn){
    var hours = Math.floor(Math.abs(rn.getTime() - 1676552400000) / 36e5);
    var days = Math.floor(Math.abs(rn.getTime() - 1676491200000) / 864e5);

    debt = 1191.69 - 400; // "выплата" 16.02 но я не принимаю >:)
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

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});



update(new Date());

var autoUpdate = setInterval(function(){
    rn = new Date();
    if(rn.getMinutes() === 0) {
        update(rn);
        $('#date').val(rn.toDateInputValue());
    }
},60000)


var translations = {}