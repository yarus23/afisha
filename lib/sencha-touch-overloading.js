if(Ext.is.Nokia) {
	
    // проблема с размерами шрифтов
    document.body.className = 'x-android x-phone';
    document.body.style['font-size'] = '180%';

    // перегрузка картовращателя для отключения анимации
    Ext.override( Ext.layout.CardLayout, {
        setActiveItem: function(newCard, animation) {
            var me = this,
            owner = me.owner,
            doc = Ext.getDoc(),
            oldCard = me.activeItem,
            newIndex;
		
            animation = (animation == undefined) ? this.getAnimation(newCard, owner) : animation;

            newCard = me.parseActiveItem(newCard);
            newIndex = owner.items.indexOf(newCard);


            // If the card is not a child of the owner, then add it
            if (newIndex == -1) {
                owner.add(newCard);
            }

            // Is this a valid, different card?
            if (newCard && oldCard != newCard && owner.onBeforeCardSwitch(newCard, oldCard, newIndex, !!animation) !== false) {
                // If the card has not been rendered yet, now is the time to do so.
                if (!newCard.rendered) {
                    this.layout();
                }

                // Fire the beforeactivate and beforedeactivate events on the cards
                if (newCard.fireEvent('beforeactivate', newCard, oldCard) === false) {
                    return false;
                }
                if (oldCard && oldCard.fireEvent('beforedeactivate', oldCard, newCard) === false) {
                    return false;
                }
				
                // Make sure the new card is shown
                if (newCard.hidden) {
                    newCard.show();
                }

                me.activeItem = newCard;

                if (animation && !Ext.is.Nokia) {
                    doc.on('click', Ext.emptyFn, me, {
                        single: true,
                        preventDefault: true
                    });

                    Ext.Anim.run(newCard, animation, {
                        out: false,
                        autoClear: true,
                        scope: me,
                        after: function() {
                            Ext.defer(function() {
                                doc.un('click', Ext.emptyFn, me);
                            },
                            50, me);

                            newCard.fireEvent('activate', newCard, oldCard);

                            if (!oldCard) {
                                // If there is no old card, the we have to make sure that we fire
                                // onCardSwitch here.
                                owner.onCardSwitch(newCard, oldCard, newIndex, true);
                            }
                        }
                    });

                    if (oldCard) {
                        Ext.Anim.run(oldCard, animation, {
                            out: true,
                            autoClear: true,
                            after: function() {
                                oldCard.fireEvent('deactivate', oldCard, newCard);
                                if (me.hideInactive && me.activeItem != oldCard) {
                                    oldCard.hide();
                                }

                                // We fire onCardSwitch in the after of the oldCard animation
                                // because that is the last one to fire, and we want to make sure
                                // both animations are finished before firing it.
                                owner.onCardSwitch(newCard, oldCard, newIndex, true);
                            }
                        });
                    }
                }
                else {
                    newCard.fireEvent('activate', newCard, oldCard);
                    if (oldCard) {
                        oldCard.fireEvent('deactivate', oldCard, newCard);
                        if (me.hideInactive) {
                            oldCard.hide();
                        }
                    }
                    owner.onCardSwitch(newCard, oldCard, newIndex, false);
                }

                return newCard;
            }

            return false;
        }
    });
}
// прыгала реклама везде. 
Ext.Viewport.scrollToTop = function() {
    if (Ext.is.iOS) {
        if (Ext.is.Phone) {
            document.body.scrollTop = 0;
        }
    } else if (Ext.is.Blackberry) {
        window.scrollTo(0, 1000);
    } else {
        window.scrollTo(0, 0);
    }
};

Ext.overrideOriginal = function(obj, overrides) {
    var original = {};


    for(prop in overrides)
        if(overrides.hasOwnProperty(prop) && Ext.isFunction(obj.prototype[prop]))
            original[prop] = obj.prototype[prop];


    Ext.override(obj, Ext.applyIf(overrides, {
        original: original
    }));
};


Ext.overrideOriginal(Ext.form.TextArea, !Ext.is.iOS ? {} : {
    lastY: undefined,
    handleTouch: function(e) {
        this.lastY = e.pageY;
    },


    handleMove: function(e) {
        var textArea = e.target;
        var top = textArea.scrollTop <= 0;
        var bottom = textArea.scrollTop + textArea.clientHeight >= textArea.scrollHeight;
        var up = e.pageY > this.lastY;
        var down = e.pageY < this.lastY;


        this.lastY = e.pageY;

        // default (mobile safari) action when dragging past the top or bottom of a scrollable
        // textarea is to scroll the containing div, so prevent that.
        if((top && up) || (bottom && down))
            e.preventDefault();

        // Sencha disables textarea scrolling on iOS by default,
        // so stop propagating the event to delegate to iOS.
        if(!(top && bottom))
            e.stopPropagation();
    },


    initEvents: function() {
        var textArea = this.fieldEl.dom;
        // have to add these events directly to the DOM textarea (as opposed to this.fieldEl.on),
        // otherwise they're handled after Ext.gesture.Manager and preventDefault will already have been called.


        textArea.addEventListener(
            Ext.supports.Touch ? 'touchstart' : 'mousedown',
            Ext.createDelegate(this.handleTouch, this),
            false);

        textArea.addEventListener(
            Ext.supports.Touch ? 'touchmove' : 'mousemove',
            Ext.createDelegate(this.handleMove, this),
            false);

        this.original.initEvents.apply(this, arguments);
    }
});