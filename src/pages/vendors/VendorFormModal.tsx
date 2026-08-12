import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  App as AntApp,
} from "antd";
import { useGetPeptidesQuery } from "@/features/peptides/peptidesApi";
import {
  useCreateVendorMutation,
  useUpdateVendorMutation,
} from "@/features/vendor/vendorApi";
import type { Vendor, VendorPayload } from "@/types";

interface VendorFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: Vendor | null;
}

const qualityOptions = ["Premium", "Standard", "Economy"];
const statusOptions = ["active", "delete"] as const;
const paymentMethodOptions = [
  "Credit/Debit Card",
  "Paypal",
  "Stripe",
  "Bank",
  "Apple Pay",
  "Google Pay",
] as const;

export default function VendorFormModal({ open, onClose, editing }: VendorFormModalProps) {
  const [form] = Form.useForm<VendorPayload>();
  const { data: peptides } = useGetPeptidesQuery();
  const [createVendor, { isLoading: creating }] = useCreateVendorMutation();
  const [updateVendor, { isLoading: updating }] = useUpdateVendorMutation();
  const { message } = AntApp.useApp();
  const hasDiscount = Form.useWatch("has_discount", form);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        is_verified: editing.is_verified,
        rating: editing.rating,
        total_reviews: editing.total_reviews,
        about: editing.about,
        price_per_unit: editing.price_per_unit,
        peptide:
          typeof editing.peptide === "string" ? editing.peptide : editing.peptide._id,
        unit: editing.unit,
        quality: editing.quality,
        has_discount: editing.has_discount,
        discount_amount: editing.discount_amount,
        is_stock: editing.is_stock,
        delivery_cost: editing.delivery_cost,
        payment_methods: editing.payment_methods ?? [],
        coupon_code: editing.coupon_code,
        website_url: editing.website_url,
        peptide_amount: editing.peptide_amount,
        status: editing.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        is_verified: false,
        has_discount: false,
        is_stock: true,
        status: "active",
        quality: "Standard",
        payment_methods: [],
        rating: 0,
        total_reviews: 0,
      });
    }
  }, [open, editing, form]);

  const onSubmit = async (values: VendorPayload) => {
    try {
      if (editing) {
        await updateVendor({ id: editing._id, body: values }).unwrap();
        message.success("Vendor updated");
      } else {
        await createVendor(values).unwrap();
        message.success("Vendor created");
      }
      onClose();
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Something went wrong";
      message.error(description);
    }
  };

  return (
    <Modal
      title={editing ? "Edit vendor listing" : "Add vendor listing"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={creating || updating}
      okText={editing ? "Save changes" : "Create"}
      width={680}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="Listing name"
              name="name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input placeholder="e.g. Premium Peptide Package" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Verified vendor" name="is_verified" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Peptide"
              name="peptide"
              rules={[{ required: true, message: "Please select a peptide" }]}
            >
              <Select
                placeholder="Select peptide"
                showSearch
                optionFilterProp="label"
                options={peptides?.data.map((p) => ({ value: p._id, label: p.name }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Quality" name="quality">
              <Select
                options={qualityOptions.map((q) => ({ value: q, label: q }))}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Price per unit"
              name="price_per_unit"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0} prefix="$" className="w-full!" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0} className="w-full!" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Peptide amount (mg)" name="peptide_amount">
              <InputNumber min={0} className="w-full!" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0} max={5} step={0.1} className="w-full!" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Total reviews"
              name="total_reviews"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0} className="w-full!" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Delivery cost" name="delivery_cost">
              <InputNumber min={0} prefix="$" className="w-full!" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Has discount" name="has_discount" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Discount amount (%)" name="discount_amount">
              <InputNumber min={0} max={100} disabled={!hasDiscount} className="w-full!" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Coupon code" name="coupon_code">
              <Input placeholder="e.g. SAVE25" disabled={!hasDiscount} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="In stock" name="is_stock" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={statusOptions.map((s) => ({ value: s, label: s }))} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Payment methods"
          name="payment_methods"
          rules={[{ required: true, message: "Select at least one payment method" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select accepted payment methods"
            options={paymentMethodOptions.map((method) => ({
              value: method,
              label: method,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Website URL"
          name="website_url"
          rules={[{ required: true, message: "Please enter a website URL" }]}
        >
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item
          label="About"
          name="about"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={3} placeholder="Short description of this listing" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
