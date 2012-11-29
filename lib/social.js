var link_tpl = new Ext.XTemplate('<a class="social-href" href="{ex_link}">{ex_title}</a>');

var android_link = G.android_play;
var ios_link = G.app_store;

var link = platform.Android ? android_link : ios_link;

var share_links = {
    message: 'Мне понравилось приложение «' + G.app_name + '». Скачайте его на ' + link,
    link: link,
    sms:  'sms:?body=Мне понравилось приложение «' + G.app_name + '». Скачайте его на ' + link,
    email:'mailto:?subject=Попробуй приложение ' + G.app_name + '!&body=Мне понравилось приложение «' + G.app_name + '» - все о развлечениях в родном городе: расписание сеансов кино с ценами, все кафе и рестораны, клубы и тусовки. Скачайте себе на ' + link
}

var social_reviews = {
    places:[
    {
        ex_title: new Ext.XTemplate('<tpl>Хочу пойти.</tpl>'),
        link: new Ext.XTemplate('<tpl if="ex_type">{link}</tpl>'),
        message: new Ext.XTemplate('Хочу пойти в «{name}»')
    },
    {
        ex_title: new Ext.XTemplate('<tpl>Мне понравилось.</tpl>'),
        link: new Ext.XTemplate('<tpl if="ex_type">{link}</tpl>'),
        message: new Ext.XTemplate('Мне понравилось в «{name}».')        
    },
    {
        ex_title: new Ext.XTemplate('<tpl>Не понравилось.</tpl>'),
        link: new Ext.XTemplate('<tpl if="ex_type">{link}</tpl>'),
        message: new Ext.XTemplate('Не понравилось в «{name}».')    
    }
    ],
    events:[
    {
        ex_title: new Ext.XTemplate('<tpl>Я собираюсь посмотреть. Кто со мной?</tpl>'),
        link: new Ext.XTemplate('<tpl if="ex_type">{link}</tpl>'),
        message: new Ext.XTemplate('Я собираюсь посмотреть «{name}». Кто со мной?')       
    },
    {
        ex_title: new Ext.XTemplate('<tpl>Советую посмотреть.</tpl>'),
        link: new Ext.XTemplate('<tpl if="ex_type">{link}</tpl>'),
        message: new Ext.XTemplate('Советую посмотреть «{name}».')       
    },
    {
        ex_title: new Ext.XTemplate('<tpl>Отстой!</tpl>'),
        link: new Ext.XTemplate('<tpl if="ex_type">{link}</tpl>'),
        message: new Ext.XTemplate('«{name}» - отстой!')
    }
    ]
}

function typeOfData(data){
    if(data == 'film' || data == 'theatreevent' || data == 'clubevent' || data == 'expoevent' || data == 'concertevent')
        return 'events';
    else
        return 'places';
}

var Social = function(data, data_type, link_type, social_network){

    data.ex_image = data.poster_img;
    var ex_title = new Ext.XTemplate(link_tpls[data_type][link_type].ex_title);
    data.ex_title = ex_title.apply(data);
    
    
    // create template
    link_type = link_type == undefined ? 0 : link_type;
    social_network = social_network == undefined ? 'vkontakte' : social_network;
    var tpl = new Ext.XTemplate(link_tpls[data_type][link_type][social_network]);

    // create link
    var link = tpl.apply(data);
    //console.log(link);
    return link;
}