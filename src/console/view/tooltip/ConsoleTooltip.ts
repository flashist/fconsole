import {
    DisplayObjectContainer,
    Graphics,
    FLabel,
    Align,
    FContainer
} from "@flashist/flibs";
import {BaseTooltip} from "../../../tooltip/BaseTooltip";
import {FC} from "../../FC";

export class ConsoleTooltip extends BaseTooltip {

    private contentCont:DisplayObjectContainer;
    private titleLabel:FLabel;
    private textLabel:FLabel;

    private bg:Graphics;

    constructor() {
        super();
    }

    protected construction():void {
        super.construction();

        this.bg = new Graphics();
        this.view.addChild(this.bg);

        this.contentCont = new FContainer();
        this.view.addChild(this.contentCont);

        this.titleLabel = new FLabel({
            autosize: true,
            color: FC.config.tooltipSettings.titleLabelColor,
            size: FC.config.tooltipSettings.titleLabelSize,
            align: Align.CENTER
        });
        this.contentCont.addChild(this.titleLabel);

        this.textLabel = new FLabel({
            autosize: true,
            color: FC.config.tooltipSettings.textLabelColor,
            size: FC.config.tooltipSettings.textLabelSize,
            align: Align.CENTER
        });
        this.contentCont.addChild(this.textLabel);
    }


    protected commitData():void {
        super.commitData();

        if (!this.tooltipData) {
            return;
        }

        this.titleLabel.text = this.tooltipData.title;

        this.textLabel.text = this.tooltipData.text;
        if (this.tooltipData.text) {
            this.textLabel.visible = true;
        } else {
            this.textLabel.visible = false;
        }

        this.arrange();
    }

    protected arrange():void {
        super.arrange();

        if (this.textLabel.visible) {
            let labelMaxWidth:number = Math.max(this.titleLabel.width, this.textLabel.width);
            this.titleLabel.x = ((labelMaxWidth - this.titleLabel.width) >> 1);

            this.textLabel.x = ((labelMaxWidth - this.textLabel.width) >> 1);
            this.textLabel.y = this.titleLabel.y + this.titleLabel.height;

        } else {
            this.titleLabel.x = 0;
        }

        this.bg.clear();
        this.bg.beginFill(FC.config.tooltipSettings.bgColor, FC.config.tooltipSettings.bgAlpha);
        this.bg.lineStyle(
            FC.config.tooltipSettings.borderWidth,
            FC.config.tooltipSettings.borderColor,
            FC.config.tooltipSettings.borderAlpha
        );
        this.bg.drawRect(
            0,
            0,
            this.contentCont.width + FC.config.tooltipSettings.bgToContentShift.x,
            this.contentCont.height + FC.config.tooltipSettings.bgToContentShift.y
        );
        this.bg.endFill();

        this.contentCont.x = this.bg.x + ((this.bg.width - this.contentCont.width) >> 1);
        this.contentCont.y = this.bg.y + ((this.bg.height - this.contentCont.height) >> 1);
    }
}