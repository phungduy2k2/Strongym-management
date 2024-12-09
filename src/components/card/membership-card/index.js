"use client";

import MembershipDetailModal from "@/components/modal/membership-detail-modal";
import Notification from "@/components/Notification";
import { Button } from "@/components/ui/button";
import { getMemberById, updateMember } from "@/services/member";
import { getAllPlans, updatePlan } from "@/services/membershipPlan";
import { createPayment } from "@/services/payment";
import { showToast } from "@/utils";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

const stripePromise = loadStripe(
  "pk_test_51QFAkUK75TYYGOvNTKpUDWmECZve6RrLFFKddJFlA1tfJqUmcWvmimz2RaP0jPKs6XF1rdzKeeZ3GHJjxRkBGOSo00gWa399z0"
);

const initialPaymentData = {
  customer: "",
  memberId: null,
  membershipPlanId: null,
  classId: null,
  amount: 0,
  currency: "VND",
  description: "",
  paymentMethod: "stripe",
};

export default function Membership({ userInfo }) {
  const pathname = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchPlans(), checkActiveMember()])
    }
    fetchData()
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPlans();
      console.log(response, "response plans");
      if (response.success) {
        setPlans(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin gói tập.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkActiveMember = async () => {
    try {
      const response = await getMemberById(userInfo.memberId);
      if (response.success) {
        setCurrentMember(response.data);
        if (response.data.status === "active") {
          setIsRegistered(true);
        }
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Không lấy được thông tin thành viên của bạn.");
    }
  };

  // hàm thanh toán gói tập qua Stripe
  const handlePayment = async (plan) => {
    setIsLoading(true);
    const stripe = await stripePromise;
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName: plan.name, price: plan.price }),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("currentPlan", JSON.stringify(plan));
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
      }
    } catch (err) {
      console.error("Payment error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  // hàm tạo bản ghi Payment sau khi đăng ký gói tập thành công
  async function handleCreatePayment(plan) {
    console.log(userInfo, "userInfo");

    try {
      const paymentData = {
        ...initialPaymentData,
        customer: userInfo.username,
        memberId: userInfo.memberId,
        membershipPlanId: plan._id,
        amount: plan.price,
        description: `Thanh toán cho ${plan.name}`,
      };
      console.log(paymentData, "new paymentData");

      const response = await createPayment(paymentData);
      if (response.success) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // hàm cập nhật member (status, membershipPlanId, expiredDate sau khi đăng ký gói tập thành công)
  async function handleUpdateMember(memberId, plan) {
    try {
      const dateNow = new Date();
      const updateMemberData = {
        ...currentMember,
        membershipPlanId: plan._id,
        status: "active",
        expiredDate: format(
          dateNow.setMonth(dateNow.getMonth() + 1),
          "yyyy-MM-dd"
        ),
      };
      console.log(updateMemberData, "updateMemberData");

      const response = await updateMember(memberId, updateMemberData);
      console.log(response, "response updateMember");

      if (response.success) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Có lỗi khi cập nhật thông tin thành viên.");
    }
  }

  // hàm tăng giá trị total_member của gói tập
  async function handleUpdateMembership(plan) {
    try {
      const response = await updatePlan(plan._id, {
        ...plan,
        total_member: plan.total_member + 1
      })
      if(response.success) {
        console.log(response, 'response updatePlan');
        
        showToast("success", response.message)
      } else {
        showToast("error", response.message)
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (pathname.get("status") === "success") {
      const currentPlan = JSON.parse(sessionStorage.getItem("currentPlan"));
      console.log(currentPlan, "currentPlan");
      const handleData = async () => {
        await Promise.all([
          handleCreatePayment(currentPlan),
          handleUpdateMember(userInfo.memberId, currentPlan),
          handleUpdateMembership(currentPlan)
        ]);
      }
      handleData();
      
    }
  }, [pathname]);

  const handleOpenDetails = (plan) => {
    setSelectedPlan(plan);
  };
  const handleCloseDetails = () => {
    setSelectedPlan(null);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">
          {isRegistered
            ? "Bạn đang là thành viên phòng tập!"
            : "Bạn hãy đăng ký gói tập phù hợp nhé!"}
        </h1>
        {isLoading ? (
          <div className="flex mt-10 justify-center items-center">
            <HashLoader loading={isLoading} color="#1e293b" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="flex flex-col bg-gray-200 rounded-lg shadow-md overflow-hidden w-full max-w-sm"
              >
                <div className="flex justify-center">
                  <Image
                    src="/icons/plan-icon.png"
                    alt={plan.name}
                    height={150}
                    width={150}
                    objectFit="cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <span className="text-lg text-gray-600 font-semibold italic">
                      {plan.price}
                    </span>
                  </div>
                  <div className="flex justify-between space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePayment(plan)}
                      className="flex-1 bg-gradient-to-b from-green-500 to-green-600 text-white shadow hover:from-green-600 hover:to-green-700 hover:text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
                      disabled={isRegistered}
                    >
                      Đăng ký
                    </Button>
                    <Button
                      onClick={() => handleOpenDetails(plan)}
                      className="flex-1 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <MembershipDetailModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={handleCloseDetails}
        />

        <Notification />
      </div>
    </Elements>
  );
}
