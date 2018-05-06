var MapEditor=(function(){
    function mapEditor(container,mapService,deviceService,assetService){
        this.mapContainer=container;
        this.mapService=mapService;
        this.deviceService=deviceService;
        this.assetService=assetService;
        this.Init();
        return this;
    }
    mapEditor.prototype.Init=function(){
        var that=this;
        this.mapService.Draw("Polygon",function(f){
            console.log(f);
            that.mapService.SelectDraw(function(ff){
            console.log(ff);
            });
        })
    }
    return mapEditor;
})()
