Ext.define("Afisha.model.AfishaModels.Places",{extend:"Ext.data.Model",config:{fields:[{name:"id",type:"int"},{name:"name",type:"string"},{name:"aka",type:"string"},{name:"city",type:"string",defaultValue:""},{name:"address",type:"string",defaultValue:""},{name:"phone",type:"string",defaultValue:""},{name:"price",type:"string",defaultValue:""},{name:"time",type:"string",defaultValue:""},{name:"time_start",type:"string",defaultValue:""},{name:"time_end",type:"string",defaultValue:""},{name:"image",type:"auto"},{name:"url",type:"string",defaultValue:""},{name:"text",type:"string",defaultValue:""},{name:"description",type:"string",defaultValue:""},{name:"vote",type:"float",defaultValue:0},{name:"num_votes",type:"int",defaultValue:0},{name:"com_count",type:"int",defaultValue:0},{name:"sort",type:"int",defaultValue:"0"},{name:"lat",type:"float",defaultValue:"0.0"},{name:"lng",type:"float",defaultValue:"0.0"},{name:"bathtype",type:"auto"},{name:"bathserv",type:"auto"},{name:"sporttype",type:"auto"},{name:"shoptype",type:"auto"},{name:"services",type:"auto"},{name:"kitchen",type:"auto"},{name:"genre",type:"auto"},{name:"district",type:"auto"},{name:"main_image",type:"string"}]}});