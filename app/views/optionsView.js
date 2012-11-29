Afisha.views.optionsView = Ext.extend(Ext.form.FormPanel, {
    id: 'optionsView',
    //scroll:'vertical',
    fullscreen:true,
    listeners:{
        beforeshow: function () {
            var me = this;
            me.down('#authReset').getEl('')
        //me.down('#authReset').setValue(0); // сброс toggle авторизации
        },
        show: function(me) {
            me.down('#usegps').setValue(Afisha.useGPS)
            this.doComponentLayout();
        }
    },
    bindData: function(params, callBack, scope) {
        callBack.call(scope, this.id, params.direction ? params.direction: 'left');
    },
    items:[{
        xtype:'togglefield',
        id:'usegps',
        name:'enable',
        label:'Использовать определение координат',
        labelAlign:'left',
        labelWidth:'70%',
        listeners:{
            change:function( me, thumb, newValue, oldValue )
            {
                if ((newValue == oldValue) || (Boolean(newValue) == Afisha.useGPS))
                    return;
                Afisha.useGPS = Boolean(newValue);
                Afisha.options.set('useGPS',Boolean(newValue));
            }
        }
    }, 
    {
        xtype: 'field',
        id: 'authReset',
        renderTpl: [
        '<div class="x-form-label" style="width: 70%;"><span>Сбросить авторизацию в социальных сетях</span></div>',
        '<div class="x-form-field-container x-slider">',
        '</div>'
        ],
        afterRender: function () {
            var me = this;
            me.__proto__.__proto__.afterRender.call(me);
            var button = new Ext.Button({
                ui  : 'round',
                renderTo: me.getEl().query('.x-form-field-container')[0],
                text: '...',
                height: '2.2em',
                handler: function () {
                    Afisha.Auth.unAuthorize();
                    Ext.Msg.alert(G.app_name, 'Авторизация успешно сброшена.');
                }
            });
        }        
    }],

    initComponent: function() {
        this.uploadImage = null;
        this.defaultImage = 'config/resources/icons/missing_image_ru.jpg';
        this.dockedItems = [{
            xtype:'toolbar',
            ui:g_ui,
            title:!Afisha.showButtons?'Настройки':'',
            items: [
            !Afisha.showButtons?{
                xtype:'spacer'
            }:{
                xtype: 'backbtn',
                text:'Назад'
            },

            {
                xtype: 'spacer'
            }
            ],
            height:'2.2em'
        }];

        Afisha.views.optionsView.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('optionsView', Afisha.views.optionsView);