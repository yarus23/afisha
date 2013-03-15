/*
TODO:
- реализация refreshToken 
при входе в программу запрашиваем старые данные, пробуем токен, если он не срабатывает, то пробуем перед чайлдбраузером рефрештокен
мэйл ру и одноклассники

BUGS:
- русский язык в запросах (не все соц сети открываются с русским языком)

QQ:

OTHER:

*/

/*
OUTPUT POFILE DATA:
	identity: 
	provider:
	prov_name:
	first_name:
	last_name:
	full_name:
	nickname:
	photo:
	uid:
	dob:
	gender:
	email:
				
PROVIDERS: 
google
	https://code.google.com/apis/console/#project:372524027973:access
	client_id: 53528919723.apps.googleusercontent.com
	client_secret: ZH6-WJ04NppbMr1EheJCafFW
	redirect_uri: http://localhost
	
vkontakte	
	http://vk.com/app2897879
	app_id: 2897879
	secret_key: IrUxHTPnqmANo1e83yJK
	
facebook
	https://developers.facebook.com/apps/393705187314663
	app_id: 393705187314663
	secret_key: 29a676a067cc94ab1cf31eb3c419c11c
 
odnoklassniki
	http://www.odnoklassniki.ru/games/afishache
	app_id: 61780480
	public_key: CBADLPKEABABABABA
	secret_key: 3FCF4C6A81AFA4251B2FD6BA

mail.ru
	http://api.mail.ru/apps/my/672108
	app_id: 672108
	private_key: 50e99f07aa56c9eec14ace7d2c493d09 
	secret_key: 3603588fbd00bc70d08c260f639e5c7b 

twitter
	https://dev.twitter.com/apps/1918683
	consumer_key: Nn1OqYDWQRzHRW7NywjEA
	consumer_secret: cH3cbzQCGgGF8JFGu5ErYV6ne5PgNxUVwyG72vkQ
	access_token: 121027105-HawwgeYBuWH6R899bRi0wLjVATR8UXUgt1L2rXB6
	access_token_secret: 2rFl4p8HZzoENUsYx9aiM7sumXWOKdC9q70sAFESFU
*/

