import {ObjectsPool, ObjectTools} from "@flashist/fcore";
import {
    FLabel,
    Point,
    InteractiveEvent,
    DisplayObject,
    KeyCodes,
    IFDisplayObjectUnderPointVO,
    FDisplayTools,
    FApp,
    FContainer,
    DisplayTools,
    InputManager,
    InputManagerEvent,
    InputManagerEventData
} from "@flashist/flibs";

import {DisplayListItemView} from "./DisplayListItemView";
import {BaseConsoleView} from "../BaseConsoleView";
import {BaseConsoleButton} from "../BaseConsoleButton";
import {PauseKeyButton} from "../pause/PauseKeyButton";
import {FC} from "../../FC";
import {ConsoleContentContainer} from "../ConsoleContentContainer";

export class DisplayListView extends BaseConsoleView {

    private static ARROW_KEY_CODES: string[] = [
        KeyCodes.ARROW_LEFT,
        KeyCodes.ARROW_RIGHT,
        KeyCodes.ARROW_UP,
        KeyCodes.ARROW_DOWN
    ];

    private lastCheckedPos: Point;

    private displayListField: FLabel;

    private displayListItemsPool: ObjectsPool;
    private displayListItemsCont: FContainer;

    private closeBtn: BaseConsoleButton;
    private lastUnderPointData: IFDisplayObjectUnderPointVO;
    private lastAllObjectsUnderPointList: any[];

    private forceUpdateUnderPointView: boolean;

    protected ignoreConsoleBtn: BaseConsoleButton;
    private _isIgnoreConsoleEnabled: boolean;

    protected additionalInfoBtn: BaseConsoleButton;
    private _isAdditionalInfoEnabled: boolean;

    protected moveHelperBtn: BaseConsoleButton;
    private _isMoveHelperEnabled: boolean;
    private moveObject: DisplayObject;
    private prevMoveObject: any;

    private moveObjectIndex: number;

    private paused: boolean;

    protected pauseKeyBtn: PauseKeyButton;
    private _pauseVisible: boolean;

    constructor() {
        super();
    }

    protected construction(): void {
        super.construction();

        this.captureVisible = true;
        this.pauseVisible = true;

        this.lastCheckedPos = new Point();
        this.moveObjectIndex = -1;

        this.titleLabel.text = FC.config.localization.displayListTitle;

        this.insideContentCont.visible = true;

        this.pauseKeyBtn = new PauseKeyButton();
        this.insideContentCont.addChild(this.pauseKeyBtn.view);
        this.pauseKeyBtn.view.y = 5;
        //
        this.pauseKeyBtn.tooltipData = {title: FC.config.localization.pauseUpdateKeyBtnTooltipTitle};

        this.ignoreConsoleBtn = new BaseConsoleButton();
        this.insideContentCont.addChild(this.ignoreConsoleBtn.view);
        this.ignoreConsoleBtn.tooltipData = {
            title: FC.config.localization.ignoreInfoBtnTooltipTitle,
            text: FC.config.localization.ignoreInfoBtnTooltipText
        };
        this.ignoreConsoleBtn.field.size = FC.config.btnSettings.smallSize;
        //
        this.ignoreConsoleBtn.view.y = this.pauseKeyBtn.view.y + this.pauseKeyBtn.view.height + 5;

        this.additionalInfoBtn = new BaseConsoleButton();
        this.insideContentCont.addChild(this.additionalInfoBtn.view);
        this.additionalInfoBtn.tooltipData = {
            title: FC.config.localization.additionalInfoBtnTooltipTitle,
            text: FC.config.localization.additionalInfoBtnTooltipText
        };
        this.additionalInfoBtn.field.size = FC.config.btnSettings.smallSize;
        //
        this.additionalInfoBtn.view.y = this.ignoreConsoleBtn.view.y + this.ignoreConsoleBtn.view.height;

        this.moveHelperBtn = new BaseConsoleButton();
        this.insideContentCont.addChild(this.moveHelperBtn.view);
        this.moveHelperBtn.tooltipData = {
            title: FC.config.localization.moveHelperTooltipTitle,
            text: FC.config.localization.moveHelperTooltipText
        };
        this.moveHelperBtn.field.size = FC.config.btnSettings.smallSize;
        //
        this.moveHelperBtn.view.y = this.additionalInfoBtn.view.y + this.additionalInfoBtn.view.height;

        this.displayListField = new FLabel({
            autosize: true,
            color: FC.config.displayListSettings.hierarchyLabelColor,
            size: FC.config.displayListSettings.hierarchyLabelSize
        });
        this.insideContentCont.addChild(this.displayListField);
        //
        this.displayListField.y = this.moveHelperBtn.view.y + this.moveHelperBtn.view.height + 5;
        //
        this.displayListField.visible = false;


        this.displayListItemsPool = new ObjectsPool();

        this.displayListItemsCont = new FContainer();
        this.insideContentCont.addChild(this.displayListItemsCont);
        //
        this.displayListItemsCont.y = this.moveHelperBtn.view.y + this.moveHelperBtn.view.height + 5;

        this.closeBtn = this.createTitleBtn(
            FC.config.localization.closeBtnLabel,
            {title: FC.config.localization.closeBtnTooltipTitle}
        );

        this.captureKeyBtn.tooltipData.text = FC.config.localization.captureKeyBtnTooltipText;

        if (FC.config.displayListSettings.defaultCaptureKeyCode) {
            this.captureKeyBtn.captureKey = FC.config.displayListSettings.defaultCaptureKey;
            this.captureKeyBtn.captureKeyCode = FC.config.displayListSettings.defaultCaptureKeyCode;
        }
        if (FC.config.displayListSettings.defaultPauseKeyCode) {
            this.pauseKeyBtn.pauseKey = FC.config.displayListSettings.defaultPauseKey;
            this.pauseKeyBtn.pauseKeyCode = FC.config.displayListSettings.defaultPauseKeyCode;
        }

        this.isIgnoreConsoleEnabled = FC.config.displayListSettings.defaultIgnoreConsoleEnabled;
        this.isAdditionalInfoEnabled = FC.config.displayListSettings.defaultAdditionalInfoEnabled;
        this.isMoveHelperEnabled = FC.config.displayListSettings.defaultMoveHelperEnabled;
    }

