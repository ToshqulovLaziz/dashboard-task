import { Modal, Form, Button, Input, Select, InputNumber } from "antd";
import { useModalStore } from "../store/useModalStore";

const ModalBlock = () => {
  const { isModalOpen, closeModal } = useModalStore();
  const [form] = Form.useForm();
  const onFinish = () => {};
  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      title="Add new Block"
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="First Name"
          name="firstname"
          rules={[{ required: true, message: "Iltimos, ismingizni kiriting!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastname"
          rules={[
            { required: true, message: "Iltimos, familiyangizni kiriting!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalBlock;
