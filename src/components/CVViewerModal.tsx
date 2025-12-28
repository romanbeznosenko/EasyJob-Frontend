import React from 'react';
import { Modal } from 'antd';

interface CVViewerModalProps {
  visible: boolean;
  pdfUrl: string;
  filename: string;
  onClose: () => void;
}

const CVViewerModal: React.FC<CVViewerModalProps> = ({ visible, pdfUrl, filename, onClose }) => {
  return (
    <Modal
      title={filename}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={null}
      centered
      styles={{
        body: { padding: 0, height: '80vh' }
      }}
      transitionName="ant-zoom"
      maskTransitionName="ant-fade"
      afterClose={() => {
        // Clean up iframe when modal closes
      }}
    >
      <iframe
        src={pdfUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          transition: 'opacity 0.3s ease-in-out',
          opacity: visible ? 1 : 0
        }}
        title={filename}
      />
    </Modal>
  );
};

export default CVViewerModal;
