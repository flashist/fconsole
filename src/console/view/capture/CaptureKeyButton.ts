import {BaseConsoleButton} from "../BaseConsoleButton";
import {InputManager, InputManagerEvent, InputManagerEventData} from "fsuite";
import {KeyboardTools, StringTools} from "fcore";
import {CaptuerKeyButtonEvent} from "./CaptureKeyButtonEvent";
import {FC} from "../../FC";

export class CaptureKeyButton extends BaseConsoleButton {

    /*private static CAPTURE_LABEL_FIRST_PART:string = "Capture key:";
    private static NO_CAPTURE_KEY_TEXT:string = "(click to add)";
    private static CLICKED_HELP_TEXT:string = "Press a key";*/

    private _captureKey: string;

    private _isClicked: boolean;


    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            InputManager.instance,
            InputManagerEvent.KEY_PRESS,
            this.onKeyPress
        );
    }


    protected onClick(): void {
        super.onClick();

        this.isClicked = !this.isClicked;
    }

    protected onKeyPress(data: InputManagerEventData): void {
        if (this.view.worldVisible) {
            if (this.isClicked) {
                this.isClicked = false;
                this.captureKey = KeyboardTools.getCharFromKeyPressEvent(data.nativeEvent);

                this.commitData();

            } else if (this.captureCode) {
                if (KeyboardTools.getCharCodeFromKeyPressEvent(data.nativeEvent) == this.captureCode) {
                    this.dispatchEvent(CaptuerKeyButtonEvent.CAPTURE_KEY_PRESS);
                }
            }
        }
    }


    protected commitData(): void {
        super.commitData();

        if (this.isClicked) {
            this.label = FC.config.localization.captureKeyBtnPressedLabel;

        } else if (this.captureKey) {
            this.label = StringTools.substituteList(
                FC.config.localization.captureKeyBtnNormalLabel,
                this.captureKey
            );

        } else {
            this.label = StringTools.substituteList(
                FC.config.localization.captureKeyBtnNormalLabel,
                FC.config.localization.captureKeyBtnNoKeyHelpText
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

    public get captureKey(): string {
        return this._captureKey;
    }
    public set captureKey(value: string) {
        if (value === this._captureKey) {
            return;
        }

        this._captureKey = value;

        this.commitData();
    }

    private get captureCode(): number {
        if (this.captureKey) {
            return this.captureKey.charCodeAt(0);
        } else {
            return undefined;
        }
    }
}