    public destruction(): void {
        super.destruction();

        this.lastUnderPointData = null;
        this.lastAllObjectsUnderPointList = null;

        if (this.moveObject) {
            this.moveObject = null;
        }
        this.prevMoveObject = null;
    }

    protected addListeners(): void {
        super.addListeners();

        /*this.eventListenerHelper.addEventListener(
            EngineAdapter.instance.mainTicker,
            TickerEvent.TICK,
            this.onTick
        );*/
        FApp.instance.ticker.add(this.onTick, this);

        this.eventListenerHelper.addEventListener(
            this.closeBtn.view,
            InteractiveEvent.TAP,
            this.onClose
        );

        this.eventListenerHelper.addEventListener(
            this.additionalInfoBtn.view,
            InteractiveEvent.TAP,
            this.onAdditionalInfo
        );

        this.eventListenerHelper.addEventListener(
            this.ignoreConsoleBtn.view,
            InteractiveEvent.TAP,
            this.onIgnoreConsole
        );

        this.eventListenerHelper.addEventListener(
            this.moveHelperBtn.view,
            InteractiveEvent.TAP,
            this.onMoveHelper
        );

        this.eventListenerHelper.addEventListener(
            InputManager.instance,
            InputManagerEvent.KEY_DOWN,
            this.onKeyDown
        );
    }

    protected removeListeners(): void {
        super.removeListeners();

        FApp.instance.ticker.remove(this.onTick, this);
    }

    private onTick(): void {
        if (this.paused) {
            return;
        }

        if (this.pauseKeyBtn.isActivated) {
            return;
        }

        if (this.visible) {
            const globalPos: Point = FApp.instance.getGlobalInteractionPosition();
            this.lastCheckedPos.x = globalPos.x;
            this.lastCheckedPos.y = globalPos.y;

            let filter = null;
            if (this.isIgnoreConsoleEnabled) {
                filter = (object: DisplayObject): boolean => {
                    return !(object instanceof ConsoleContentContainer);
                };
            }

            let underPointData: IFDisplayObjectUnderPointVO = FDisplayTools.getObjectsUnderPoint(
                FApp.instance.stage,
                globalPos.x,
                globalPos.y,
                filter
            );

            if (this.forceUpdateUnderPointView || !this.checkUnderPointDataEqual(underPointData, this.lastUnderPointData)) {

                this.forceUpdateUnderPointView = false;
                this.lastUnderPointData = underPointData;

                this.lastAllObjectsUnderPointList = [];
                this.parseUnderPointDataToSingleList(this.lastUnderPointData, this.lastAllObjectsUnderPointList);

                this.commitDisplayListData();
            }
        }
    }

    protected onCapture(): void {
        super.onCapture();

        // Log the parsed structure
        console.group(FC.config.localization.displayListStructureLogTitle);
        this.groupLogUnderPointData(this.lastUnderPointData);
        console.groupEnd();
    }

