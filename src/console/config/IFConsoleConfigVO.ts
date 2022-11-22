import { KeyCodes } from "@flashist/flibs";
import { IFConsoleCustomBtnConfigVO } from "./IFConsoleCustomBtnConfigVO";

export interface IFConsoleConfigVO {

    password: string;
    localization: { [key: string]: string };


    console: {
        aboveAll: boolean,
        defaultVisible: boolean
    };

    btnSettings: {
        labelSize: number,
        labelColor: number,
        smallSize: number
    };

    viewSettings: {
        bgColor: number,
        bgAlpha: number,
        bgToContentShift: { x: number, y: number },

        borderWidth: number,
        borderColor: number,
        borderAlpha: number,

        titleLabelColor: number,
        titleLabelSize: number
    };

    displayListSettings: {
        defaultVisible: boolean,

        defaultCaptureKeyCode: string,
        defaultCaptureKey: string,
        defaultPauseKeyCode: string,
        defaultPauseKey: string,

        defaultIgnoreConsoleEnabled: boolean,
        defaultAdditionalInfoEnabled: boolean,
        defaultVisualControlsEnabled: boolean,
        defaultMoveHelperEnabled: boolean,

        hierarchyLabelColor: number,
        hierarchyLabelColorOver: number,
        hierarchyLabelSize: number,

        nameParamName: string,
        additionalInfoParams: {
            x: { toFixed: number },
            y: { toFixed: number },
            width: { visualName: string, toFixed: number },
            height: { visualName: string, toFixed: number }
        },

        globalVarPoolId: string,
        globalVarNamePattern: string
    };

    tooltipSettings: {
        bgColor: number,
        bgAlpha: number,
        bgToContentShift: { x: number, y: number },

        borderWidth: number,
        borderColor: number,
        borderAlpha: number,

        titleLabelColor: number,
        titleLabelSize: number,

        textLabelColor: number,
        textLabelSize: number
    };

    fpsSettings: {
        labelSize: number,
        labelColor: number,
        borderColor: number,
        borderWidth: number,
        borderHeight: number,
        fieldToBorderPadding: number,
        // Amount of separate fps values, which would be saved, to measure an average fps value
        cumulativeFpsCount: number
    };

    customBtns: IFConsoleCustomBtnConfigVO[];
}