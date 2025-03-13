import { BaseConsoleButton } from "../BaseConsoleButton";
import { InputManager, InputManagerEvent, InputManagerEventData, FApp } from "@flashist/flibs";
import { StringTools } from "@flashist/fcore";

import { FC } from "../../FC";

export class PauseKeyButton extends BaseConsoleButton {

    private _pauseKeyCode: string;
    public pauseKey: string;

    private _isClicked: boolean;
    private _isActivated: boolean;

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            InputManager.instance,
            InputManagerEvent.KEY_UP,
            this.onKeyUp
        );

        FApp.instance.ticker.add(this.onTick, this);
    }

    protected onTick(): void {
        if (!this.isClicked) {

        }
    }

    protected onClick(): void {
        super.onClick();

        this.isClicked = !this.isClicked;
        if (this.isClicked) {
            this.pauseKeyCode = null;
            this.isActivated = false;
        }
    }

    protected onKeyUp(data: InputManagerEventData): void {
        if (this.view.visible) {
            if (this.isClicked) {
                this.isClicked = false;
                this.pauseKey = data.nativeKeyboardEvent.key;
                this.pauseKeyCode = data.nativeKeyboardEvent.code;

                this.commitData();

            } else {
                if (this.pauseKeyCode) {
                    if (this.pauseKeyCode === data.nativeKeyboardEvent.code) {
                        this.isActivated = !this.isActivated;
                    }
                }
            }
        }
    }

    protected commitData(): void {
        super.commitData();

        if (this.isClicked) {
            this.text = FC.config.localization.pauseUpdateKeyBtnPressedLabel;

        } else if (this.pauseKeyCode) {
            if (this.isActivated) {
                this.text = StringTools.substitute(
                    FC.config.localization.pauseUpdateKeyBtnNormalLabel,
                    {
                        key: this.pauseKey,
                        status: FC.config.localization.onStatus
                    }
                );

            } else {
                this.text = StringTools.substitute(
                    FC.config.localization.pauseUpdateKeyBtnNormalLabel,
                    {
                        key: this.pauseKey,
                        status: FC.config.localization.offStatus
                    }
                );
            }

        } else {
            this.text = StringTools.substitute(
                FC.config.localization.pauseUpdateKeyBtnNormalLabel,
                {
                    key: FC.config.localization.pauseUpdateKeyBtnNoKeyHelpText
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

    public get pauseKeyCode(): string {
        return this._pauseKeyCode;
    }
    public set pauseKeyCode(value: string) {
        if (value === this._pauseKeyCode) {
            return;
        }

        this._pauseKeyCode = value;

        this.commitData();
    }

    get isActivated(): boolean {
        return this._isActivated;
    }
    set isActivated(value: boolean) {
        if (value === this.isActivated) {
            return;
        }

        this._isActivated = value;

        this.commitData();
    }
}