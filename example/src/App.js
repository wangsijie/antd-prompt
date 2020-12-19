import React from 'react';
import prompt from 'antd-prompt';
import { Button, message } from 'antd';
import 'antd/dist/antd.css';

function App() {
  const handler = async () => {
    try {
      const name = await prompt({
        title: 'Please enter name',
        placeholder: 'Your name',
        rules: [
          // check this link for more help: https://ant.design/components/form/#Validation-Rules
          {
            required: true,
            message: 'You must enter name',
          },
        ],
        modalProps: {
          width: '80%',
        },
      });
      message.info(`Your name is: ${name}`);
    } catch (e) {
      message.error('Please enter name');
    }
  };
  return (
    <div>
      <Button onClick={handler}>Set Name</Button>
    </div>
  );
}

export default App;
