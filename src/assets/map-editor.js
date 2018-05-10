/**
 * RemoveDrawFeature(feature: ol.Feature) 
 * SelectDraw(callback: (features: Array<ol.Feature>) => void, id: string = "1")
 * 
 * type:{"Box","LineString","Circle","Polgon"}
 * Draw(type: string, callback: (feature) => void, id: string = "1")
 */
var MapEditor=(function(){
    function mapEditor(container,mapService,deviceService,assetService){
        this.mapContainer=container;
        this.mapService=mapService;
        this.deviceService=deviceService;
        this.assetService=assetService;
        this.Init();
        return this;
    }
    /**
     * SelectDraw
     */
    mapEditor.prototype.Init=function(){
        var that=this;
        that.mapService.SelectDraw(function(ff){
            console.log(ff);
            });
            that.mapService.Draw("Polygon",function(f){
            console.log(f);
          
        })
    }
    return mapEditor;
})()
