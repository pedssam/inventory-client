import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { connect } from "react-redux";
import CurrencyFormat from "react-currency-format";

import React, { Fragment, useEffect, useState } from "react";

// component
import Wrapper from "../components/wrapper";

// antd
import {
  Button,
  Drawer,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Checkbox,
  DatePicker,
} from "antd";
import { Table } from "ant-table-extensions";

// config
import { config } from "../../../config";

// icons
import Check from "../../../assets/check.png";
import Close from "../../../assets/close.png";
import Trash from "../../../assets/trash.png";
import Export from "../../../assets/export.png";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import MinusOutlined from "@ant-design/icons/MinusOutlined";

// lodash
import { filter, isEmpty, isString, map, remove, sum } from "lodash";

const Receipt = ({
  // assigned valus
  baseUrl,
}) => {
  const [searchText, setSearchText] = useState("");

  const replaceChar = (char) => {
    let string = !isString(char) ? char.toString() : char;
    if (string) {
      if (string.includes("₱") || string.includes(",")) {
        return string.replace(/₱/g, "").replace(/,/g, "");
      }

      return char;
    }

    return 0;
  };

  useEffect(() => {
    loadData();
  }, []);

  const [drawer, setDrawer] = useState({
    open: false,
    title: "",
  });

  const [action, setAction] = useState({
    id: 0,
  });

  const { TextArea } = Input;

  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Ref No.",
      dataIndex: "receipt_ref_num",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.receipt_ref_num)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.receipt_for)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.add_or_less_stock)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.p_name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.date_time).toLowerCase().includes(value.toLowerCase())
        );
      },
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          <Checkbox
            style={{
              paddingRight: 5,
            }}
            onChange={(e) => selectRow(e, record.id)}
            checked={selected.includes(record.id)}
          />
          {value}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "receipt_for",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Pcs",
      dataIndex: "add_or_less_stock",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "p_name",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "selling",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          <CurrencyFormat
            value={value}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"₱"}
          />
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "selling",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          <CurrencyFormat
            value={value * record.add_or_less_stock}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"₱"}
          />
        </div>
      ),
    },
    {
      title: "Purchase Amount",
      dataIndex: "purchase_amount",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          <CurrencyFormat
            value={value}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"₱"}
          />
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date_time",
      render: (value, record) => (
        <div
          onDoubleClick={(e) => renderDrawer(record.receipt_ref_num, record)}
        >
          {moment(value).format("YYYY-M-DD")}
        </div>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([]);

  const loadData = () => {
    setLoading(true);

    axios
      .get(`${baseUrl}/load-receipt`)
      .then((res) => {
        setDataSource(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [dataHistory, setDataHistory] = useState({});
  const [limit, setLimit] = useState(10);

  const renderDrawer = (title, record = {}) => {
    form.resetFields();
    if (!isEmpty(record)) {
      setAction({ ...action, id: record.id });
      form.setFieldsValue(record);
      setDataHistory(record);
      setHasErrors(false);
    }

    setDrawer({ ...drawer, open: true, title });
  };

  const [form] = Form.useForm();
  const [hasErrors, setHasErrors] = useState(true);

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setHasErrors(hasErrors);
  };

  const onFinish = (values) => {
    let stock = dataHistory.current_stock;

    if (dataHistory.add_or_less_stock > values.add_or_less_stock) {
      stock =
        dataHistory.add_or_less_stock -
        values.add_or_less_stock +
        dataHistory.current_stock;
    } else if (dataHistory.add_or_less_stock < values.add_or_less_stock) {
      stock =
        dataHistory.current_stock -
        (values.add_or_less_stock - dataHistory.add_or_less_stock);
    }

    values.purchase_amount = replaceChar(values.purchase_amount);
    values.stock = stock;
    values.pid = dataHistory.p_id;

    axios
      .post(`${baseUrl}/put-receipt/${action.id}`, { ...values })
      .then((res) => {
        setDrawer({ ...drawer, open: false });
        form.resetFields();
        openNotification(`Update Receipt`, `Receipt successfully Updated`);
        loadData();
      });
  };

  const setStock = (set) => {
    let value = parseInt(form.getFieldValue("add_or_less_stock"));

    if (set === "minus") {
      value -= 1;
    } else if (set === "plus") {
      value += 1;
    } else {
      value = set.target.value;
    }

    const finalStock = value <= 0 ? 1 : value;

    form.setFieldsValue({
      add_or_less_stock: finalStock,
    });

    let purchase_amount = parseInt(form.getFieldValue("selling")) * finalStock;

    form.setFieldsValue({
      purchase_amount,
    });

    handleFormChange();
  };

  const deleteRecord = () => {
    axios.post(`${baseUrl}/delete-receipt/${action.id}`).then((res) => {
      openNotification(`Record successfully deleted`, `Deleted Receipt`);

      setDrawer({ ...drawer, open: false });
      loadData();
    });
  };

  const openNotification = (message, description, placement = "bottom") => {
    notification.success({
      message,
      description,
      placement,
    });
  };

  const [selected, setSelected] = useState([]);
  const selectRow = (e, id) => {
    if (e.target.checked) {
      selected.push(id);
    } else {
      const index = selected.indexOf(id);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }

    renderDataReceipt(e.target.checked, id);
    setSelected(selected);
    loadData();
  };

  const [dataReceipt, setDataReceipt] = useState([]);

  const renderDataReceipt = (tobeAdd, id) => {
    let result = filter(dataSource, { id: id })[0];

    if (tobeAdd) {
      dataReceipt.push(result);
    } else {
      remove(dataReceipt, { id });
    }
    setDataReceipt(dataReceipt);
  };

  const exportPdf = () => {
    html2canvas(document.querySelector("#generate-receipt")).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Ado Toys Receipt.pdf");
    });
  };

  const deleteSelected = () => {
    if (!isEmpty(selected)) {
      axios.post(`${baseUrl}/delete-receipts`, { selected }).then((res) => {
        openNotification(`Record successfully deleted`, `Deleted Receipt`);

        loadData();
      });
    }
  };

  const [receiptName, setReceiptName] = useState({
    label: "Enter name here...",
    click: false,
  });
  const [receiptDate, setReceiptDate] = useState({
    label: moment().format("YYYY-MM-DD"),
    click: false,
  });

  return (
    <Fragment>
      <Wrapper
        title={"Receipt Management"}
        subtitle={"Generate Receipt by Batch"}
      >
        <Drawer
          getContainer={false}
          closable={false}
          onClose={(e) => setDrawer({ ...drawer, open: false })}
          open={drawer.open}
          placement="right"
          footer={
            <>
              <Popconfirm
                placement="top"
                title={"Are you sure you want to delete?"}
                onConfirm={deleteRecord}
                okText="Yes"
                cancelText="Cancel"
              >
                <Button type="default" className="action-btn-half" size="large">
                  <img src={Trash} alt="trash" style={{ width: 16 }} />
                  Delete
                </Button>
              </Popconfirm>
              <Button
                className="action-btn-half"
                type="primary"
                size="large"
                disabled={hasErrors}
                onClick={() => form.submit()}
              >
                <img src={Check} alt="check" />
                Save Now
              </Button>
            </>
          }
        >
          <div className="title mt-2">
            <span className="text-lg w-100">
              {drawer.title}
              <img
                onClick={(e) => setDrawer({ ...drawer, open: false })}
                className="cursor-pointer pull-right"
                src={Close}
                style={{
                  marginRight: 5,
                }}
                alt="close"
              />
            </span>
            <label className="text-muted text-xs pt-2 d-block">
              Complete Receipt Details
            </label>
          </div>
          <div className="drawer-body pt-4">
            <Form
              form={form}
              labelCol={{ span: 24 }}
              autoComplete="off"
              layout="horizontal"
              onFinish={onFinish}
              onFieldsChange={handleFormChange}
            >
              <Form.Item initialValue={"N/A"} label="Item" name="p_name">
                <Input disabled={true} size="large" />
              </Form.Item>
              <Form.Item
                label="Pcs"
                name="add_or_less_stock"
                className="text-center"
                initialValue={1}
                rules={[
                  {
                    required: true,
                    message: "Number of Pcs is required",
                  },
                ]}
              >
                <Input
                  type="number"
                  className="stock-input text-center"
                  suffix={<PlusOutlined onClick={(e) => setStock("plus")} />}
                  prefix={<MinusOutlined onClick={(e) => setStock("minus")} />}
                  onChange={(e) => setStock(e)}
                  size="large"
                  placeholder="# of Pcs"
                />
              </Form.Item>
              <Form.Item
                label="Purchase Amount"
                name="purchase_amount"
                rules={[
                  {
                    required: true,
                    message: "Purchase Amount is required",
                  },
                ]}
              >
                <CurrencyFormat
                  size="large"
                  className="ant-input-lg w-100 text-end"
                  placeholder="0.00"
                  prefix={"₱"}
                  thousandSeparator={true}
                />
              </Form.Item>
              <Form.Item
                initialValue={"N/A"}
                label="Receipt For"
                name="receipt_for"
                rules={[
                  {
                    required: true,
                    message: "Receipt for is required",
                  },
                ]}
              >
                <Input size="large" placeholder="Receipt for.." />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <TextArea
                  rows={4}
                  placeholder="Description..."
                  style={{
                    border: "1px solid #737373",
                    borderRadius: 10,
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </Drawer>
        <div className="pb-3">
          <Input.Search
            placeholder="Search here..."
            className="mb-3"
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <label
            className="text-muted text-xs"
            style={{
              paddingRight: 5,
            }}
          >
            Number of Row:
          </label>
          <Select
            value={10}
            className="table-select pb-2"
            onChange={(e) => {
              setLimit(e);
            }}
          >
            <Select.Option key="1" value="10">
              10
            </Select.Option>
            <Select.Option key="2" value="25">
              25
            </Select.Option>
            <Select.Option key="3" value="50">
              50
            </Select.Option>
            <Select.Option key="4" value="80">
              80
            </Select.Option>
            <Select.Option key="5" value="10">
              100
            </Select.Option>
          </Select>
          <Popconfirm
            placement="top"
            title={"Are you sure you want to delete?"}
            onConfirm={deleteSelected}
            okText="Yes"
            cancelText="Cancel"
          >
            <Button className="pull-right">Delete Selected</Button>
          </Popconfirm>
        </div>
        <Table
          className="ant-table-content"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          exportable
          exportableProps={{
            fileName: "Receipt List",
            btnProps: {
              className: "export-btn",
              icon: <img src={Export} alt="export" />,
            },
          }}
          sortable
          pagination={{
            pageSize: limit,
          }}
        />
        <div className="receipt-container">
          <div className="title">
            <h6 className="font-weight-bold">Receipt Preview</h6>
            <span className="text-muted text-xs">
              Check item you want to add in receipt
            </span>
            <Button onClick={exportPdf} className="pull-right">
              Generate
            </Button>
          </div>
          <div className="receipt-body mt-3 p-4" id="generate-receipt">
            <div className="company-name">
              <div className="text-center">
                <h2>ADO TOYS</h2>
              </div>
              <div className="form mt-5 pt-5 pb-4 row">
                <div className="col-md-9">
                  <Form.Item label="Customer Name">
                    {receiptName.click && (
                      <Input
                        style={{
                          width: "70%",
                          border: "none",
                          borderBottom: "1px solid #cccc",
                        }}
                        onBlur={(e) => {
                          setReceiptName({
                            label: e.target.value,
                            click: false,
                          });
                        }}
                      />
                    )}
                    {!receiptName.click && (
                      <span
                        className="rec-details"
                        onClick={(e) => {
                          setReceiptName({ ...receiptName, click: true });
                        }}
                        style={{
                          background: "#3BCFB4",
                          color: "#ffff",
                          fontWeight: "500",
                        }}
                      >
                        {receiptName.label}
                      </span>
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item>
                    {receiptDate.click && (
                      <DatePicker
                        defaultValue={moment()}
                        format="YYYY/MM/DD"
                        style={{
                          width: "100%",
                          border: "none",
                          borderBottom: "1px solid #cccc",
                        }}
                        onBlur={(e) => {
                          setReceiptDate({
                            label: e.target.value,
                            click: false,
                          });
                        }}
                      />
                    )}

                    {!receiptDate.click && (
                      <span
                        className="rec-details"
                        onClick={(e) => {
                          setReceiptDate({ ...receiptDate, click: true });
                        }}
                      >
                        {receiptDate.label}
                      </span>
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className="receipt-item">
                <table className="table table-receipt">
                  <thead>
                    <tr>
                      <th>Pcs</th>
                      <th>Item</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataReceipt.map((value) => (
                      <tr key={value.id}>
                        <td> {value.add_or_less_stock} </td>
                        <td> {value.p_name} </td>
                        <td className="text-end">
                          <CurrencyFormat
                            value={value.selling}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </td>
                        <td className="text-end">
                          <CurrencyFormat
                            value={value.purchase_amount}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}></td>
                      <td className="text-end">
                        <CurrencyFormat
                          value={sum(map(dataReceipt, "purchase_amount"))}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Fragment>
  );
};

let mapStateToProps = () => {
  const { baseUrl } = config;
  return {
    baseUrl,
  };
};

export default connect(mapStateToProps)(Receipt);
