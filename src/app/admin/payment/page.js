"use client";

import Notification from "@/components/Notification";
import PaymentTable from "@/components/table/payment-table";
import { getPayments } from "@/services/payment";
import { showToast } from "@/utils";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    try {
      setIsLoading(true);
      const response = await getPayments();
      if (response.success) {
        setPayments(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin doanh thu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col">
      {/* Payment Table */}
      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <PaymentTable payments={payments} />
      )}

      <Notification />
    </div>
  );
}
