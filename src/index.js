import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Modal, Input, Form } from "antd";

// antd v4 migration: https://ant.design/components/form/v3
const isV4 = !!Form.useForm;

class PromptForm extends Component {
  render() {
    const { form, rules, placeholder, wrappedComponentRef } = this.props;
    const getFieldDecorator = isV4 ? null : form.getFieldDecorator;
    return (
      <Form ref={wrappedComponentRef}>
        {isV4 ? (
          <Form.Item name="input" rules={rules}>
            <Input placeholder={placeholder} />
          </Form.Item>
        ) : (
          <Form.Item>
            {getFieldDecorator("input", {
              rules
            })(<Input placeholder={placeholder} />)}
          </Form.Item>
        )}
      </Form>
    );
  }
}

const EnhancedPromptForm = isV4 ? PromptForm : Form.create()(PromptForm);

class Prompt extends Component {
  state = { visible: false };
  formRef = React.createRef();
  onOk = async () => {
    if (isV4) {
      try {
        const values = await this.formRef.current.validateFields();
        this.props.close(values.input);
      } catch (e) {
        // noop
      }
    } else {
      this.formRef.current.props.form.validateFields(async (err, values) => {
        if (!err) {
          this.props.close(values.input);
        }
      });
    }
  };
  render() {
    const { modalProps, rules, placeholder } = this.props;
    return (
      <Modal
        {...modalProps}
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={() => this.props.close()}
        title={this.props.title}
        getContainer={false}
        afterClose={this.props.afterClose}
      >
        <EnhancedPromptForm
          wrappedComponentRef={this.formRef}
          rules={rules}
          placeholder={placeholder}
        />
      </Modal>
    );
  }
}

export default function prompt(config) {
  return new Promise((resolve, reject) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    // eslint-disable-next-line no-use-before-define
    let currentConfig = { ...config, close, visible: true };

    function destroy(value) {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
      if (value !== undefined) {
        resolve(value);
      } else {
        reject(value);
      }
    }

    function render(props) {
      ReactDOM.render(<Prompt {...props} />, div);
    }

    function close(value) {
      currentConfig = {
        ...currentConfig,
        visible: false,
        afterClose: destroy.bind(this, value)
      };
      render(currentConfig);
    }

    render(currentConfig);
  });
}
