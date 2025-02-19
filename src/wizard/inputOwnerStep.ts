import { requiredValidator } from "../validator/requiredValidator";
import { InputPromptStep } from "./inputPromptStep";
import { WizardContext } from "./wizardContext";

export class InputOwnerStep extends InputPromptStep<WizardContext> {
    constructor() {
        super({
            name: "ownerQuery",
            displayName: "owner",
            options: {
                validateInput: (s: string) => { return requiredValidator.validate(s); },
                learnMoreLink: "https://documentation.sailpoint.com/saas/help/search/searchable-fields.html#searching-identity-data"
            }
        });
    }
}