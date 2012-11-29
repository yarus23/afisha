Ext.ns('Ext.ux');

Ext.ux.TitledPickerSlot = Ext.extend(Ext.Panel, {
	flex: 1,
	defaultType: 'pickerslot',
	layout:'fit',
	componentCls: 'x-picker-slot',
	initComponent: function() {
		if (this.title) {
			this.dockedItems = [{
				xtype:'component',
				componentCls:'x-picker-slot-title',
				html: this.title
			}];
		}
		Ext.ux.TitledPickerSlot.superclass.initComponent.call(this);
		this.slot = this.getSlot();
	},
	getSlot: function() {
		return this.slot ? this.slot : this.getComponent(0);
	},
	getValue: function() {
		var slot = this.getSlot();
		if (slot) {
			return slot.getValue();
		} 
	},
	setValue: function(value) {
		var slot = this.getSlot();
		if (slot) {
			return slot.setValue(value);
		}
	},
	setSelectedNode: function(selected, animate) {
		var slot = this.getSlot();
		return slot ? slot.setSelectedNode(selected, animate) : null;
	},
	getSelectedNode: function() {
		var slot = this.getSlot();
		return slot ? slot.getSelectedNode() : null;
	},
	scrollToNode: function(node, animate) {
		var slot = this.getSlot();
		return slot ? slot.scrollToNode(node, animate) : null;
	}
});

Ext.reg('titledpickerslot', Ext.ux.TitledPickerSlot);

Ext.ux.TitledPicker = Ext.extend(Ext.Picker, {
	useTitles: true,
	title:false,
	cls:'ux-titled-picker',
	initComponent: function(){
		if (this.slots) {
			Ext.each(this.slots, function(item, index, allItems) {
				if (this.useTitles) {
					this.slots[index] = {
						xtype:'titledpickerslot',
						title: item.title || '&nbsp;',
						name: item.name,
						items: [item]
					};
				}
			}, this);

		Ext.ux.TitledPicker.superclass.initComponent.call(this);
                this.toolbar.ui = this.ui; 
		var spacer = this.toolbar.getComponent(1);
		if (this.title && spacer) {
			spacer.addCls('ux-picker-title');
			spacer.update(this.title);
		}
                }
	}
});

Ext.reg('titledpicker',Ext.ux.TitledPicker);