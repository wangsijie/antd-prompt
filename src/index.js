import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Form } from 'antd';

class PromptForm extends Component {
    render() {
        const { form, rules, placeholder } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('input', {
                        rules
                    })(<Input placeholder={placeholder} />)}
                </Form.Item>
            </Form>
        );
    }
}

const EnhancedPromptForm = Form.create()(PromptForm);

class Prompt extends Component {
    state = { visible: false }
    onOk = () => {
        this.formRef.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.props.close(values.input);
            }
        });
    }
    render() {
        const { modalProps, rules, placeholder } = this.props;
        return <Modal
            {...modalProps}
            visible={this.props.visible}
            onOk={this.onOk}
            onCancel={() => this.props.close()}
            title={this.props.title}
            getContainer={false}
            afterClose={this.props.afterClose}
        >
            <EnhancedPromptForm
                wrappedComponentRef={ref => this.formRef = ref}
                rules={rules}
                placeholder={placeholder}
            />
        </Modal>
    }
}


export default function prompt(config) {
    return new Promise((resolve, reject) => {
        const div = document.createElement('div');
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
                afterClose: destroy.bind(this, value),
            };
            render(currentConfig);
        }

        render(currentConfig);
    });
}
