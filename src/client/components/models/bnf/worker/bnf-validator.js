/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.BnfValidator;
    const checks = {
        // Add your validation checks
        Model: validator.checkReferenceIDIsPreviuoslyDefined,
    };
    registry.register(checks, validator);
}
/**
 * Implementation of custom validations.
 */
export class BnfValidator {
    /**
     * Check if the reference ID is previously defined.
     */
    checkReferenceIDIsPreviuoslyDefined(model, accept) {
        const referenceIDs = [];
        // Get all reference IDs
        model.rules.forEach(rule => {
            referenceIDs.push(rule.name);
        });
        // Check if the reference ID is previously defined
        model.rules.forEach(rule => {
            rule.alternatives.forEach(alternative => {
                alternative.elements.forEach(element => {
                    if (element.reference) {
                        if (!referenceIDs.includes(element.reference)) {
                            accept('error', `Reference ${element.reference}  is not previously defined`, {
                                node: element
                            });
                        }
                    }
                });
            });
        });
    }
}
//# sourceMappingURL=bnf-validator.js.map