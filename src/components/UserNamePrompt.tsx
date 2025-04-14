import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserNamePrompt = ({ onSubmit }: UserNamePromptProps) => {
  const [form] = Form.useForm();

  const onFinish = (values: { name: string }) => {
    const trimmedName = values.name.trim();
    if (trimmedName) {
      onSubmit(trimmedName);
      sessionStorage.setItem("userDashName", trimmedName);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card 
        className="w-full max-w-md p-8 bg-[#1f1f2e] border border-gray-700 rounded-xl shadow-lg"
        bordered={false}
      >
        <div className="text-center mb-6">
          <Title level={3} className="text-white">
            Welcome to the Dashboard
          </Title>
          <p className="text-gray-400 mt-2">
            Please enter your name to continue
          </p>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ 
              required: true, 
              message: "Please enter your name" 
            }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Enter your name" 
              size="large"
              className="bg-gray-800 border-gray-700 text-white hover:border-gray-600 focus:border-gray-500"
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-500 border-none font-medium"
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserNamePrompt;