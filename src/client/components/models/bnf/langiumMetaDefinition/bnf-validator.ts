// This is the grammar definition of the BNF language
// It is used to define the grammar of the language itself
// It is not used in the project, but for generating the parser and the language server

//eslint-disable

import type { ValidationChecks, ValidationAcceptor } from "langium";
import type { BnfAstType, Model } from "./generated/ast.js";
import type { BnfServices } from "./bnf-module.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: BnfServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.BnfValidator;
  const checks: ValidationChecks<BnfAstType> = {
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
  checkReferenceIDIsPreviuoslyDefined(
    model: Model,
    accept: ValidationAcceptor
  ): void {
    const referenceIDs: string[] = [];

    // Get all reference IDs
    model.rules.forEach((rule) => {
      referenceIDs.push(rule.name);
    });

    // Check if the reference ID is previously defined
    model.rules.forEach((rule) => {
      rule.alternatives.forEach((alternative) => {
        alternative.elements.forEach((element) => {
          if (element.reference) {
            if (!referenceIDs.includes(element.reference)) {
              accept(
                "error",
                `Reference ${element.reference}  is not previously defined`,
                {
                  node: element,
                }
              );
            }
          }
        });
      });
    });
  }
}
