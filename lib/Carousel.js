Ext.ns('Ext.ux');

Ext.ux.Carousel = Ext.extend(Ext.Carousel, {
    
    initComponent:function(){
        this.indicator = false;
        Ext.ux.Carousel.superclass.initComponent.call(this);
        var cfg = Ext.isObject(this.indicator) ? this.indicator : {};
        this.indicator = new Ext.ux.Carousel.Indicator(Ext.apply({}, cfg, {
            direction: this.direction,
            carousel: this,
            ui: this.ui
        }));
        
        this.dataSet = [];
    },
    bindData:function(data,activeItem){
        if (!data.length)
            return;
        this.dataSet = data;
        this.removeAll();
        for (var i = 0; i < data.length; i++)
            this.add({
                xtype:'panel',
                layout:'fit',
                //style:'width:100%; height:100%;',
                tpl:this.preview?
                    new Ext.XTemplate('<div class="x-loading-spinner custom-mask">\n\
                                       <span class="x-loading-top"></span>\n\
                                       <span class="x-loading-right"></span>\n\
                                       <span class="x-loading-bottom"></span>\n\
                                       <span class="x-loading-left"></span>\n\
                                       </div>\n\
                                       <img onload="this.parentElement.removeChild(this.previousElementSibling,true); this.setAttribute(&quot;class&quot;,&quot;galerryImg&quot;);" class="galerryImg hidden" src="{href}"> </img>')://
                    new Ext.XTemplate('<img onload="var el = Ext.getCmp(this.parentElement.parentElement.id);if (el){ el.mask.hide();el.doComponentLayout()}" class="galerryImg" src="{href}"> </img>\n\
                                       <div class="bigimg" style="background-image:url({href})"> </div>'),
                mask : this.preview ? null : new Ext.LoadMask(this.el, {msg:" "}),
                showImage:function(idx){
                    if(this.isShow)
                        return;
                    if (this.mask)
                        this.mask.show();
                    var width = this.ownerCt.getWidth();
                    if (!width)
                        return;
                    var prefix = this.ownerCt.preview?'http://src.sencha.io/' + width + '/' +  this.ownerCt.getHeight() + '/':'';
                    this.update({href:prefix + this.ownerCt.dataSet[idx]});
                    this.isShow = true;
                    this.el.index = idx;
                    this.el.ds = this.ownerCt.dataSet;
                    this.el.preview = this.ownerCt.preview;
                },
                listeners:{
                    activate:function(me){
                        this.showImage(this.ownerCt.getActiveIndex());
                    },
                    tap:{element: 'body', 
                            fn: function(evt,el){
                                var panel = this.parent();
                                Ext.dispatch({
                                    controller: 'main',
                                    action    : 'showPicture',
                                    data      : panel.ds, 
                                    idx       : panel.index,
                                    isPreview : panel.preview
                                });
                            }
                    }
                }
            });
        this.doLayout();
        if (!activeItem)
        {
            
            this.setActiveItem(0);
            var ai = this.getActiveItem();
            ai.fireEvent('activate',ai);
            //this.getActiveItem().showImage(0);
        }
        else
        {
            this.setActiveItem(activeItem);
        }
        //this.doLayout();
    }
})
Ext.reg('myCarousel',Ext.ux.Carousel);


/**
 * @class Ext.ux.Carousel.Indicator
 * @extends Ext.Component
 * @xtype mycarouselindicator
 * @private
 *
 * A private utility class used by Ext.Carousel to create indicators.
 */
Ext.ux.Carousel.Indicator = Ext.extend(Ext.Component, {
    baseCls: 'x-carousel-indicator',
    cardsCount:0,
    currentCardNum:1,
    initComponent: function() {
        if (this.carousel.rendered) {
            this.render(this.carousel.body);
            this.onBeforeCardSwitch(null, null, this.carousel.items.indexOf(this.carousel.layout.getActiveItem()));
        }
        else {
            this.carousel.on('render', function() {
                this.render(this.carousel.body);
            }, this, {single: true});
        }
        Ext.ux.Carousel.Indicator.superclass.initComponent.call(this);
    },

    // @private
    onRender: function() {
        Ext.ux.Carousel.Indicator.superclass.onRender.apply(this, arguments);
        for (var i = 0, ln = this.carousel.items.length; i < ln; i++) {
            this.createIndicator();
        }

        this.mon(this.carousel, {
            beforecardswitch: this.onBeforeCardSwitch,
            scope: this
        });
        
        this.el.addCls(this.baseCls + '-' + this.direction);
    },

    // @private
    createIndicator: function() {
        //return;
        this.indicators = this.indicators || [];
        this.cardsCount++;
        if (!this.indicators.length)
        {
            this.indicators.push(this.el.createChild({
                tag: 'div'
            }));
            this.indicators[0].addCls('counter');
        }
        this.updateCounter();
    },
    
    updateCounter: function()
    {
        if (this.indicators.length)
            this.indicators[0].update(this.currentCardNum + '/' + this.cardsCount);
    },    
    
    // @private
    onBeforeCardSwitch: function(carousel, card, old, index) {
        if (Ext.isNumber(index) && index != -1) {
            this.currentCardNum = index + 1;
            this.updateCounter();
        }
    },

    // @private
    onCardAdd: function() {
        if (this.rendered) {
            this.createIndicator();
        }
    },

    // @private
    onCardRemove: function() {
        if (this.rendered && this.indicators.length) {
            this.indicators.pop().remove();
        }
        this.cardsCount--;
        this.updateCounter();
    }
});

Ext.reg('mycarouselindicator', Ext.ux.Carousel.Indicator);