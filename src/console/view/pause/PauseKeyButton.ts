import {BaseConsoleButton} from "../BaseConsoleButton";
import {InputManager, InputManagerEvent, InputManagerEventData} from "@flashist/flibs";
import {KeyboardTools, StringTools} from "@flashist/fcore";

import {FC} from "../../FC";
import {PauseKeyButtonEvent} from "./PauseKeyButtonEvent";

export class PauseKeyButton extends BaseConsoleButton {

    private _pauseKey: string;

    private _isClicked: boolean;


    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            InputManager.instance,
            InputManagerEvent.KEY_PRESS,
            this.onKeyPress
        );

        this.eventListenerHelper.addEventListener(
            InputManager.instance,
            InputManagerEvent.KEY_UP,
            this.onKeyUp
        );
    }


    protected onClick(): void {
        super.onClick();

        this.isClicked = !this.isClicked;
        if (!this.isClicked) {
            this.pauseKey = null;
        }
    }

    protected onKeyPress(data: InputManagerEventData): void {
        if (this.view.worldVisible) {
            if (this.isClicked) {
                this.isClicked = false;
                this.pauseKey = KeyboardTools.getCharFromKeyPressEvent(data.nativeEvent);

                this.commitData();

            } else if (this.pauseCode) {
                if (KeyboardTools.getCharCodeFromKeyPressEvent(data.nativeEvent) == this.pauseCode) {
                    this.dispatchEvent(PauseKeyButtonEvent.PAUSE_KEY_PRESS);
                }
            }
        }
    }

    protected onKeyUp(data: InputManagerEventData): void {
        if (KeyboardTools.getCharCodeFromKeyPressEvent(data.nativeEvent) == this.pauseCode) {
            this.dispatchEvent(PauseKeyButtonEvent.PAUSE_KEY_UP);
        }
    }


    protected commitData(): void {
        super.commitData();

        if (this.isClicked) {
            this.text = FC.config.localization.pauseUpdateKeyBtnPressedLabel;

        } else if (this.pauseKey) {
            this.text = StringTools.substituteList(
                FC.config.localization.pauseUpdateKeyBtnNormalLabel,
                this.pauseKey
            );

        } else {
            this.text = StringTools.substituteList(
                FC.config.localization.pauseUpdateKeyBtnNormalLabel,
                FC.config.localization.pauseUpdateKeyBtnNoKeyHelpText
            );
        }
    }

    protected arrange(): void {
        super.arrange();

    }


    get isClicked(): boolean {
        return this._isClicked;
    }

    set isClicked(value: boolean) {
        if (value == this.isClicked) {
            return;
        }

        this._isClicked = value;

        this.commitData();
    }

    public get pauseKey(): string {
        return this._pauseKey;
    }
    public set pauseKey(value: string) {
        if (value === this._pauseKey) {
            return;
        }

        this._pauseKey = value;

        this.commitData();
    }

    private get pauseCode(): number {
        if (this.pauseKey) {
            return this.pauseKey.charCodeAt(0);
        } else {
            return undefined;
        }
    }
}