import {
  Modal,
  Form,
  Button,
  Select,
  Radio,
  Upload,
  UploadFile,
  message,
} from "antd";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useModalStore } from "../store/useModalStore";
import { useBlocksStore } from "../store/useBlocksStore";
import { useState } from "react";
import { toast } from "sonner";
import {
  networkDiagramData,
  pieDiagramDataWithImage,
} from "../utils/blocksData";

type FormValues = {
  hasImage: "yes" | "no";
  image?: UploadFile[];
  option: "pie" | "networkDiagram";
};

const { Option } = Select;

const ModalBlock = () => {
  const { isModalOpen, closeModal } = useModalStore();
  const { addBlock } = useBlocksStore();
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [form] = Form.useForm<FormValues>();
  const [, setLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      let blockData: any;

      switch (values.option) {
        case "pie":
          blockData = { ...pieDiagramDataWithImage };
          if (values.hasImage === "yes" && values.image?.[0]?.originFileObj) {
            const imageUrl = await convertToBase64(
              values.image[0].originFileObj
            );
            blockData.image = imageUrl;
          }
          break;
        case "networkDiagram":
          blockData = { ...networkDiagramData };
          break;
        default:
          blockData = {};
      }

      const newBlock = {
        id: Date.now().toString(),
        type: values.option,
        hasImage: values.hasImage === "yes",
        data: blockData,
      };

      addBlock(newBlock);
      form.resetFields();
      closeModal();
      toast.success("Block added successfully!");
    } catch (error) {
      toast.error("Failed to add block");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const normFile = (e: any): UploadFile[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isImage && isLt2M;
  };

  const onRadioChange = (e: any) => {
    setHasImage(e.target.value === "yes");
    form.setFieldsValue({ option: undefined });
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => {
        form.resetFields();
        closeModal();
      }}
      title="Add new Block"
      footer={null}
      destroyOnClose
    >
      <Form<FormValues>
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ hasImage: "no" }}
      >
        <Form.Item<FormValues>
          label="Do you want to upload an image?"
          name="hasImage"
          rules={[{ required: true, message: "Please select an option!" }]}
        >
          <Radio.Group onChange={onRadioChange}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        {hasImage && (
          <Form.Item<FormValues>
            label="Upload Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              name="logo"
              listType="picture"
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<FaCloudUploadAlt />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item<FormValues>
          label="Select Diagram Type"
          name="option"
          rules={[{ required: true, message: "Please select a diagram type!" }]}
        >
          {hasImage ? (
            <Select placeholder="Select a diagram">
            <Option value="pie">Pie Diagram</Option>
          </Select>
          ) : (
            <Select placeholder="Select a diagram">
              <Option value="networkDiagram">Network Diagram</Option>
            </Select>
          )}
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
