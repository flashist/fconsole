import {BaseConsoleView} from "./BaseConsoleView";
import {FC} from "../FC";
import {BaseConsoleButton} from "./BaseConsoleButton";
import {InteractiveEvent} from "@flashist/flibs";
import {FpsMeterView} from "./fps/FpsMeterView";

export class ConsoleView extends BaseConsoleView {

    private displayListBtn: BaseConsoleButton;
    private closeBtn: BaseConsoleButton;
    private fpsMeter: FpsMeterView;

    protected construction(): void {
        super.construction();

        this.titleVisible = false;

        this.displayListBtn = this.createTitleBtn(
            FC.config.localization.displayListBtnLabel,
            {
                title: FC.config.localization.displayListBtnTooltipTitle,
                text: FC.config.localization.displayListBtnTooltipText
            }
        );

        this.addTitleElement(new FpsMeterView());

        this.closeBtn = this.createTitleBtn(
            FC.config.localization.closeBtnLabel,
            {title: FC.config.localization.closeBtnTooltipTitle}
        );
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.displayListBtn.view,
            InteractiveEvent.TAP,
            this.onDisplayListClick
        );

        this.eventListenerHelper.addEventListener(
            this.closeBtn.view,
            InteractiveEvent.TAP,
            this.onClose
        );
    }


    private onDisplayListClick(): void {
        FC.toggleView(FC.displayListView);
    }
}