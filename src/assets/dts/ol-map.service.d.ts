export declare class OlMapService {
    private appConfigService;
    RouteL: ol.layer.Vector;
    RangeL: ol.layer.Vector;
    private DrawL;
    private Map;
    private CurrentPointByMouse;
    /**
     * AddLayer
     * @param {} layer
     */
    AddLayer(layer: ol.layer.Layer): void;
    RemoveLayer(layer: any): void;
    AddInteraction(interaction: ol.interaction.Interaction): void;
    RemoveInteraction(interaction: ol.interaction.Interaction): void;
    RemoveAllInteraction(): void;
    private EnvironmentConfig(element);
    DrawRoute(route: string | Array<{
        X: number;
        Y: number;
    }> | ol.Feature, epsg?: string): void;
    /**
     * 画区域
     * @param ps
     * @param epsg
     */
    DrawRange(ps: Array<{
        X: number;
        Y: number;
    }> | ol.Feature, epsg?: string): void;
    GetCoordinate(e: Event): [number, number];
    Helper(helper?: Object): void;
    Change(data: Object): void;
    Init(data: {
        target: HTMLElement;
    }): void;
    /**
     * 设置地图中心点
     * @param point
     */
    Focus(point: [number, number]): void;
    Render(): void;
    /**
     * 刷新特定图层
     * @param layer
     */
    Refresh(layer?: ol.layer.Layer): void;
    RemoveDrawFeature(feature: ol.Feature): void;
    SelectDraw(callback: (features: Array<ol.Feature>) => void, id?: string): ol.interaction.Interaction;
    /**
     *
     * @param type {"Box","LineString","Circle","Polgon"}
     * @param callback
     */
    Draw(type: string, callback: (feature) => void, id?: string): ol.interaction.Interaction;
}
