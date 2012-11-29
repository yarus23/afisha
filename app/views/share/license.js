//start
var license_agreement = G.license_agreement;
//end

Afisha.views.ShareLicense = Ext.extend(Afisha.views.SharePanelWithBackButton, {
    id: 'ShareLicense',
    cls: 'shareLicensePanel',
    items: [
        {
		cls: 'text texttop',
		html: license_agreement
        }    
    ],
    initComponent: function() {
        Afisha.views.ShareLicense.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('ShareLicense', Afisha.views.ShareLicense);