var Providers = ({
    // data
	_provider: {
        // data
        redirect_uri: G.providers._default.redirect_uri,
        storage: window.localStorage || window.sessionStorage,
        flags: {
            without_childBrowser: undefined
        },
        // methods
        md5: function (string) {
            return hex_md5(string);
        },
        saveToken: function (data) {
            var me = this;
            me.storage.setItem(me.name + '_token', JSON.stringify(data));
        },
        loadToken: function () {
            var me = this;
            var data = me.storage.getItem(me.name + '_token');
            if (data !== null) {
                data = JSON.parse(data);
            }
            return data;
        },
        removeToken: function () {
            var me = this;
            var data = me.storage.getItem(me.name + '_token');
            if (data !== null) {
                me.storage.removeItem(me.name + '_token');
            }
        },
        getTokenLink: function () {
            return '';
        },
        getProfileDataLink: function () {
            return '';
        },
        authorize: function (without_childBrowser) {
            var me = this;
            me.flags.without_childBrowser = without_childBrowser;
			
            // token and memory
            var token = me.loadToken();
            if (token === null && me.flags.without_childBrowser) {
                me.onTokenError();
                return;
            } else if (token) {
                me.onToken(token);
                return;
            };
			
            me.getToken();
        },
        getToken: function () {
            var me = this;
            window.plugins.childBrowser.onLocationChange = function (url) {
                if (url.indexOf(me.redirect_uri) == 0) {
                    //alert('window.plugins.childBrowser.onLocationChange __ ' + url); // debug
                    var response = url.getParamsFromUrl();
                    //alert(window.plugins.childBrowser.close);
                    window.plugins.childBrowser.close();
                    					
                    response.error ? me.onError(response.error) : me.onToken(response, true);
                }
            };
            window.plugins.childBrowser.showWebPage('http://afishache.co.cc/loading.html?' + me.getTokenLink(), {
                showLocationBar : false
            });
        },
        getProfileData: function () {
            var me = this;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    //alert('getProfileData.onreadystatechange __ ' + request.responseText); // debug	
                    var response = JSON.parse(request.responseText);
                    (request.status == 200 && response.error == undefined) ? me.onProfileData(me.formatProfileData(response)) : me.onTokenError();
                }
            }
            request.open("GET", me.getProfileDataLink(), true);
            request.send(null);
        },
        formatProfileData: function (data) {
            var me = this;
            return data;
        },
        logout: function() {
            var me = this;
            me.removeToken();
        },
        // events
        onTokenError: function () { 
            var me = this;

            // token and memory
            me.removeToken();
			
            // refreshToken????
			
            if (me.flags.without_childBrowser) {
                me.onError('token error');
                return;
            }
            me.getToken();
        },
        onError: function (error) {
        //alert('onError: ' + error); // debug
        },
        onToken: function (data, new_token) {
            var me = this;
			
            // token and memory
            me.saveToken(data);
            new_token ? me.flags.without_childBrowser = true : '';
			
            for (var i in data) {
                me[i] = data[i];
            }
            me.getProfileData();
        },
        onProfileData: function (data) {
            //alert('onProfileData: ' + JSON.stringify(data)); // debug
            var me = this;
            me.onSuccess(data);
        },
        onSuccess: function (data) {
        }
    },
    _list: [
    {
        //data
        name: 'vkontakte',
        redirect_uri: 'http://oauth.vk.com/blank.html',
        icon: 'config/resources/icons/social/iko_1.png',
        url: 'http://vkontakte.ru/',
        app_id: G.providers.vk.app_id,
        //methods
        getTokenLink: function () {
            var me = this;
            return 'http://oauth.vkontakte.ru/authorize'
            + '?client_id=' + me.app_id
            + '&scope=' + 'offline,wall'
            + '&redirect_uri=' + 'blank.html'//me.redirect_uri
            + '&display=' + 'touch'
            + '&response_type=' + 'token'	
        },
        getProfileDataLink: function () {
            var me = this;
            return 'https://api.vkontakte.ru/method/getProfiles'
            + '?uid=' + me.user_id
            + '&fields=' + 'sex,bdate,city,nickname,photo_big'
            + '&access_token=' + me.access_token
        },
        formatProfileData: function (data) {
            var me = this;
            data = data.response[0];
            data = {
                identity: me.url + 'id' + data.uid,
                provider: me.url,
                prov_name: me.name,
                first_name: data.first_name,
                last_name: data.last_name,
                full_name: data.first_name + ' ' + data.last_name,
                nickname: data.nickname,
                photo: data.photo_big,
                uid: data.uid,
                dob: data.bdate,
                gender: data.sex == 2 ? 'М' : (data.sex == 1 ? 'Ж' : ''),
                email: undefined
            };
            return data;
        },
        sendPost: function (post, link, that, callback) {
            var me = this;
            var link = 'https://api.vkontakte.ru/method/wall.post'
            + '?uid=' + me.user_id
            + '&message=' + post
            + '&attachments='+ link
            + '&access_token=' + me.access_token;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    var response = JSON.parse(request.responseText);
                    (request.status == 200 && response.error == undefined) ? callback.call(that, 'ok') : callback.call(that, 'error');           
                }
            }
            request.open("GET", link, true);
            request.send(null);
        }
    },
    {
        //data
        name: 'google',
        icon: 'config/resources/icons/social/iko_3.png',
        url: 'http://google.com/',
        client_id: G.providers.google.client_id,
        redirect_uri: 'http://localhost',
        //methods
        getTokenLink: function () {
            var me = this;
            return 'https://accounts.google.com/o/oauth2/auth'
            + '?client_id=' + me.client_id
            + '&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile' 
            + '&redirect_uri=' + me.redirect_uri
            + '&response_type=' + 'token'	
        },
        getProfileDataLink: function () {
            var me = this;
            return 'https://www.googleapis.com/oauth2/v1/userinfo'
            + '?access_token=' + me.access_token
        },
        formatProfileData: function (data) {
            var me = this;
            data = {
                identity: data.link,
                provider: me.url,
                prov_name: me.name,
                first_name: data.given_name,
                last_name: data.family_name,
                full_name: data.name,
                nickname: undefined,
                photo: data.picture,
                uid: data.id,
                dob: undefined,
                gender: data.sex == 'male' ? 'М' : (data.sex == 'female' ? 'Ж' : ''),
                email: data.email
            };
            return data;
        },
    },
    {
        //data
        name: 'facebook',
        icon: 'config/resources/icons/social/iko_2.png',
        url: 'http://facebook.com/',
        app_id: G.providers.fb.app_id,
        //methods
        getTokenLink: function () {
            var me = this;
            return 'https://www.facebook.com/dialog/oauth'
            + '?client_id=' + this.app_id  
            + '&scope=' + 'publish_stream' 
            + '&redirect_uri=' + this.redirect_uri 
            + '&display=' + 'touch' 
            + '&response_type=' + 'token'
        },
        getProfileDataLink: function () {
            var me = this;
            return 'https://graph.facebook.com/me'
            + '?access_token=' + this.access_token	
        },
        formatProfileData: function (data) {
            var me = this;
            data = {
                identity: data.link,
                provider: me.url,
                prov_name: me.name,
                first_name: data.first_name,
                last_name: data.last_name,
                full_name: data.name,
                nickname: data.username,
                photo: 'https://graph.facebook.com/' + data.id + '/picture',
                uid: data.id,
                dob: data.birthday,
                gender: data.sex == 'male' ? 'М' : (data.sex == 'female' ? 'Ж' : ''),
                email: data.email
            };
            return data;
        },
        sendPost: function (post, link, that, callback) {
            var me = this;
            var link = 'https://graph.facebook.com/me/feed'
            + '?access_token=' + this.access_token
            + "&message=" + post
            + "&link=" + link;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    var response = JSON.parse(request.responseText);
                    (request.status == 200 && response.error == undefined) ? callback.call(that, 'ok') : callback.call(that, 'error');           
                }
            }
            request.open("POST", link, true);
            request.send(null);
        }		
    },
    {
        //data
        name: 'odnoklassniki',
        icon: 'config/resources/icons/social/iko_5.png',		
        url: 'http://odnoklassniki.ru/',
        app_id: G.providers.odnoklassniki.app_id,
        secret_key: G.providers.odnoklassniki.secret_key,
        public_key: G.providers.odnoklassniki.public_key,
        //methods
        getProfileDataLink: function () {
            var me = this;
            var params = {
                'application_key': me.public_key,
            };
            var sig_string = '';
            for (var i in params) {
                sig_string += i + '=' + params[i];
            }
            return 'http://api.odnoklassniki.ru/api/users/getCurrentUser'
            + '?application_key=' + me.public_key
            + '&access_token=' + me.access_token
            + '&sig=' + me.md5(sig_string + me.md5(me.access_token + me.secret_key));
        },
        getTokenLink: function () {
            var me = this;
            return 'http://odnoklassniki.ru/oauth/authorize'
            + '?client_id=' + me.app_id
            + '&scope=' + 'VALUABLE ACCESS'
            + '&redirect_uri=' + me.redirect_uri
            + '&response_type=' + 'code'	
        },
        formatProfileData: function (data) {
            var me = this;
            data = {
                identity: me.url + 'profile/' + data.uid,
                provider: me.url,
                prov_name: me.name,
                first_name: data.first_name,
                last_name: data.last_name,
                full_name: data.name,
                nickname: undefined,
                photo: data.pic_2,
                uid: data.uid,
                dob: data.birthday,
                gender: data.sex == 'male' ? 'М' : (data.sex == 'female' ? 'Ж' : ''),
                email: undefined
            };
            return data;
        },
        _getTokenLink: function (data) {
            var me = this;
            return 'http://api.odnoklassniki.ru/oauth/token.do'
            + '?client_id=' + me.app_id
            + '&code=' + data.code
            + '&redirect_uri=' + me.redirect_uri
            + '&grant_type=' + 'authorization_code'	
            + '&client_secret=' + me.secret_key
        },
        // events
        onToken: function (data, new_token) {
            var me = this;
				
            // old token
            if (!new_token) {
                me.__proto__.onToken.call(me, data);
                return;
            }
				
            // get token
            var me = this;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    //alert('onToken.onreadystatechange __ ' + request.responseText); // debug	
                    var response = JSON.parse(request.responseText);
                    (request.status == 200 && response.error == undefined) ? me.__proto__.onToken.call(me, response) : me.onTokenError();
                }
            }
            request.open("POST", me._getTokenLink(data), true);
            request.send(null);				
        },
    },
    {
        //data
        name: 'mail.ru',
        icon: 'config/resources/icons/social/iko_6.png',				
        url: 'http://mail.ru/',
        app_id: G.providers.odnoklassniki.app_id,
        secret_key: G.providers.odnoklassniki.secret_key,
        //methods
        getTokenLink: function () {
            var me = this;
            return 'https://connect.mail.ru/oauth/authorize'
            + '?client_id=' + me.app_id
            + '&redirect_uri=' + me.redirect_uri
            + '&response_type=' + 'token'	
            + '&display=' + 'mobile'	
        },
        getProfileDataLink: function () {
            var me = this;
            var params = {
                'app_id': me.app_id,
                'method': 'users.getInfo',
                'secure': 1,
                'session_key': me.access_token
            };
            var sig_string = '';
            for (var i in params) {
                sig_string += i + '=' + params[i];
            }
            return 'http://www.appsmail.ru/platform/api'
            + '?app_id=' + me.app_id
            + '&method=' + 'users.getInfo'
            + '&secure=' + 1
            + '&session_key=' + me.access_token
            + '&sig=' + me.md5(sig_string + me.secret_key);
        },
        formatProfileData: function (data) {
            var me = this;
            data = data[0];
            data = {
                identity: data.link,
                provider: me.url,
                prov_name: me.name,
                first_name: data.first_name,
                last_name: data.last_name,
                full_name: data.first_name + ' ' + data.last_name,
                nickname: data.nick,
                photo: data.pic,
                uid: data.uid,
                dob: data.birthday,
                gender: data.sex == 0 ? 'М' : (data.sex == 1 ? 'Ж' : ''),
                email: undefined
            };
            return data;
        },
    },
    {
        //data
        name: 'twitter',
        url: 'http://twitter.com/',
        icon: 'config/resources/icons/social/iko_4.png',		
        consumer_key: G.providers.twitter.consumer_key,
        consumer_secret: G.providers.twitter.consumer_secret,
        //methods
        getToken: function () {
            var me = this;
            me.oauth = OAuth(me.getTokenParams());
            me.oauth.get('https://api.twitter.com/oauth/request_token',
                function (data) {
                    data = data.text;
					data = data.getParamsFromUrl();
					data.error ? me.onError('token error') : (function () {
                        for (var i in data) {
                            me[i] = data[i];
                        }
                        me.__proto__.getToken.call(me);
                    })();
                },
                function () {
                    me.onError('token error');
                }
                );
        },
        getTokenParams: function () {
            var me = this;
            return {
                consumerKey: me.consumer_key,
                consumerSecret: me.consumer_secret,
                callbackUrl: me.redirect_uri
            };
        },
        getAccessTokenParams: function () {
            var me = this;
            return {
                consumerKey: this.consumer_key,
                accessTokenKey: this.oauth_token,
                accessTokenSecret: this.oauth_token_secret,
                consumerSecret: this.consumer_secret,
                callbackUrl: this.redirect_uri
            };
        },
        getTokenLink: function () {
            var me = this;
            return 'http://api.twitter.com/oauth/authorize' 
            + '?oauth_token=' + me.oauth_token	
        },
        getAccessTokenLink: function () {
            var me = this;
            return 'https://api.twitter.com/oauth/access_token'
            + '?oauth_verifier=' + me.oauth_verifier
            + '&oauth_token=' + me.oauth_token
            + '&oauth_token_secret=' + me.oauth_token_secret
        },
        getProfileDataLink: function () {
            var me = this;
            return 'https://api.twitter.com/1/account/verify_credentials.json';
        },
        formatProfileData: function (data) {
            var me = this;
            data = {
                identity: me.url + data.screen_name,
                provider: me.url,
                prov_name: me.name,
                first_name: undefined,
                last_name: undefined,
                full_name: data.name,
                nickname: data.screen_name,
                photo: data.profile_image_url,
                uid: data.id,
                dob: undefined,
                gender: undefined,
                email: undefined
            };
            return data;
        },
        getProfileData: function () {
            var me = this;
            me.oauth = OAuth(me.getAccessTokenParams());
            me.oauth.get(me.getProfileDataLink(),
                function(data) {
                    data = data.text;
                    data = JSON.parse(data);
                    data.error ? me.onError('token error') : me.onProfileData(me.formatProfileData(data));
                },
                function (data) {
                    me.onError('token error');
                }
                );

        },
        sendPost: function (post, link, that, callback) {
            var me = this;
            me.oauth = OAuth(me.getAccessTokenParams());
            me.oauth.post('https://api.twitter.com/1/statuses/update.json', {
                status: post + ' via @afishache ' + link
                },
            function(data) {
                data = data.text;
                callback.call(that, 'ok');      
            },
            function (data) {
                 callback.call(that, 'error');     
            }
            );
        },			
        // events
        onToken: function (data, new_token) {
            var me = this;
				
            if (!new_token) {
                me.__proto__.onToken.call(me, data);
                return;
            };
				
            for (var i in data) {
                me[i] = data[i];
            }
				
            me.oauth.get(me.getAccessTokenLink(),
                function (data) {
                    data = data.text;
                    data = data.getParamsFromUrl();
                    data.error ? me.onError('token error') : me.__proto__.onToken.call(me, data, true);
                },
                function (data) {
                    me.onError('token error');
                }
                );
        },
    }
    ],
    // methods
    get: function (index) {
        var me = this;
        return index !== undefined ? me._list[index] : me._list;
    },
    _init: function () {
        var me = this;
        for (var i = 0; i < me._list.length; i ++) {
            me._list[i].__proto__ = me._provider; // наследование
        }
        return me;
    }
})._init();

