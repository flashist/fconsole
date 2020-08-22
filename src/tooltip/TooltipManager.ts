import {BaseObject} from "@flashist/fcore";
import {DisplayObjectContainer, Point, FApp, FContainer} from "@flashist/flibs";

import {BaseTooltip} from "./BaseTooltip";
import {ITooltipData} from "./ITooltipData";

export class TooltipManager extends BaseObject {

    private static SHOW_DELAY: Number = 0.5;

    private _tooltipCont: DisplayObjectContainer;
    private tooltipInsideCont: DisplayObjectContainer;
    private tooltip: BaseTooltip;

    private _mouseShift: Point;

    private _visible: boolean;

    constructor(tooltip: BaseTooltip) {
        super(tooltip);
    }


    protected construction(tooltip: BaseTooltip): void {
        super.construction();

        this.tooltip = tooltip;
        this.mouseShift = new Point();

        this.tooltipInsideCont = new FContainer();
        this.tooltipInsideCont.addChild(this.tooltip.view);

        this.hide();
    }

    protected addListeners(): void {
        super.addListeners();

        FApp.instance.ticker.add(this.onTick, this);
    }

    protected removeListeners(): void {
        super.removeListeners();

        FApp.instance.ticker.remove(this.onTick, this);
    }

    private onTick(): void {
        this.update();
    }


    public show(data: ITooltipData): void {
        this.visible = true;

        this.tooltip.data = data;

        this.update();
    }

    public hide(): void {
        this.visible = false;
    }


    /**
     * Обновление подсказки.
     */
    public update(): void {
        if (!this.visible) {
            return;
        }
        if (!this.tooltipCont) {
            return;
        }
        if (!this.tooltip) {

        }

        const globalPos: Point = FApp.instance.getGlobalInteractionPosition();
        let tempPos: Point = globalPos.clone();
        tempPos.x += this.mouseShift.x;
        tempPos.y += this.mouseShift.y;

        if (tempPos.x < 0) {
            tempPos.x = 0;
        } else if (tempPos.x + this.tooltip.view.width > FApp.instance.renderer.width) {
            tempPos.x = FApp.instance.renderer.width - this.tooltip.view.width;
        }

        if (tempPos.y < 0) {
            tempPos.y = 0;
        } else if (tempPos.y + this.tooltip.view.height > FApp.instance.renderer.height) {
            tempPos.y = FApp.instance.renderer.height - this.tooltip.view.height;
        }

        tempPos = this.tooltip.view.parent.toLocal(tempPos);
        this.moveTooltipTo(tempPos.x, tempPos.y);
    }

    /**
     * Move a tooltip to a new position.
     * Might be overridden in subclasses to implement different behavior (e.g. tween movement).
     *
     * @param x
     * @param y
     */
    protected moveTooltipTo(x: number, y: number): void {
        this.tooltip.view.x = x;
        this.tooltip.view.y = y;
    }


    public get tooltipCont(): DisplayObjectContainer {
        return this._tooltipCont;
    }

    public set tooltipCont(value: DisplayObjectContainer) {
        if (this.tooltipCont == value) {
            return;
        }

        this._tooltipCont = value;

        if (this.tooltipCont) {
            this.tooltipCont.addChild(this.tooltipInsideCont);
        }

        this.update();
    }


    get mouseShift(): Point {
        return this._mouseShift;
    }

    set mouseShift(value: Point) {
        this._mouseShift = value.clone();

        this.update();
    }


    private get visible(): boolean {
        return this._visible;
    }

    private set visible(value: boolean) {
        this._visible = value;

        this.tooltipInsideCont.visible = this.visible;
    }
}