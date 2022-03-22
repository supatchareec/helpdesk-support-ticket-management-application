import { Form, Input, Button, Tag, Table, Modal } from "antd";
import { React, Component } from "react";
import axios from "axios";
import moment from 'moment';

const { TextArea } = Input;
const { confirm } = Modal;
const FormItem = Form.Item;
const url = "http://localhost:8080";

class TicketRecord extends Component {
  constructor() {
    super();
    const showHeader = true;
    this.state = {
      currentId: null,
      editing: false,
      newTicket: {
        title: "",
        description: "",
        contact: "",
      },
      ticketRecords: [],
      tableConfiguration: {
        bordered: true,
        loading: false,
        pagination: true,
        size: "small",
        showHeader,
        scroll: undefined,
      },
      modal: {
        title: "Create Ticket",
        visible: false,
        submitLoading: false,
      },
    };
    this.updateTicket = this.updateTicket.bind(this);
    this.saveNewTicket = this.saveNewTicket.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changeContact = this.changeContact.bind(this);
    this.handleUpdateTicket = this.handleUpdateTicket.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showCancelConfirm = this.showCancelConfirm.bind(this);
  }

  fetchTicket() {
    axios
      .get(`${url}/tickets`)
      .then((response) => {
        console.log(response.data);
        this.setState({
          ticketRecords: response.data,
          tableConfiguration: { loading: false },
        });
      })
      .catch((err) => {
        console.log("Network " + err);
      });
  }

  componentWillMount() {
    this.fetchTicket();
  }

  createTicketRecord(ticketRecord) {
    axios
      .post(`${url}/ticket`, ticketRecord)
      .then((response) => {
        ticketRecord.id = response.data.id;
        this.fetchTicket();
      })
      .catch((err) => {
        debugger;
        console.log(err);
      });
  }

  updateTicketRecord(ticketRecord) {
    const ticketTitle = ticketRecord.data.title;
    const ticketDescription = ticketRecord.data.description;
    const ticketContact = ticketRecord.data.contact;
    const ticketStatus = ticketRecord.data.status;
    fetch(
      `${url}/ticket/` + ticketRecord.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: ticketTitle,
          description: ticketDescription,
          contact: ticketContact,
          status: ticketStatus,
        }),
      }
    ).then((response) => {
      this.fetchTicket();
      console.log("Update success!", response);
    });
  }

  saveNewTicket = (e) => {
    this.setState({
      tableConfiguration: { loading: true },
      modal: { ...this.state.modal, submitLoading: true },
    });
    const ticketRecord = {};
    ticketRecord.title = this.state.newTicket.title;
    ticketRecord.description = this.state.newTicket.description;
    ticketRecord.contact = this.state.newTicket.contact;

    this.createTicketRecord(ticketRecord);
    this.fetchTicket();
    this.setState({
      editing: false,
      newTicket: { title: "", description: "", contact: "" },
      tableConfiguration: { loading: false },
      modal: { ...this.state.modal, visible: false, submitLoading: false },
    });
  };

  updateTicket = (e) => {
    this.setState({
      modal: { ...this.state.modal, submitLoading: true },
    });
    const ticketRecord = {};
    ticketRecord.id = this.state.currentId;
    ticketRecord.data = this.state.newTicket;
    this.updateticketRecord(ticketRecord);
    this.setState({
      editing: false,
      newTicket: { title: "", description: "", contact: "" },
      modal: { ...this.state.modal, visible: false, submitLoading: false },
    });
  };

  changeTitle = (e) => {
    this.setState({
      newTicket: { ...this.state.newTicket, title: e.target.value },
    });
  };

  changeDescription = (e) => {
    this.setState({
      newTicket: { ...this.state.newTicket, description: e.target.value },
    });
  };

  changeContact = (e) => {
    this.setState({
      newTicket: { ...this.state.newTicket, contact: e.target.value },
    });
  };

  handleUpdateTicket = (e) => {
    this.setState({
      currentId: e.id,
      editing: true,
      newTicket: {
        title: e.title,
        description: e.description,
        contact: e.contact,
      },
    });
  };

  showCancelConfirm = () => {
    if (
      this.state.newTicket.title ||
      this.state.newTicket.description ||
      this.state.newTicket.contact
    ) {
      confirm({
        title: "Cancel?",
        content: "Changes you made may not be saved.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.handleCancel();
        },
      });
    } else {
      this.handleCancel();
    }
  };

  showModal = () => {
    this.setState({
      modal: { ...this.state.modal, visible: true },
    });
  };

  handleCancel = () => {
    this.setState({
      editing: false,
      newTicket: { title: "", description: "", contact: "" },
      modal: { ...this.state.modal, visible: false },
    });
  };

  getFullDate = (date) => {
    const d = moment(new Date(date));
    return d.format("hh:mm DD-MM-YYYY")
  }

  render() {
    const data = this.state.ticketRecords;

    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text) => <strong>{text}</strong>,
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
      },
      {
        title: "Contact Information",
        dataIndex: "contact",
        key: "contact",
        sorter: (a, b) => a.contact.localeCompare(b.contact),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        defaultSortOrder: 'descend',
        sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        render: ((date) => this.getFullDate(date))
      },
      {
        title: "Update At",
        dataIndex: "updateAt",
        key: "updateAt",
        sorter: (a, b) => moment(a.updateAt).unix() - moment(b.updateAt).unix(),
        render: ((date) => this.getFullDate(date))
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          {
            text: "Pending",
            value: "pending",
          },
          {
            text: "Accepted",
            value: "accepted",
          },
          {
            text: "Resolved",
            value: "resolved",
          },
          {
            text: "Rejected",
            value: "rejected",
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (value, record) => {
          let colorTag = "";
          switch (record.status) {
            case "pending":
              colorTag = "default";
              break;
            case "accepted":
              colorTag = "blue";
              break;
            case "resolved":
              colorTag = "green";
              break;
            case "rejected":
              colorTag = "red";
              break;
            default:
              break;
          }
          return (
            <Tag color={colorTag} key={record.id}>
              {record.status.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <div onClick={() => this.handleUpdateTicket(record)}>Edit</div>
          </span>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Create Ticket
        </Button>
        <Modal
          title={this.state.modal.title}
          visible={this.state.modal.visible}
          footer={[
            <Button key="cancel" onClick={this.showCancelConfirm}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.submitLoading}
              onClick={
                this.state.editing ? this.updateTicket : this.saveNewTicket
              }
            >
              Save
            </Button>,
          ]}
        >
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <FormItem label="Title">
              <Input
                type="text"
                value={this.state.newTicket.title}
                placeholder="Title"
                onChange={this.changeTitle}
              />
            </FormItem>
            <FormItem label="Description">
              <TextArea
                rows={4}
                value={this.state.newTicket.description}
                placeholder="Description"
                onChange={this.changeDescription}
              />
            </FormItem>
            <FormItem label="Contact Information">
              <Input
                type="text"
                value={this.state.newTicket.contact}
                placeholder="Contact Information"
                onChange={this.changeContact}
              />
            </FormItem>
          </Form>
        </Modal>

        <Table
          rowKey={(record) => record.id}
          {...this.state.tableConfiguration}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}

export default TicketRecord;
