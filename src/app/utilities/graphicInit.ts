import { BaseGraphic, TextGraphic, STYLENAME, DeviceService } from "cloudy-location";

class Text extends TextGraphic {
    Style() {
        let styles = super.Style();
        styles.forEach(s => s[STYLENAME] = 'title')
        return styles;
    }
}
let TextInstant = new Text();
class CellPhoneGraphic extends BaseGraphic {
    constructor() {
        super()
        this.Options.color = 'green'
        this.Add(TextInstant)
    }
}

class GPSTagGraphic extends BaseGraphic {
    constructor() {
        super()
        this.Options.color = 'red'
        this.Add(TextInstant)
    }
}
class IncarGraphic extends BaseGraphic {
    constructor() {
        super()
        this.Options.color = 'blue'
        this.Add(TextInstant)
    }
}
export default function InitGraphics(DeviceService: DeviceService) {
    DeviceService.AddGraphic(CellPhoneGraphic, 'cellphone');
    DeviceService.AddGraphic(GPSTagGraphic, 'gpstag');
    DeviceService.AddGraphic(IncarGraphic, 'incar');
}