var Auth = {
    // data
	
    // methods
    login: function (provider, that, success, error) {
        var me = this;
        success = success || me.onSuccess;
        error = error || me.onError;
        that = that || me;
        Providers._provider.onSuccess = function (data) {
            success.call(that, {
                provider: this,
                data: data
            });
        };
        Providers._provider.onError = function () {
            error.call(that, {
                provider: this,
                error:'unauthorized'
            });
        };            
        if (typeof provider == 'number') {
            provider = Providers.get(provider);
        }
        provider.authorize();
    },
    isAuthorized: function (that, callback) {
        var me = this;
        me.temp_index = Providers.get().length;
        Providers._provider.onSuccess = function (data) {
            callback.call(that, {
                provider: this,
                data: data
            });
        };
        Providers._provider.onError = function () {
            me.temp_index --;
            me.temp_index > -1 ? Providers.get(me.temp_index).authorize(true) : callback.call(that, {
                provider: this,
                error:'unauthorized'
            });
        };
        Providers._provider.onError();
        return false;
    },
    logout: function (provider) {
        var providers = Providers.get();
        for(var i = 0; i < providers.length; i ++)
            providers[i].logout();
    },
    // events
    onError: function (error) {
        //console.log('auth error: ' + error);
    },
    onSuccess: function (data) {
        //console.log('auth success: ' + data);
    }
};

// получаем параметры из УРЛ
if (String.prototype.getParamsFromUrl === undefined) {
    String.prototype.getParamsFromUrl = function(){
        var me = this, _params = [], params = {}, _param = [];
        var separator = me.indexOf('#');
        separator == -1 ? separator = me.indexOf('?') : '';
        if (separator == -1) {
		separator = me.indexOf('%');
		if(separator == -1)
			_params = me.slice(separator + 1).split('&');
		else
			_params = me.slice(separator + 3).split('&');
	} else {
		_params = me.slice(separator + 1).split('&');
	}
        for(var i = 0; i < _params.length; i ++){
            param = _params[i].split('=');
            params[param[0]] = param[1];
        }
        return params;
    }
}