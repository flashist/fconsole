import { BaseConsoleView } from "./BaseConsoleView";
import { FC } from "../FC";
import { BaseConsoleButton } from "./BaseConsoleButton";
import { InteractiveEvent } from "@flashist/flibs";
import { FpsMeterView } from "./fps/FpsMeterView";
import { IFConsoleCustomBtnConfigVO } from "../config/IFConsoleCustomBtnConfigVO";
import { ConsoleViewEvent } from "./ConsoleViewEvent";

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

        if (FC.config.customBtns) {
            for (let singleCustomBtnConfig of FC.config.customBtns) {
                this.createTitleBtn(
                    singleCustomBtnConfig.label,
                    { title: singleCustomBtnConfig.tooltip }
                );
            }
        }

        this.closeBtn = this.createTitleBtn(
            FC.config.localization.closeBtnLabel,
            { title: FC.config.localization.closeBtnTooltipTitle }
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

        const addSingleBtnHandler = (singleBtn: BaseConsoleButton) => {
            this.eventListenerHelper.addEventListener(
                singleBtn.view,
                InteractiveEvent.TAP,
                () => {
                    const btnData: IFConsoleCustomBtnConfigVO = (singleBtn.data as IFConsoleCustomBtnConfigVO);
                    if (btnData) {
                        this.dispatchEvent(ConsoleViewEvent.CUSTOM_BTN_CLICK, btnData);
                    }
                }
            );
        };
        for (let singleTitleBtn of this.titleBtns) {
            // using separate function, to make sure correct data about buttons are passed into event handlers
            addSingleBtnHandler(singleTitleBtn);
        }
    }


    private onDisplayListClick(): void {
        FC.toggleView(FC.displayListView);
    }
}