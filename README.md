# antd-prompt

An ant.design helper that auto create a Modal with an optional message prompting the user to input some text.

Support antd v4.

## Installation

```sh
npm i antd-prompt
```

## Usage

[![Edit antd-prompt](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/antd-prompt-fohcs?fontsize=14)

```js
import React, { component } from 'react';
import ReactDOM from 'react-dom';
import prompt from 'antd-prompt';
import { Button, message } from 'antd';

class App extends Component {
    handler = async () => {
        try {
            const name = await prompt({
                title: "Please enter name",
                placeholder: "Your name",
                rules: [
                    // check this link for more help: https://ant.design/components/form/#Validation-Rules
                    {
                        required: true,
                        message: "You must enter name"
                    }
                ],
                modalProps: {
                    width: '80%'
                }
            });
        } catch (e) {
            message.error('Please enter name');
        }
    }
    render() {
        return <div>
            <Button onClick={this.handler}>Set Name</Button>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

## Keep modal open after submit


```js
import React, { component } from 'react';
import ReactDOM from 'react-dom';
import prompt from 'antd-prompt';
import { Button, message } from 'antd';

class App extends Component {
    handler = async () => {
        await prompt({
            title: "Please enter name",
            value: 'Initial Value',
            modalProps: {
                width: '80%'
            },
            onOk: name => {
                // do something with name
                return false;
                // or return Promise.resolve(false);
            }
        });
    }
    render() {
        return <div>
            <Button onClick={this.handler}>Set Name</Button>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

