import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Form } from 'antd';
import { Rule } from 'antd/es/form';
import { ModalProps } from 'antd/es/modal';

interface Props {
  rules?: Rule[];
  placeholder?: string;
  ref?: any;
  value?: string;
  onPressEnter?: () => void;
  autoFocus?: boolean;
}

const PromptForm = forwardRef(
  ({ rules, placeholder, onPressEnter, value, autoFocus }: Props, ref: any) => {
    const [formInstance] = Form.useForm();

    useEffect(() => {
      formInstance.setFieldsValue({ input: value });
    }, []);

    useImperativeHandle(ref, () => ({
      validate: () => {
        return formInstance.validateFields().then((res) => res.input);
      },
    }));

    return (
      <Form form={formInstance}>
        <Form.Item name="input" rules={rules}>
          <Input
            placeholder={placeholder}
            onPressEnter={onPressEnter}
            autoFocus={autoFocus}
          />
        </Form.Item>
      </Form>
    );
  }
);

interface PromptConfig {
  title: string;
  value?: string;
  rules?: Rule[];
  placeholder?: string;
  modalProps?: Partial<ModalProps>;
  onOk?: (value?: string) => boolean | Promise<boolean>;
  autoFocus?: boolean;
}

interface PromptProps extends Props {
  modalProps?: Partial<ModalProps>;
  visible: boolean;
  submit: (value?: string) => void;
  close: (value?: string) => void;
  title: string;
  afterClose?: () => void;
}

function Prompt({
  rules,
  placeholder,
  modalProps = {},
  visible,
  submit,
  close,
  title,
  value,
  afterClose,
  autoFocus,
}: PromptProps) {
  const formRef = useRef<any>(null);
  const handleOk = async () => {
    try {
      const value = await formRef.current?.validate();
      submit(value);
    } catch (e) {
      // noop
    }
  };
  return (
    <Modal
      {...modalProps}
      visible={visible}
      onOk={handleOk}
      onCancel={() => close()}
      title={title}
      getContainer={false}
      afterClose={afterClose}
    >
      <PromptForm
        ref={formRef}
        rules={rules}
        value={value}
        placeholder={placeholder}
        onPressEnter={handleOk}
        autoFocus={autoFocus}
      />
    </Modal>
  );
}

export default function prompt(
  config: PromptConfig
): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const { onOk, ...others } = config;
    // eslint-disable-next-line no-use-before-define
    let currentConfig: PromptProps = {
      ...others,
      submit,
      close,
      visible: true,
    };

    const destroy = (value?: string) => {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
      if (value !== undefined) {
        resolve(value);
      } else {
        reject(value);
      }
    };

    function close(value?: string) {
      currentConfig = {
        ...currentConfig,
        visible: false,
        afterClose: () => destroy(value),
      };
      render(currentConfig);
    }
    async function submit(value?: string) {
      if (onOk) {
        const isClose = await onOk(value);
        if (isClose || isClose === undefined) {
          close(value);
        }
      } else {
        close(value);
      }
    }

    function render(props: PromptProps) {
      ReactDOM.render(<Prompt {...props} />, div);
    }

    render(currentConfig);
  });
}
