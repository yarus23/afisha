Ext.ns('Ext.ux');

Ext.ux.customSelectfieldListPanel = Ext.extend(Ext.Panel,{
    initComponent: function() {
        Ext.ux.customSelectfieldListPanel.superclass.initComponent.apply(this, arguments);
    },
    alignTo : function(alignTo, allowSides, offset) {
        if (!this.customAlign)
        {
            return Ext.ux.customSelectfieldListPanel.superclass.alignTo.call(this, alignTo, allowSides, offset);
        }
        alignTo = alignTo.child('.x-form-label');
        var alignBox = alignTo.getPageBox(),
            constrainBox = {
                width: window.innerWidth,
                height: window.innerHeight
            },
            topOffset = 40,
            size = this.getSize(),
            targetBox = [0,0],
            anchorEl = this.anchorEl,
            newSize = {
                width: Math.min(size.width, constrainBox.width - alignBox.right),
                height: Math.min(size.height, constrainBox.height - topOffset)
            };
        this.setSize(newSize.width, newSize.height);
        var middle = (newSize.height + topOffset);
        if (middle <= alignBox.bottom)
            targetBox[1] = (alignBox.bottom - alignBox.height/2) - middle + topOffset;//centered
        else
            targetBox[1] = (constrainBox.height - topOffset - newSize.height)/2 + topOffset;
        targetBox[0] = alignBox.right;
        this.setPosition(targetBox[0],targetBox[1]);
        if (anchorEl) {
            anchorEl.removeCls(['x-anchor-bottom', 'x-anchor-left', 'x-anchor-right', 'x-anchor-top']);
            anchorEl.setXY([alignBox.right - 20,(alignBox.bottom - alignBox.height/2)]);
            anchorEl.addCls('x-anchor-left');
        }
        return 't-b';
    }
});
//Ext.reg('selectfieldpanel', Ext.ux.customSelectfieldListPanel);

Ext.ux.customSelectField = Ext.extend(Ext.form.Select,  {
    initComponent: function() {
        Ext.ux.customSelectField.superclass.initComponent.apply(this, arguments);
    },
    onListItemTap: function(list, index, item, e){
        if (this.store.findExact(this.valueField, this.value) == index)
            this.listPanel.hide({
                type: 'fade',
                out: true,
                scope: this
            });
        else 
            return;
    },
    getListPanel: function() {
        if (!this.listPanel) {
            this.listPanel = new Ext.ux.customSelectfieldListPanel({
                customAlign      : this.customPos,
                floating         : true,
                stopMaskTapEvent : false,
                hideOnMaskTap    : true,
                cls              : 'x-select-overlay',
                scroll           : 'vertical',
                items: {
                    xtype: 'list',
                    store: this.store,
                    itemId: 'list',
                    scroll: false,
                    //disableSelection: true,
                    allowDeselect:false,
                    itemTpl : [
                        '<span class="x-list-label">{' + this.displayField + '}</span>',
                        '<span class="x-list-selected"></span>'
                    ],
                    listeners: {
                        select : this.onListSelect,
                        itemtap: this.onListItemTap,
                        scope  : this
                    }
                }
            });
        }

        return this.listPanel;
    },
});
Ext.reg('customselectfield', Ext.ux.customSelectField);
