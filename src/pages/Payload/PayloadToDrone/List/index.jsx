
// New COMPONENT

import React, { Component } from 'react';
import {Table, Space, Input, Form, Select, Modal, DatePicker, Row, Col, Spin, notification} from 'antd';
import { Button } from 'antd';
import StyleList from '../index.style';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Moment from 'moment';
 

class PayloadDroneHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listPayloadDroneHistory:[],
      payloadId: '',
      PayloadOptions: [],
      PayloadTypeOptions: [],
      idPayloadReturn: null,
      visableReturnModal: false,

      payloadCode: '',
      payloadName: '',
      status: '',
      startedAt: '',
      type: '',
      loadingModal: false,

      droneName: '',
      isGetAllHistoryPayload: true,
      listAllHistories: [],
    }
  }

  openNotificationSucess = (message) => {
    notification.success({
      message: message,
    })
  };

  openNotificationError = (message) => {
    notification.error({
      message: message,
    })
  };


  componentDidMount() {
    this.setState({isGetAllHistoryPayload: true});
    this.getAllPayload();
    this.getAllTypePayload();
    this.getAllHistories();
  }

  getAllHistories () {
    this.setState({loadingModal: true});
    axios.get('https://dsd06.herokuapp.com/api/payloadregister/allHistories')
    .then(res => {
      this.setState({loadingModal: false});
      var listAllHistoriesFromServer = res.data;
      var listHistoriesHasPayloadNull = [];
      var listHistoriesHasPayload = [];

      listAllHistoriesFromServer.map(history => {
        if (history.payload == null || history.sdCardId == null || history.sdCardId == '') {
          listHistoriesHasPayloadNull.push(history);
        } else {
          listHistoriesHasPayload.push(history);
        }
      })

      this.setState({listAllHistories: listHistoriesHasPayload});
    })
  }

  getAllPayload() {
    axios.get('https://dsd06.herokuapp.com/api/payload')
    .then(res => {
      const options = res.data.map(payload =>
        ({
          label: payload.name,
          value: payload._id,
        })
      )
      this.setState({PayloadOptions: options});
    })
  }

  getAllTypePayload() {
    axios.get(`https://dsd06.herokuapp.com/api/payloadtype`)
      .then(res => {
        const options = res.data.map(payload =>
          ({
            label: payload.name,
            value: payload._id,
          })
        )
        this.setState({ PayloadTypeOptions: options });
      })
    
  }

  handleFindPayloadHistory(values){
    this.setState({isGetAllHistoryPayload: false});
    this.setState({loadingModal: true});
    axios.get('https://dsd06.herokuapp.com/api/payloadregister/histories/' + values.payloadId)
      .then(res => {
        this.setState({loadingModal: false});
        const listPayloadDroneHistoryFromServer = res.data;
        console.log(values.payloadId);
        listPayloadDroneHistoryFromServer.map(payloadHistory => {
          const droneId = payloadHistory.droneId;
        
          this.findDroneById(droneId);

        })
        this.setState({ listPayloadDroneHistory: listPayloadDroneHistoryFromServer });
        // this.setState({ payloadId: res.data.payload});
      })

  }

  findDroneById(droneId) {
       axios.get('http://skyrone.cf:6789/drone/getById/' + droneId)
    .then(res => {
      const drone = res.data;
      console.log(drone);
      this.setState({
        droneName: drone.name,
      })
    })
  }

  handleCancelReturnPayload = e => {
    this.setState({ visableReturnModal: false })
  }

  showModalReturnPayload(record) {
    this.setState({ visableReturnModal: true })
    // this.setState({ idPayloadReturn: this.state.payloadId })
    this.setState({ idPayloadReturn: record.payloadId })
  }

  returnPayload(valuesOfReturnPayload) {
    // const fee = valuesOfReturnPayload.fee;
    const fee = 0;
    const qs = require('qs');
    axios.post('https://dsd06.herokuapp.com/api/payloadregister/return/' + this.state.idPayloadReturn, qs.stringify({'fee': fee}))
    .then(res => {
        this.setState({ visableReturnModal: false })
        if (res.status === 200) {
          this.openNotificationSucess("Trả payload thành công");
          this.getAllHistories();
        } else {
          this.openNotificationError(res.data.message || "Hệ thống đang gặp lỗi!")
        }
        // setTimeout(function() {
        //   window.location.reload(false);
        // }, 2000)
    })
  }

  renderModalReturnPayload() {
    return <div>
      <Form onFinish= {(valuesOfReturnPayload) => this.returnPayload(valuesOfReturnPayload)}>
      <p>Bạn có chắc trả lại payload này?</p>
      {/* <Form.Item label="Chi phí" name="fee" rules={[{required: true, message: 'Vui lòng nhập chi phí!'}]}>
        <Input></Input>
      </Form.Item> */}
      <Button type="primary" htmlType="submit" danger>Trả payload</Button>
      </Form>
   
    </div>
  }

  render() {
    //let history = useHistory();
    const typeDeviceOption = [
      { value: 'camera', label: 'Camera' },
      { value: 'micro', label: 'Micro' },
      { value: 'sensor', label: 'Sensor' }
    ]
    
    const columns = [
      // {
      //   title: 'STT',
      //   dataIndex: 'id',
      //   key: 'id',
      // },
      {
        title: 'Mã payload',
        dataIndex: 'payloadCode',
        key: 'payloadCode',
      },
      {
        title: 'Tên payload',
        dataIndex: 'payloadName',
        key: 'payloadName',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Tên Drone',
        dataIndex: 'droneName',
        key: 'droneName',
      },
      {
        title: 'Thẻ nhớ',
        dataIndex: 'memory',
        key: 'memory',
      },
      // {
      //   title: 'Phí dịch vụ',
      //   dataIndex: 'fee',
      //   key: 'fee'
      // },
      {
        title:  'Lý do',
        dataIndex: 'reason',
        key: 'reason'
      },
      // {
      //   title: 'Ngày đăng ký',
      //   dataIndex: 'createdTime',
      //   key: 'createdTime',
      // },
      // {
      //   title: 'Payload',
      //   dataIndex: 'payloadId',
      //   key: 'payloadId'
      // },
      {
        title: 'Thời gian bắt đầu',
        dataIndex: 'startedAt',
        key: 'startedAt'
      },
      {
        title: 'Thời gian kết thúc',
        dataIndex: 'finishedAt',
        key: 'finishedAt'
      },
      {
        title: 'Loại hoạt động',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Hành động',
        key: 'operation',
        width: 100,
        // dataIndex: 'payloadId',
        render: (text, record) => (
          <Space size="small" >
            {/* <Button type="link" onClick={() => this.props.history.push('/edit-signup-payload-drone')}>Sửa</Button> */}
            {record.status == "working" ? <Button style={{backgroundColor: "red", color:"white"}} danger type="text" onClick={() => this.showModalReturnPayload(record)}>Trả payload</Button> : <div/>}
            {/* {record.status == "working" ? <Button type="text" onClick={() => this.showModalReturnPayload(record)}>Trả payload</Button> : <div/>} */}
            {record.status == "fixing" ? <Button style={{backgroundColor: "red", color:"white"}} danger type="text" onClick={() => this.showModalReturnPayload(record)}>Trả payload</Button> : <div/>}
          </Space>
        ),
      },
    ];
    var dataSource = [{}];
    if (this.state.isGetAllHistoryPayload === true) {
      dataSource = 
      this.state.listAllHistories.map(payloadDroneHistory =>
        ({
            // droneId: payloadDroneHistory._id,
            droneName: this.state.droneName,
            payloadId: payloadDroneHistory.payload._id,
            payloadCode: payloadDroneHistory.payload.code,
            payloadName: payloadDroneHistory.payload.name,
            startedAt: Moment(payloadDroneHistory.startedAt).format("YYYY-MM-DD hh:mm:ss"),
            finishedAt: Moment(payloadDroneHistory.finishedAt).format("YYYY-MM-DD hh:mm:ss"),
            type: payloadDroneHistory.type,
            // fee: payloadDroneHistory.fee,
            status: payloadDroneHistory.payload.status,
            memory: payloadDroneHistory.sdCardId.name + payloadDroneHistory.sdCardId.volume,
            reason: payloadDroneHistory.reason,
        })
      )
    } else {
      dataSource = 
      this.state.listPayloadDroneHistory.map(payloadDroneHistory =>
        ({
            // droneId: payloadDroneHistory._id,
            droneName: this.state.droneName,
            payloadId: payloadDroneHistory.payload._id,
            payloadCode: payloadDroneHistory.payload.code,
            payloadName: payloadDroneHistory.payload.name,
            startedAt: Moment(payloadDroneHistory.startedAt).format("YYYY-MM-DD hh:mm:ss"),
            finishedAt: Moment(payloadDroneHistory.finishedAt).format("YYYY-MM-DD hh:mm:ss"),
            type: payloadDroneHistory.type,
            // fee: payloadDroneHistory.fee,
            status: payloadDroneHistory.payload.status,
            memory: payloadDroneHistory.sdCardId.name + payloadDroneHistory.sdCardId.volume,
            reason: payloadDroneHistory.reason,
        })
      )
    }
  
    const { visible, visibleAdd, visableReturnModal, currentTable, tables, loadingModal } = this.state;

    
    return (
    <StyleList>
      <div>
      <h2>Danh sách lịch sử đăng ký payload drone</h2>
        <Form
          layout="horizontal"
           className="searchtype"
           onFinish={(values) => this.handleFindPayloadHistory(values)}

        >
          <Row justify="space-around">
            <Col span={9}>
              <Form.Item label="Payload" name="payloadId">
                <Select options={this.state.PayloadOptions}></Select>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
        <Button type="primary" className="buttontype" onClick={() => this.props.history.push('/add-signup-payload-drone')}>Đăng ký mới</Button>
        <Spin spinning={loadingModal} tip="Loading...">
        <Table dataSource={dataSource} columns={columns} />
        </Spin>
        </div>

        <Modal
          title="Trả Payload"
          visible={visableReturnModal}
          // onOk={this.handleOkDelete}
          onCancel={this.handleCancelReturnPayload}
          footer={null}
        >
          {
            this.renderModalReturnPayload()
          }
        </Modal>
    </StyleList>
    );
  }
}
export default PayloadDroneHistory; 
