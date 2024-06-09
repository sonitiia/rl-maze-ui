const ConfirmModal = ({ onModalConfirm, onModalCancel }) => {
  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-stone-900 p-4 rounded px-12 py-8 flex flex-col gap-8">
        <p className="text-slate-200">Почати навчання?</p>
        <div className="flex justify-end gap-1">
          <button
            onClick={onModalConfirm}
            className="bg-lime-600 hover:bg-lime-600 text-white py-2 px-4 rounded"
          >
            Так
          </button>
          <button
            onClick={onModalCancel}
            className="bg-red-600 hover:bg-rose-600 text-white py-2 px-4 rounded ml-2"
          >
            Ні
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
