import { KeyCodes } from "@flashist/flibs";
import { IFConsoleConfigVO } from "./IFConsoleConfigVO";

export class DefaultFConsoneConfigVO implements IFConsoleConfigVO {

    public password: string = "`";

    public localization = {
        closeBtnTooltipTitle: "Close",

        onStatus: "on",
        offStatus: "off",

        closeBtnLabel: "X",

        displayListBtnLabel: "DL",
        displayListBtnTooltipTitle: "Display List Inspector",
        displayListBtnTooltipText: "Map the display list\nunder your mouse",

        captureClickBtnLabel: "Capture",
        captureClickBtnTooltip: "Click to show the display list data in the dev console",

        captureKeyBtnTooltipTitle: "Assign a key to copy display data into dev console",
        captureKeyBtnTooltipText: "Press an assinged key\nto add display list hierarchy\nto the browser console",
        captureKeyBtnNormalLabel: "Capture key: {key}",
        captureKeyBtnPressedLabel: "Press a key",
        captureKeyBtnNoKeyHelpText: "(click to add)",

        pauseUpdateKeyBtnTooltipTitle: "Assign a key to pause display list data update",
        pauseUpdateKeyBtnNormalLabel: "Pause key: {key} ({status})",
        pauseUpdateKeyBtnPressedLabel: "Press a key",
        pauseUpdateKeyBtnNoKeyHelpText: "(click to add)",

        displayListItemTooltipTitle: "Click to show the display item data in the dev console",

        displayListTitle: "Display List Inspector",
        displayListStructureLogTitle: "Display List Structure:",

        additionalInfoBtnNormalLabel: "Additional Info: off",
        additionalInfoBtnPressedLabel: "Additional Info: on",
        additionalInfoBtnTooltipTitle: "Additional visual objects info",
        additionalInfoBtnTooltipText: "Position, width, height, etc. (configurable)",

        visualControlsBtnNormalLabel: "Visual Controls: off",
        visualControlsBtnPressedLabel: "Visual Controls: on",
        visualControlsBtnTooltipTitle: "Visual Controls",
        visualControlsBtnTooltipText: "Click on object to switch visibility of objects",

        ignorelInfoBtnNormalLabel: "Ignore Console: off",
        ignoreInfoBtnPressedLabel: "Ignore Console: on",
        ignoreInfoBtnTooltipTitle: "Ignore console classes",
        ignoreInfoBtnTooltipText: "Console-related classes\nwon't be shown in the inspector",

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

    public btnSettings = {
        labelSize: 14,
        labelColor: 0xFF9900,
        smallSize: 12
    };

    public viewSettings = {
        bgColor: 0x000000,
        bgAlpha: 0.75,
        bgToContentShift: { x: 10, y: 10 },

        borderWidth: 1,
        borderColor: 0x660000,
        borderAlpha: 0.75,

        titleLabelColor: 0xFFFFFF,
        titleLabelSize: 14
    };

    public displayListSettings = {
        defaultVisible: false,

        defaultCaptureKeyCode: KeyCodes.C,
        defaultCaptureKey: "c",
        defaultPauseKeyCode: KeyCodes.P,
        defaultPauseKey: "p",

        defaultIgnoreConsoleEnabled: true,
        defaultAdditionalInfoEnabled: false,
        defaultVisualControlsEnabled: false,
        defaultMoveHelperEnabled: false,

        hierarchyLabelColor: 0xCCCCCC,
        hierarchyLabelColorOver: 0xFF9900,
        hierarchyLabelSize: 14,

        nameParamName: "name",
        additionalInfoParams: {
            "x": { toFixed: 2 },
            "y": { toFixed: 2 },
            "width": { visualName: "w", toFixed: 2 },
            "height": { visualName: "h", toFixed: 2 }
        },

        globalVarPoolId: "fconsole_globalVarPool",
        globalVarNamePattern: "fconsoleTemp{0}"
    };

    public tooltipSettings = {
        bgColor: 0x000000,
        bgAlpha: 0.75,
        bgToContentShift: { x: 10, y: 10 },

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

    public customBtns: { label: string, tooltip: string }[] = [];
}