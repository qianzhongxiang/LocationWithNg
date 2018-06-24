import { BaseGraphic, GetGraphicFactory } from "cloudy-location";

class CellPhoneGraphic extends BaseGraphic {
    constructor() {
        super("green")
    }
}
class GPSTagGraphic extends BaseGraphic {
    constructor() {
        super("red")
    }
}
class IncarGraphic extends BaseGraphic {
    constructor() {
        super("blue")
    }
}
export default function InitGraphics() {
    GetGraphicFactory().SetComponent(CellPhoneGraphic, 'cellphone');
    GetGraphicFactory().SetComponent(GPSTagGraphic, 'gpstag');
    GetGraphicFactory().SetComponent(IncarGraphic, 'incar');
}