    protected onIgnoreConsole(): void {
        this.isIgnoreConsoleEnabled = !this.isIgnoreConsoleEnabled;
    }

    protected onAdditionalInfo(): void {
        this.isAdditionalInfoEnabled = !this.isAdditionalInfoEnabled;
    }

    protected onMoveHelper(): void {
        this.isMoveHelperEnabled = !this.isMoveHelperEnabled;
    }

    protected onKeyDown(data: InputManagerEventData): void {

        if (this.isMoveHelperEnabled) {
            let tempCode: string = data.nativeKeyboardEvent.code;
            if (data.nativeKeyboardEvent.ctrlKey) {
                this.moveObjectIndex--;
                this.commitData();

            } else if (DisplayListView.ARROW_KEY_CODES.indexOf(tempCode) != -1) {
                if (this.moveObject) {
                    let tempChangeX: number = 0;
                    let tempChangeY: number = 0;

                    if (tempCode == KeyCodes.ARROW_LEFT) {
                        tempChangeX = -1;
                    } else if (tempCode == KeyCodes.ARROW_RIGHT) {
                        tempChangeX = 1;
                    }

                    if (tempCode == KeyCodes.ARROW_UP) {
                        tempChangeY = -1;
                    } else if (tempCode == KeyCodes.ARROW_DOWN) {
                        tempChangeY = 1;
                    }

                    if (data.nativeKeyboardEvent.shiftKey) {
                        tempChangeX *= 10;
                        tempChangeY *= 10;
                    }

                    this.moveObject.x += tempChangeX;
                    this.moveObject.y += tempChangeY;
                    console.log("Movable object: ", this.moveObject);
                    console.log("x: " + this.moveObject.x + ", y: " + this.moveObject.y);
                }
            }
        }
    }

    private parseUnderPointDataToText(data: IFDisplayObjectUnderPointVO, prefix: string = "∟"): string {
        let result: string = "";

        if (data && data.object) {
            let tempName: string = data.object.toString();
            if (data.object.constructor) {
                tempName = ObjectTools.getConstructorName(data.object.constructor);
            }

            result += prefix + " " + tempName;

            if (FC.config.displayListSettings.nameParamName) {
                if (data.object[FC.config.displayListSettings.nameParamName]) {
                    result += " (" + data.object[FC.config.displayListSettings.nameParamName] + ")";
                }
            }

            if (this.isMoveHelperEnabled) {
                if (data.object == this.moveObject) {
                    result += " " + FC.config.localization.movableObjectText;
                }
            }

            if (this.isAdditionalInfoEnabled) {
                if (FC.config.displayListSettings.additionalInfoParams) {
                    result += " - { ";

                    let parsedData;
                    let tempParamConfig;

                    let keys: string[] = Object.keys(FC.config.displayListSettings.additionalInfoParams);
                    let tempKey: string;
                    let tempVisualKey: string;
                    let keysCount: number = keys.length;
                    for (let keyIndex: number = 0; keyIndex < keysCount; keyIndex++) {
                        tempKey = keys[keyIndex];

                        if (data.object[tempKey] !== undefined) {

                            if (keyIndex > 0) {
                                result += ", "
                            }

                            parsedData = data.object[tempKey];
                            //
                            tempParamConfig = FC.config.displayListSettings.additionalInfoParams[tempKey];
                            if (tempParamConfig.toFixed || tempParamConfig.toFixed === 0) {
                                if (parsedData !== Math.floor(parsedData)) {
                                    parsedData = (parsedData as number).toFixed(tempParamConfig.toFixed);
                                }
                            }

                            //
                            tempVisualKey = tempKey;
                            if (tempParamConfig.visualName) {
                                tempVisualKey = tempParamConfig.visualName;
                            }

                            result += tempVisualKey + ": " + parsedData;
                        }
                    }

                    result += " }";
                }
            }

            if (data.children && data.children.length > 0) {
                let childPrefix: string = "- " + prefix;
                let childrenCount: number = data.children.length;
                for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
                    result += "\n" + this.parseUnderPointDataToText(data.children[childIndex], childPrefix);
                }
            }
        }

