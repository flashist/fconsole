import { StringTools, NumberTools } from "@flashist/fcore";
import { FContainer, FLabel, Graphics } from "@flashist/flibs";
import { FC } from "../../FC";

export class FpsMeterView extends FContainer {

    protected field: FLabel;
    protected border: Graphics;

    protected prevTime: number = 0;
    protected time: number = 0;
    protected stepFps: number = 0;
    //
    protected fpsValues: number[] = [];
    protected cumulativeFpsValue: number = 0;

    protected construction(...args): void {
        super.construction(args);

        this.border = new Graphics();
        this.addChild(this.border);
        //
        this.border.beginFill(0x000000, 0.5);
        this.border.drawRect(
            0,
            0,
            FC.config.fpsSettings.borderWidth,
            FC.config.fpsSettings.borderHeight
        );
        this.border.alpha = 0;

        this.field = new FLabel({
            color: FC.config.fpsSettings.labelColor,
            size: FC.config.fpsSettings.labelSize
        });
        this.addChild(this.field);
        this.field.text = StringTools.substituteList(FC.config.localization.fpsText, "00");
        //
        this.field.x = FC.config.fpsSettings.fieldToBorderPadding;
        this.field.y = FC.config.fpsSettings.fieldToBorderPadding;
        this.field.width = this.border.width - FC.config.fpsSettings.fieldToBorderPadding * 2;
        this.field.height = this.border.height - FC.config.fpsSettings.fieldToBorderPadding * 2;
    }

    protected onAddedToStage(): void {
        super.onAddedToStage();

        this.checkFps();
    }

    protected checkFps(): void {
        if (!this.stage) {
            return;
        }

        this.time = Date.now();
        let delta: number = this.time - this.prevTime;
        this.stepFps = NumberTools.roundTo(1000 / delta, 0.1);

        if (this.fpsValues.length >= FC.config.fpsSettings.cumulativeFpsCount) {
            let lastFps: number = this.fpsValues.shift();
            this.cumulativeFpsValue -= lastFps;
        }
        this.fpsValues.push(this.stepFps);
        this.cumulativeFpsValue += this.stepFps;
        if (!this.cumulativeFpsValue || this.cumulativeFpsValue < 0) {
            this.cumulativeFpsValue = 0;
        }

        this.field.text = StringTools.substituteList(
            FC.config.localization.fpsText,
            Math.floor(this.cumulativeFpsValue / this.fpsValues.length)
        );

        this.prevTime = this.time;

        requestAnimationFrame(
            () => {
                this.checkFps()
            }
        );
    }
}