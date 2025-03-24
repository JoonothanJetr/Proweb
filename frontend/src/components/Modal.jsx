import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type }) => {
  if (!isOpen) return null;

  const getButtonClass = () => {
    switch (type) {
      case 'delete':
        return 'btn-danger';
      case 'edit':
        return 'btn-primary';
      default:
        return 'btn-primary';
    }
  };

  return (
    <>
      {/* Backdrop dengan efek blur */}
      <div 
        className="modal-backdrop" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 1050
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="modal d-block" 
        style={{ 
          zIndex: 1051,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title">
                {type === 'delete' && (
                  <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill text-danger me-2" />
                    <span className="modal-title-text">{title}</span>
                  </div>
                )}
                {type === 'edit' && (
                  <div className="d-flex align-items-center">
                    <i className="bi bi-pencil-fill text-primary me-2" />
                    <span className="modal-title-text">{title}</span>
                  </div>
                )}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
              />
            </div>
            <div className="modal-body py-4 text-center">
              <p className="modal-message mb-0">{message}</p>
            </div>
            <div className="modal-footer border-top-0 justify-content-center">
              <div className="d-flex gap-3">
                <button 
                  type="button" 
                  className="btn btn-secondary px-4 py-2" 
                  onClick={onClose}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  {cancelText || 'Batal'}
                </button>
                <button 
                  type="button" 
                  className={`btn ${getButtonClass()} px-4 py-2`}
                  onClick={onConfirm}
                >
                  {type === 'delete' && <i className="bi bi-trash me-2"></i>}
                  {type === 'edit' && <i className="bi bi-pencil me-2"></i>}
                  {confirmText || 'Konfirmasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal; 