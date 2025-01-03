"use client"

import Banner from "@/components/banner";
import MemberOverTimeChart from "@/components/chart/member-over-time";
import Notification from "@/components/Notification";
import { getMembers } from "@/services/member";
import { showToast } from "@/utils";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import MembersOverMembershipChart from "@/components/chart/member-over-membership";
import { getAllPlans } from "@/services/membershipPlan";
import { getPayments } from "@/services/payment";
import PaymentOverTimeChart from "@/components/chart/payment-over-time";

export default function AdminHome() {
  const [memberData, setMemberData] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMembers(), fetchPlans(), fetchPayments()]);
    };
    fetchData();
  }, [])

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await getMembers();
      if (response.success) {
        setMemberData(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin thành viên.");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchPlans = async () => {
    try {
      const res = await getAllPlans();
      if (res.success) {
        setPackageData(res.data);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", res.message || "Không lấy được dữ liệu gói tập.")
    }
  }

  const fetchPayments = async () => {
    try {
      const res = await getPayments();
      if (res.success) {
        setPaymentData(res.data);
      } else {
        showToast("error", res.message);
      }
    } catch (err) {
      showToast("error", res.message || "Không lấy được dữ liệu doanh thu.")
    }
  }

  // Xử lý dữ liệu cho biểu đồ thành viên theo thời gian
  const processMemberOverTimeData = (data) => {
    // Nhóm dữ liệu theo tháng (YYYY-MM)
    const monthCounts = data.reduce((acc, member) => {
      const month = format(parseISO(member.createdAt), "yyyy-MM");
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const dayCounts = data.reduce((acc, member) => {
      const day = format(parseISO(member.createdAt), "yyyy-MM-dd");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
  
    // Chuyển đổi sang mảng và sắp xếp theo thời gian
    return Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const processPaymentData = (data) => {
    const dailyPayment = data.reduce((acc, payment) => {
      const day = format(parseISO(payment.createdAt), "yyyy-MM-dd");
      acc[day] = (acc[day] || 0) + payment.amount;
      return acc;
    }, {})

    return Object.entries(dailyPayment)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return (
    <div className="felx flex-col w-full">
      <main>
        <div className="flex justify-center mb-8">
          <Banner/>
        </div>

        <div className="grid mb-8 grid-cols-1 md:grid-cols-2 gap-4">
          {memberData && (
            <>
              <MemberOverTimeChart data={processMemberOverTimeData(memberData)} />
              <MembersOverMembershipChart data={packageData} />
              <PaymentOverTimeChart data={processPaymentData(paymentData)} />
            </>
          )}
        </div>

        <Notification />
      </main>      
    </div>
  );
}
