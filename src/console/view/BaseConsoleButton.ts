import { BaseObject } from "@flashist/fcore";
import {
    DisplayObjectContainer,
    FLabel,
    InteractiveEvent,
    FContainer
} from "@flashist/flibs";

import { FC } from "../FC";
import { ITooltipData } from "../../tooltip/ITooltipData";

export class BaseConsoleButton extends BaseObject {

    public view: DisplayObjectContainer;
    public field: FLabel;

    private _text: string;

    public tooltipData: ITooltipData;

    protected construction(): void {
        super.construction();

        this._text = "";

        this.view = new FContainer();
        this.view.interactive = true;
        this.view.cursor = 'pointer';

        this.field = new FLabel({
            autosize: true,
            // color: FC.config.btnSettings.labelColor,
            // size: FC.config.btnSettings.labelSize,
            nativeTextStyle: {
                fill: FC.config.btnSettings.labelColor,
                fontSize: FC.config.btnSettings.labelSize
            }
        });
        this.view.addChild(this.field);

        this.commitData();
        this.onOut();
    }


    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.view,
            InteractiveEvent.OVER,
            this.onOver
        );
        this.eventListenerHelper.addEventListener(
            this.view,
            InteractiveEvent.OUT,
            this.onOut
        );
        this.eventListenerHelper.addEventListener(
            this.view,
            InteractiveEvent.TAP,
            this.onClick
        );
        this.eventListenerHelper.addEventListener(
            this.view,
            InteractiveEvent.UP_OUTSIDE,
            this.onOut
        );
    }


    private onOver(): void {
        this.view.alpha = 1;

        if (this.tooltipData) {
            FC.tooltipManager.show(this.tooltipData);
        }
    }

    private onOut(): void {
        this.view.alpha = 0.75;

        FC.tooltipManager.hide();
    }

    protected onClick(): void {
        this.onOut();
    }


    protected commitData(): void {
        super.commitData();

        this.field.text = this.text;

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

    }


    get text(): string {
        return this._text;
    }

    set text(value: string) {
        if (value == this.text) {
            return;
        }

        this._text = value;

        this.commitData();
    }
}