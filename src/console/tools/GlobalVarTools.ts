import {UniqueTools, StringTools} from "@flashist/fcore";

import {FC} from "../FC";

export class GlobalVarTools {
    static getNextGlobalVarName(): string {
        const tempUniqueId: string = UniqueTools.getUniqueIdForPool(FC.config.displayListSettings.globalVarPoolId);
        const result: string = StringTools.substituteList(FC.config.displayListSettings.globalVarNamePattern, tempUniqueId);
        return result;
    }

    static storeObjectAsGlobalVar(object: any): void {
        const tempId: string = GlobalVarTools.getNextGlobalVarName();

        console.log(tempId);
        window[tempId] = object;
    }
}