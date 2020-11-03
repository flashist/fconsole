import {KeyCodes} from "@flashist/flibs";

export class Config {

    public password: string = "`";

    public localization = {
        closeBtnTooltipTitle: "Close",

        displayListBtnTooltipTitle: "Display List Inspector",
        displayListBtnTooltipText: "Map the display list\nunder your mouse",

        captureClickBtnLabel: "Capture",
        captureClickBtnTooltip: "Click to copy display data into dev console",

        captureKeyBtnTooltipTitle: "Assign a key to copy display data into dev console",
        captureKeyBtnNormalLabel: "Capture key: {0}",
        captureKeyBtnPressedLabel: "Press a key",
        captureKeyBtnNoKeyHelpText: "(click to add)",

        pauseUpdateKeyBtnTooltipTitle: "Assign a key to pause display list data update",
        pauseUpdateKeyBtnNormalLabel: "Pause key: {0}",
        pauseUpdateKeyBtnPressedLabel: "Press a key",
        pauseUpdateKeyBtnNoKeyHelpText: "(click to add)",

        displayListTitle: "Display List Inspector",
        displayListCapturedKeyText: "Press an assinged key\nto add display list hierarchy\nto the browser console",
        displayListStructureLogTitle: "Display List Structure:",

        additionalInfoBtnNormalLabel: "Additional Info: off",
        additionalInfoBtnPressedLabel: "Additional Info: on",
        additionalInfoBtnTooltipTitle: "Additional visual objects info",
        additionalInfoBtnTooltipText: "Position, width, height, etc. (configurable)",

        moveHelperBtnNormalLabel: "Move Helper: off",
        moveHelperBtnPressedLabel: "Move Helper: on",
        moveHelperTooltipTitle: "Move Helper",
        moveHelperTooltipText: "Enable Move Helper and press CTRL\nfor choosing an object to move\nwith arrow keys (← ↑ → ↓)",
        movableObjectText: "[MOVABLE]",

        fpsText: "FPS: {0}"
    };

    public console = {
        aboveAll: true,
        defaultVisible: false
    };

    public captureKey = {
        defaultCode: KeyCodes.C
    };

    public pauseCode = {
        defaultCode: KeyCodes.SHIFT
    };

    public btnSettings = {
        labelSize: 14,
        labelColor: 0xFF9900,
        smallSize: 12
    };

    public viewSettings = {
        bgColor: 0x000000,
        bgAlpha: 0.75,
        bgToContentShift: {x: 10, y: 10},

        borderWidth: 1,
        borderColor: 0x660000,
        borderAlpha: 0.75,

        titleLabelColor: 0xFFFFFF,
        titleLabelSize: 14
    };

    public displayListSettings = {
        defaultCaptureKey: "c",

        hierarchyLabelColor: 0xCCCCCC,
        hierarchyLabelSize: 14,

        nameParamName: "name",
        additionalInfoParams: {
            "x": {toFixed: 2},
            "y": {toFixed: 2},
            "width": {visualName: "w", toFixed: 2},
            "height": {visualName: "h", toFixed: 2}
        }
    };

    public tooltipSettings = {
        bgColor: 0x000000,
        bgAlpha: 0.75,
        bgToContentShift: {x: 10, y: 10},

        borderWidth: 1,
        borderColor: 0x660000,
        borderAlpha: 0.75,

        titleLabelColor: 0xFF9900,
        titleLabelSize: 14,

        textLabelColor: 0xCCCCCC,
        textLabelSize: 12
    };

    public fpsSettings = {
        labelSize: 12,
        labelColor: 0xFF9900,
        borderColor: 0xFF9900,
        borderWidth: 50,
        borderHeight: 16,
        fieldToBorderPadding: 2,
        // Amount of separate fps values, which would be saved, to measure an average fps value
        cumulativeFpsCount: 60
    };
}