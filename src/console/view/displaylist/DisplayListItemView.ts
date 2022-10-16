import { IFDisplayObjectUnderPointVO, InteractiveEvent, FContainer, DisplayObjectContainer, FLabel } from "@flashist/flibs";
import { Config, FC, ITooltipData } from "../../..";
import { GlobalVarTools } from "../../tools/GlobalVarTools";


export class DisplayListItemView extends FContainer<IFDisplayObjectUnderPointVO> {

    public contentCont: DisplayObjectContainer;
    public field: FLabel;

    private _text: string = "";

    private tooltipData: ITooltipData;

    public isVisualControlsEnabled: boolean = false;

    constructor() {
        super();
    }

    protected construction(): void {
        super.construction();

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);
        this.contentCont.interactive = true;
        this.contentCont.buttonMode = true;

        this.field = new FLabel({
            autosize: true,
            color: FC.config.displayListSettings.hierarchyLabelColor,
            size: FC.config.displayListSettings.hierarchyLabelSize
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
        // this.contentCont.alpha = 1;
        this.field.color = FC.config.displayListSettings.hierarchyLabelColorOver;

        FC.tooltipManager.show(this.tooltipData);
    }

    private onOut(): void {
        // this.contentCont.alpha = 0.75;
        this.field.color = FC.config.displayListSettings.hierarchyLabelColor;

        FC.tooltipManager.hide();
    }

    protected onClick(): void {
        this.onOut();

        //
        console.log(this.data.object);
        GlobalVarTools.storeObjectAsGlobalVar(this.data.object);

        if (this.isVisualControlsEnabled) {
            this.data.object.visible = !this.data.object.visible;
        }
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