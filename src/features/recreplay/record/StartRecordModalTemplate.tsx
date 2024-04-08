import { Modal, ModalHeader, TemplateProps } from "@/atoms/Modal";
import { ReactElement } from "react";
import { Form, Formik, FormikConfig } from "formik";
import ConfirmationButtons from "@/atoms/Modal/ConfirmationButtons";
import { withModalTemplate } from "@/atoms/Modal/withModalTemplate";
import InputField from "~/features/shared/forms/fields/InputField";
import { object, string } from "yup";
import { useNavigate } from "react-router-dom";

interface Props {}

interface StartRecordModel {
  sequenceName: string;
  baseUrl: string;
}

function StartRecordModalTemplate({
  modalProps,
}: TemplateProps<Props>): ReactElement {
  const navigate = useNavigate();
  type NewType = FormikConfig<StartRecordModel>;

  const formikProps: NewType = {
    initialValues: {
      sequenceName: "",
      baseUrl: "",
    },
    validationSchema: object().shape({
      sequenceName: string().required("Sequence Name is required."),
      baseUrl: string().required("Base Url is required."),
    }),
    onSubmit: async (values) => {
      navigate("/recreplay/record-session", {
        state: {
          ...values,
          startDate: new Date().toString(),
        },
      });
    },
  };

  return (
    <Formik {...formikProps}>
      {({ isValid, submitForm }) => {
        return (
          <Modal
            {...modalProps}
            disableAutoFocus
            header={<ModalHeader title="Start Record" />}
            actionButtons={
              <ConfirmationButtons
                color="danger"
                onClose={modalProps.onClose}
                confirmationLabel={"Start"}
                confirmationDisabled={!isValid}
                onConfirm={submitForm}
                closeOnConfirm={false}
              />
            }
            modalContentStyle="w-1/2"
          >
            <Form autoComplete="off">
              <InputField name="baseUrl" label="Enter Base URL" />
              <InputField name="sequenceName" label="Sequence Name" />
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
}

export default withModalTemplate(StartRecordModalTemplate);
