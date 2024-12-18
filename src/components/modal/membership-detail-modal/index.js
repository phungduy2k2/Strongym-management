import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function MembershipDetailModal({ plan, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md h-full p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{plan.price.toLocaleString("vi-VN")} ₫</p>
            <div className="prose whitespace-pre-wrap">{plan.description}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
