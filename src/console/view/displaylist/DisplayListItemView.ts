import {IFDisplayObjectUnderPointVO, InteractiveEvent, FContainer, DisplayObjectContainer, FLabel} from "@flashist/flibs";
import {Config, FC, ITooltipData} from "../../..";


export class DisplayListItemView extends FContainer<IFDisplayObjectUnderPointVO> {

    public contentCont: DisplayObjectContainer;
    public field: FLabel;

    private _text: string = "";

    private tooltipData: ITooltipData;

    constructor() {
        super();
    }

    protected construction(): void {
        super.construction();

        this.contentCont = new FContainer();
        this.contentCont.interactive = true;
        this.contentCont.buttonMode = true;

        this.field = new FLabel({
            autosize: true,
            color: FC.config.btnSettings.labelColor,
            size: FC.config.btnSettings.labelSize
        });
        this.contentCont.addChild(this.field);

        this.tooltipData = {
            title: FC.config.localization.displayListItemTooltipTitle
        };

        this.commitData();
        this.onOut();
    }


    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.contentCont,
            InteractiveEvent.OVER,
            this.onOver
        );
        this.eventListenerHelper.addEventListener(
            this.contentCont,
            InteractiveEvent.OUT,
            this.onOut
        );
        this.eventListenerHelper.addEventListener(
            this.contentCont,
            InteractiveEvent.TAP,
            this.onClick
        );
        this.eventListenerHelper.addEventListener(
            this.contentCont,
            InteractiveEvent.UP_OUTSIDE,
            this.onOut
        );
    }


    private onOver(): void {
        this.contentCont.alpha = 1;

        FC.tooltipManager.show(this.tooltipData);
    }

    private onOut(): void {
        this.contentCont.alpha = 0.75;

        FC.tooltipManager.hide();
    }

    protected onClick(): void {
        this.onOut();

        //
        console.log(this.data.object);
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