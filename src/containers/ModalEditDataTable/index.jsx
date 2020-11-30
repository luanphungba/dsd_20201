import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { Form, Input, Col, Row } from "antd";
import React, { useEffect, useState, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: 20,
  },
  formItem: {
    padding: 10,
    margin: 0
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  button: {
    margin: theme.spacing(1),
  },

  divButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));



export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [drones, setDrones] = useState([]);

  const getData = () => {
    fetch("http://skyrone.cf:6789/drone/getByCode/" + props.code)
      .then(response => response.json())
      .then(json => {
        setDrones(json);
        console.log(json);
        setOpen(true);
      });
  };

  const handleOpen = () => {
      getData();
      
  };

  const handleClose = () => {
    setOpen(false);
  };
  const delteDrone = () => {
    fetch("http://skyrone.cf:6789/drone/delete/" + props.id)
      .then(response => response.json())
      .then(json => {
        setDrones(json);
        alert("Đã xóa thành công")
        setOpen(false);
      });
  };
  const initFormData = () => {
    console.log('name '+drones.name)
    setName(drones.name);
    setBrand(drones.brand);
    setColor(drones.color);
    setDimensions(drones.dimensions);
    setMaxFlightHeight(drones.maxFlightHeight);
    setMaxFlightRange(drones.maxFlightRange);
    setMaxFlightSpeed(drones.maxFlightSpeed);
    setMaxFlightTime(drones.maxFlightTime);
    setBattery(drones.rangeBattery);
  }
  const [name, setName] = useState(drones.name);
  const [brand, setBrand] = useState(drones.brand);
  const [color, setColor] = useState(drones.color);
  const [dimensions, setDimensions] = useState(drones.dimensions);
  const [maxFlightHeight, setMaxFlightHeight] = useState(drones.maxFlightHeight);
  const [maxFlightRange, setMaxFlightRange] = useState(drones.maxFlightRange);
  const [maxFlightSpeed, setMaxFlightSpeed] = useState(drones.maxFlightSpeed);
  const [maxFlightTime, setMaxFlightTime] = useState(drones.maxFlightTime);
  const [rangeBattery, setBattery] = useState(drones.rangeBattery);
  const saveDrone = () => {
    initFormData();
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    headers.append('Access-Control-Allow-Origin', '*');

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
        brand: brand,
        color: color,
        dimensions: dimensions,
        id: props.id,
        idLog: 0,
        maxFlightHeight: maxFlightHeight,
        maxFlightRange: maxFlightRange,
        maxFlightSpeed: maxFlightSpeed,
        maxFlightTime: maxFlightTime,
        name: name,
        rangeBattery: rangeBattery,
        task: 0,
        used: false
      })
    };
    fetch('http://skyrone.cf:6789/drone/save', requestOptions)
    .then(response => response.text())
    .then(contents =>  {
      alert("Đã cập nhật thành công"); 
      setOpen(false)})
    .catch(() => console.log("Can’t access " + 'http://skyrone.cf:6789/drone/save' + " response. Blocked by browser?"))
      
  }

  return (
    <div>

      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        startIcon={<EditOutlinedIcon />}
      >
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Id# : {props.id} </h2>
            <Row >
              <Col>
                <Form.Item className={classes.formItem}>
                  <h4>Tên</h4>
                  <Input
                    defaultValue={drones.name}
                    className={classes.input}
                    onChange={event => setName(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Nhãn Hiệu</h4>
                  <Input
                    defaultValue={drones.brand}
                    className={classes.input}
                    onChange={event => setBrand(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Màu</h4>
                  <Input
                    type="text" 
                    defaultValue={drones.color}
                    className={classes.input}
                    onChange={event => setColor(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Kích thước</h4>
                  <Input
                    defaultValue={drones.dimensions}
                    className={classes.input}
                    onChange={event => setDimensions(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Giới hạn tầm bay (m)</h4>
                  <Input
                    defaultValue={drones.maxFlightRange}
                    className={classes.input}
                    onChange={event => setMaxFlightRange(event.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item className={classes.formItem}>
                  <h4>Tốc độ tối đa (m/phút)</h4>
                  <Input
                    defaultValue={drones.maxFlightSpeed}
                    className={classes.input}
                    onChange={event => setMaxFlightSpeed(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Thời gian bay (phút)</h4>
                  <Input
                    defaultValue={drones.maxFlightTime}
                    className={classes.input}
                    onChange={event => setMaxFlightTime(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Trần bay (m)</h4>
                  <Input
                    defaultValue={drones.maxFlightHeight}
                    className={classes.input}
                    onChange={event => setMaxFlightHeight(event.target.value)}
                  />
                </Form.Item>
                <Form.Item className={classes.formItem}>
                  <h4>Dung lượng pin (mAh)</h4>
                  <Input
                    defaultValue={drones.rangeBattery}
                    className={classes.input}
                    onChange={event => setBattery(event.target.value)}
                  />
                </Form.Item>


              </Col>

            </Row>
            <div className={classes.divButton}>
              <Button
                onClick={delteDrone}
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
              >
                Xóa Drone
              </Button>
              <Button
                onClick={saveDrone}
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Lưu
              </Button>

              
             </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );

}