        return result;
    }

    private parseUnderPointDataToVisualItemsList(data: IFDisplayObjectUnderPointVO, prefix: string = "∟"): DisplayListItemView[] {
        let result: DisplayListItemView[] = [];

        if (data && data.object) {

            let tempName: string = data.object.toString();
            if (data.object.constructor) {
                tempName = ObjectTools.getConstructorName(data.object.constructor);
            }

            let tempItemText: string = prefix + " " + tempName;

            if (FC.config.displayListSettings.nameParamName) {
                if (data.object[FC.config.displayListSettings.nameParamName]) {
                    tempItemText += " (" + data.object[FC.config.displayListSettings.nameParamName] + ")";
                }
            }

            if (this.isMoveHelperEnabled) {
                if (data.object == this.moveObject) {
                    tempItemText += " " + FC.config.localization.movableObjectText;
                }
            }

            if (this.isAdditionalInfoEnabled) {
                if (FC.config.displayListSettings.additionalInfoParams) {
                    tempItemText += " - { ";

                    let parsedData;
                    let tempParamConfig;

                    let keys: string[] = Object.keys(FC.config.displayListSettings.additionalInfoParams);
                    let tempKey: string;
                    let tempVisualKey: string;
                    let keysCount: number = keys.length;
                    for (let keyIndex: number = 0; keyIndex < keysCount; keyIndex++) {
                        tempKey = keys[keyIndex];

                        if (data.object[tempKey] !== undefined) {

                            if (keyIndex > 0) {
                                tempItemText += ", "
                            }

                            parsedData = data.object[tempKey];
                            //
                            tempParamConfig = FC.config.displayListSettings.additionalInfoParams[tempKey];
                            if (tempParamConfig.toFixed || tempParamConfig.toFixed === 0) {
                                if (parsedData !== Math.floor(parsedData)) {
                                    parsedData = (parsedData as number).toFixed(tempParamConfig.toFixed);
                                }
                            }

                            //
                            tempVisualKey = tempKey;
                            if (tempParamConfig.visualName) {
                                tempVisualKey = tempParamConfig.visualName;
                            }

                            tempItemText += tempVisualKey + ": " + parsedData;
                        }
                    }

                    tempItemText += " }";
                }
            }

            let tempItem: DisplayListItemView = this.displayListItemsPool.getObject(DisplayListItemView);
            tempItem.data = data;
            tempItem.text = tempItemText;
            //
            result.push(tempItem);

            if (data.children && data.children.length > 0) {
                let childPrefix: string = "- " + prefix;
                let childrenCount: number = data.children.length;
                for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
                    // result += "\n" + this.parseUnderPointDataToText(data.children[childIndex], childPrefix);
                    result.push(
                        ...this.parseUnderPointDataToVisualItemsList(data.children[childIndex], childPrefix)
                    );
                }
            }
        }

        return result;
    }

    private groupLogUnderPointData(data: IFDisplayObjectUnderPointVO, prefix: string = "∟"): void {
        if (data && data.object) {

            //console.log(data.object);
            //console.dir(data.object);
            const constructorName: string = ObjectTools.getConstructorName(data.object);
            let logPrefix: string = prefix;
            if (constructorName) {
                logPrefix = prefix + " " + constructorName;
            }
            console.log(logPrefix, data.object);

            if (data.children && data.children.length > 0) {
                // console.group(" children");

                let childrenCount: number = data.children.length;
                for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
                    this.groupLogUnderPointData(data.children[childIndex], "    " + prefix);
                }

                // console.groupEnd();
            }
        }
    }

    private checkUnderPointDataEqual(data1: IFDisplayObjectUnderPointVO, data2: IFDisplayObjectUnderPointVO): boolean {
        let result: boolean = true;

        // If one of the data objects exists and other doesn't
        if (!!data1 != !!data2) {
            result = false;

            // If 2 data objects are available
        } else if (data1 && data2) {

            if (data1.object != data2.object) {
                result = false;

                // If one of data has children and other doesn't have
            } else if (!!data1.children != !!data2.children) {
                result = false;

                // If there are children arrays in the both data objects
            } else if (data1.children && data2.children) {
                // If length of the children lists are not equal, then data objects are not equal too
                if (data1.children.length != data2.children.length) {
                    result = false;

                } else {

                    let childrenCount: number = data1.children.length;
                    for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
                        // If one of the children are not equeal, than stop checking and break the loop
                        if (!this.checkUnderPointDataEqual(data1.children[childIndex], data2.children[childIndex])) {
                            result = false;
                            break;
                        }
                    }
                }
            }
        }

        return result;
    }

    private parseUnderPointDataToSingleList(data: IFDisplayObjectUnderPointVO, list: any[]): void {
        if (data && data.object) {
            list.push(data.object);

            if (data.children && data.children.length > 0) {
                let childrenCount: number = data.children.length;
                for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
                    this.parseUnderPointDataToSingleList(data.children[childIndex], list);
                }
            }
        }
    }


    get isAdditionalInfoEnabled(): boolean {
        return this._isAdditionalInfoEnabled;
    }

    set isAdditionalInfoEnabled(value: boolean) {
        if (value == this._isAdditionalInfoEnabled) {
            return;
        }

        this._isAdditionalInfoEnabled = value;

        this.commitData();
    }


    get isMoveHelperEnabled(): boolean {
        return this._isMoveHelperEnabled;
    }

    set isMoveHelperEnabled(value: boolean) {
        if (value == this._isMoveHelperEnabled) {
            return;
        }

        this._isMoveHelperEnabled = value;

        this.commitData();
    }

    get isIgnoreConsoleEnabled(): boolean {
        return this._isIgnoreConsoleEnabled;
    }

    set isIgnoreConsoleEnabled(value: boolean) {
        if (value == this._isIgnoreConsoleEnabled) {
            return;
        }

        this._isIgnoreConsoleEnabled = value;

        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        this.commitDisplayListData();

        if (!this.visible) {
            this.isAdditionalInfoEnabled = false;
            this.isMoveHelperEnabled = false;
        }

        if (this.pauseKeyBtn) {
            this.pauseKeyBtn.view.visible = this.pauseVisible;
        }

        if (this.ignoreConsoleBtn) {
            if (this.isIgnoreConsoleEnabled) {
                this.ignoreConsoleBtn.text = FC.config.localization.ignoreInfoBtnPressedLabel;
            } else {
                this.ignoreConsoleBtn.text = FC.config.localization.ignorelInfoBtnNormalLabel;
            }
        }

        if (this.additionalInfoBtn) {
            if (this.isAdditionalInfoEnabled) {
                this.additionalInfoBtn.text = FC.config.localization.additionalInfoBtnPressedLabel;
            } else {
                this.additionalInfoBtn.text = FC.config.localization.additionalInfoBtnNormalLabel;
            }
        }

        if (this.moveHelperBtn) {
            if (this.isMoveHelperEnabled) {
                this.moveHelperBtn.text = FC.config.localization.moveHelperBtnPressedLabel;

                // Select an object (if index is -1, it means that selection is reset)
                if (this.moveObjectIndex < -1 || this.moveObjectIndex >= this.lastAllObjectsUnderPointList.length) {
                    this.moveObjectIndex = this.lastAllObjectsUnderPointList.length - 1;
                }

                // If there is an object, select it
                if (this.lastAllObjectsUnderPointList[this.moveObjectIndex]) {
                    this.moveObject = this.lastAllObjectsUnderPointList[this.moveObjectIndex];

                } else {
                    this.moveObject = null;
                }

            } else {
                this.moveHelperBtn.text = FC.config.localization.moveHelperBtnNormalLabel;
                // Reset selection
                this.moveObject = null;
                this.moveObjectIndex = -1;
            }

            // Update the under point view if a new move object was chosen
            if (this.prevMoveObject !== this.moveObject) {
                this.forceUpdateUnderPointView = true;
            }
            this.prevMoveObject = this.moveObject;

        }

    }

    protected commitDisplayListData(): void {
        if (!this.lastUnderPointData) {
            return;
        }

        let listText: string = this.parseUnderPointDataToText(this.lastUnderPointData);
        this.displayListField.text = listText;

        this.clearDisplayListItems();
        let tempDisplayListItems: DisplayListItemView[] = this.parseUnderPointDataToVisualItemsList(this.lastUnderPointData);
        this.createDisplayListItems(tempDisplayListItems);

        this.arrange();
    }

    get pauseVisible(): boolean {
        return this._pauseVisible;
    }

    set pauseVisible(value: boolean) {
        if (value == this.pauseVisible) {
            return;
        }

        this._pauseVisible = value;

        this.commitData();
    }

    protected clearDisplayListItems(): void {
        let childrenCount: number = this.displayListItemsCont.children.length;
        for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
            let tempChild: DisplayListItemView = this.displayListItemsCont.children[childIndex] as DisplayListItemView;
            this.displayListItemsPool.addObject(tempChild, DisplayListItemView);
        }

        DisplayTools.removeAllChildren(this.displayListItemsCont);
    }

    protected createDisplayListItems(items: DisplayListItemView[]): void {
        let lastItem: DisplayListItemView;
        let itemsCount: number = items.length;
        for (let itemIndex: number = 0; itemIndex < itemsCount; itemIndex++) {
            let tempItem: DisplayListItemView = items[itemIndex];
            this.displayListItemsCont.addChild(tempItem);

            if (lastItem) {
                tempItem.y = lastItem.y + lastItem.height;
            } else {
                tempItem.y = 0;
            }

            lastItem = tempItem;
        }
    }
}