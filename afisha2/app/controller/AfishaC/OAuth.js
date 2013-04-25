Ext.define('Afisha.controller.AfishaC.OAuth', {
    extend: 'Ext.app.Controller',

    hideAuthView: function () {
        if (this.userdata) {
            this.onAuthCallback && this.onAuthCallback(this.userdata);
            this.authView.hide();
        }
    },

    onButtonTap: function (el, providerIndex) {
        this.callback = {
            that: this,
            callback: this.hideAuthView
        };
        this.login(providerIndex);
    },

    getUserData: function (callback) {
        if (!this.userdata) {
            this.onAuthCallback = callback; //debug
            this.showAuthView();
        } else {
            callback(this.userdata);
        }
    },

    showAuthView: function () {
        if (!this.authView) {
            this.authView = Ext.create('Afisha.view.AuthView', {
                controller: this
            });
            Ext.Viewport.add(this.authView);
        }
        this.authView.show();
    },

    isAuthorized: function (that, callback) {
        this.callback = {
            that: that,
            callback: callback
        };
        //<debug>
        if (Ext.os.deviceType === 'Desktop') {
            this.userdata = false;
            this.callback.callback.call(this.callback.that);
            return;
        }
        //</debug>
        Auth.isAuthorized(this, this.onResult);
    },

    userdata: undefined,

    onResult: function (data) {
        this.userdata = data.error ? false : data.data;
        //<debug>
        if (Ext.os.deviceType === 'Desktop') {
            this.prov_image = 'config/resources/icons/social/iko_6.png'
        } else
        //</debug>
        this.prov_image = data.provider.icon;
        this.callback.callback.call(this.callback.that);
    },

    unAuthorize: function (flag) {
        this.userdata = flag ? undefined : false;
        this.callback.callback.call(this.callback.that);
        Auth.logout();
    },

    login: function (index) {
        this.unAuthorize(1);
        //<debug>
        if (Ext.os.deviceType === 'Desktop') {
            this.onResult({
                data: {
                    identity: "http://yandex.ru",
                    full_name: "Антон Перякин"
                }
            });
            return;
        }
        //</debug>
        Auth.login(index, this, this.onResult, this.onResult);
    },
    post: function (index, message, link, that, callback) {
        var me = this;
        if (!this.userdata || this.userdata.prov_name !== Providers.get(index).name) {
            // разлогиниваемся, получаем userdata, на callback вешаем эту же функцию
            this.unAuthorize(1);
            Auth.login(index, this,
                function (data) {
                    me.userdata = data.error ? false : data.data;
                    //<debug>
                    if (Ext.os.deviceType === 'Desktop') {
                        this.prov_image = 'config/resources/icons/social/iko_6.png';
                    } else
                    //</debug>
                    me.prov_image = data.provider.icon;
                    me.post(index, message, link, that, callback);
                },
                function (data) {
                    me.userdata = data.error ? false : data.data;
                    //<debug>
                    if (Ext.os.deviceType === 'Desktop') {
                        this.prov_image = 'config/resources/icons/social/iko_6.png';
                    } else
                    //</debug>
                    me.prov_image = data.provider.icon;
                    callback.call(that, 'error');
                });
        } else {
            // отправляем message + link
            Providers.get(index).sendPost(message, link, that, callback);
            Ext.Msg.alert(G.app_name, 'Сообщение отправлено.');
        }
    }
});