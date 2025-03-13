import { BaseConsoleButton } from "../BaseConsoleButton";
import { InputManager, InputManagerEvent, InputManagerEventData } from "@flashist/flibs";
import { KeyboardTools, StringTools } from "@flashist/fcore";
import { CaptureKeyButtonEvent } from "./CaptureKeyButtonEvent";
import { FC } from "../../FC";

export class CaptureKeyButton extends BaseConsoleButton {

    private _captureKeyCode: string;
    public captureKey: string;

    private _isClicked: boolean;


    protected addListeners(): void {
        super.addListeners();

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
            this.captureKeyCode = null;
        }
    }

    protected onKeyUp(data: InputManagerEventData): void {
        if (this.view.visible) {
            if (this.isClicked) {
                this.isClicked = false;
                this.captureKey = data.nativeKeyboardEvent.key;
                this.captureKeyCode = data.nativeKeyboardEvent.code;

                this.commitData();

            } else if (this.captureKeyCode) {
                if (this.captureKeyCode === data.nativeKeyboardEvent.code) {
                    this.dispatchEvent(CaptureKeyButtonEvent.CAPTURE_KEY_PRESS);
                }
            }
        }
    }


    protected commitData(): void {
        super.commitData();

        if (this.isClicked) {
            this.text = FC.config.localization.captureKeyBtnPressedLabel;

        } else if (this.captureKeyCode) {
            this.text = StringTools.substitute(
                FC.config.localization.captureKeyBtnNormalLabel,
                {
                    key: this.captureKey
                }
            );

        } else {
            this.text = StringTools.substituteList(
                FC.config.localization.captureKeyBtnNormalLabel,
                {
                    key: FC.config.localization.captureKeyBtnNoKeyHelpText
                }
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

    public get captureKeyCode(): string {
        return this._captureKeyCode;
    }
    public set captureKeyCode(value: string) {
        if (value === this._captureKeyCode) {
            return;
        }

        this._captureKeyCode = value;

        this.commitData();
    }

}