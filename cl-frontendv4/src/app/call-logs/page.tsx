"use client";

import Header from "@/components/Header";
import { useEffect, useState } from 'react';
import CallLogs from '../../components/CallLogs';
import ModalPortal from '../../components/ModalPortal';
import modalStyles from '../../../styles/Modal.module.css';
import "react-responsive-modal/styles.css";
import Modal from "react-responsive-modal";
import '../../app/globals.css'

const Page = () => {
    const [tran, setTran]: [any, any] = useState([]);
    const [modalShow, setModalShow]: [any, any] = useState(false);

  return (
    <>
      <Header theme="dark" hideActionButton={true} isUserLogged={true} />
      <CallLogs parentTran={setTran} modShow={setModalShow} />
      {(
      <Modal open={modalShow} onClose={() => setModalShow(false)}>
      <div>
          <div>
            <div>
              <h4>Transcript</h4>
            </div>
            <div className={modalStyles.body}>
            {
                tran.length ? tran.map((dat: any, id: any) => {
                  return (<p key={`transcript-${id}`}>Participant: {dat.participant} - {dat.content}</p>)
                }) : <p>No transcript</p>
            }
            </div>
          </div>
        </div>
        </Modal>
      )}
    </>
  );
};

export default Page;
