// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  multiPanelConfiguration: {
    items: [{ class: "icon-deviceList", title: "设备列表", code: "deviceList" }
      , { class: "icon-taskList", title: "任务列表", code: "taskList", disable: true }
      // , { class: "icon-deviceInfo", title: "设备详细", code: "deviceInfo", disable: true }
      // , { class: "icon-miscellaneous", title: "杂项", code: "miscellaneous", disable: true }
    ]
    , taskListSource: { url: "/TK/GetUncompleteTask", responsedData: (d) => d.Data || [] }
  },
  toolbar: {
    items: [{ class: "fa fa-car", title: "车载", code: "incar", color: "#F8A620", visable: true },
    { class: "fa fa-briefcase", title: "便携", code: "gpstag", color: "#48DE81", visable: true },
    { class: "fa fa-mobile", title: "手机", code: "cellphone", color: "#2F97F3", visable: true },
      // { class: "", title: "离线", code: "offline", visable: true }
    ],
    itemsDetailed: [
      { class: "", title: "大机", code: "largemachine", visable: true },
      { class: "", title: "自卸车", code: "dumptruck", visable: true },
      { class: "", title: "流机", code: "mobilemachine", visable: true },
      { class: "", title: "人员", code: "staff", visable: true }

      // { class: "", title: "自卸车", code: "dumptruck", visable: true },
      // { class: "", title: "挖机", code: "diggingmachine", visable: true },
      // { class: "", title: "叉车", code: "forklift", visable: true },
      // { class: "", title: "装载机", code: "loader", visable: true },
      // { class: "", title: "卸船机", code: "shipunloader", visable: true },
      // { class: "", title: "装船机", code: "shiploader", visable: true },
      // { class: "", title: "装车机", code: "carloader", visable: true },
      // { class: "", title: "斗轮机", code: "bucketwheel", visable: true }
    ]
  },
  map: {
    geoServerUrl: "http://192.168.8.61:8080/geoserver",
    locationSocketURI: "ws://192.168.8.62:3722",
    trackOfComponent: false,
    warningService: "ws://192.168.41.104:3801"
  }
};
