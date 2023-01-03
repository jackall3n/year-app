import { PropsWithChildren } from "react";

interface Props {
  onClose(): void;
}

function Modal({ children, onClose }: PropsWithChildren<Props>) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      <div className="relative z-40 bg-white p-5 mx-auto max-w-[300px] mt-20 rounded-md">
        {children}
      </div>
    </div>
  );
}

export default Modal;
