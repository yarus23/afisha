Ext.define("Afisha.model.News.PageView",{extend:"Ext.data.Model",config:{fields:[{name:"id",type:"int"},{name:"news_rubric_id",type:"int"},{name:"datetime",type:Ext.data.Types.CUSTOMDATE},{name:"title",type:"string"},{name:"description",type:"string"},{name:"body",type:"string"},{name:"url",type:"string"},{name:"image",type:"string"},{name:"images",type:"auto"}]}});