export interface ICate {
    "class": string,
    "title": string,
    "code": string,
    "color": string,
    "visable": boolean,
    "mp": boolean,
    "count": number
}
export interface MapConifg {
    "geoServerUrl"?: string,
    "wsType"?: string,
    "mqttTopic"?: string,
    "mqttUser"?: string,
    "mqttPd"?: string,
    "locationSocketURI"?: string,
    "trackOfComponent"?: boolean,
    "warningService"?: string,
    "webService"?: string,
    "layers"?: {
        "OMS"?: boolean,
        "bg"?: boolean,
        "road"?: boolean,
        "distance"?: boolean,
        "marks"?: boolean
    },
    "centerPoint"?: Array<number>,
    "centerSrs"?: string
    "srs"?: string,
    "zoom"?: number,
    "geoServerGroup"?: string
}
export interface AppConfig {
    "asset-profile-url"?: string
    "multiPanelConfiguration"?: {
        "items": Array<
        {
            "class": string,
            "title": string,
            "code": string,
            "disable": boolean
        }
        >,
        "taskListSource": {
            "url": string
        }
    },
    "toolbar"?: {
        "items": Array<ICate>,
        "itemsDetailed": Array<ICate>
    },
    "map"?: MapConifg
}
