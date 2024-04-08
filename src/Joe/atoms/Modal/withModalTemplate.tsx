import React, { ReactElement } from "react";
import { TemplateProps } from "./Modal";

/**
 * For the time being, this HOC only ensures that the Modal component is mounted
 * at open, resetting any state it had and triggering any effect for the first time.
 *
 * It is however better to write the BaseComponent itself to be **not** dependant
 * on the mounting lifecycle as per React guidelines.
 *
 * - Check that the state/form is correct even if the initial props change
 * - Check that effects run correctly even after the first mount, e.g. they re-run
 *   when the modal is opened or always have the correct returned value
 * - Check that any effect is run successfully before the modal is closed,
 *   e.g. onSubmit async effects complete in time. When the modal is closed, the
 *   component is unmounted and effects may not run in time.
 */
export function withModalTemplate<P = JSX.IntrinsicAttributes>(
  BaseComponent: (props: TemplateProps<P>) => ReactElement | null
): (props: TemplateProps<P>) => ReactElement | null {
  return function ModalTemplate(props): ReactElement | null {
    return props.modalProps.isOpen ? <BaseComponent {...props} /> : null;
  };
}
